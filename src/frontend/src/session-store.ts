import { z } from "zod";
import { generateConversationTitle } from "./title";

export const CHAT_SESSIONS_STORAGE_KEY = "chat-sessions";

const messageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const conversationSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().optional(),
    messages: z.array(messageSchema).optional(),
  })
  .transform((conversation) => {
    const title = conversation.title?.trim();
    return {
      id: conversation.id,
      title: title && title.length > 0 ? title : "Nova conversa",
      messages: conversation.messages ?? [],
    };
  });

export const sessionStoreSchema = z.object({
  conversations: z.array(conversationSchema),
  activeConversationId: z.string().nullable().default(null),
});

export type ChatMessage = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type SessionStore = z.infer<typeof sessionStoreSchema>;

export const emptySessionStore: SessionStore = {
  conversations: [],
  activeConversationId: null,
};

export function loadSessionStore(): SessionStore {
  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
    if (!raw) {
      return emptySessionStore;
    }

    const parsed = sessionStoreSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return emptySessionStore;
    }

    return withValidActiveConversation(parsed.data);
  } catch {
    return emptySessionStore;
  }
}

export function saveSessionStore(store: SessionStore): void {
  try {
    localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Failed to persist chat sessions.", error);
  }
}

export function openDraft(store: SessionStore): SessionStore {
  if (store.activeConversationId === null) {
    return store;
  }

  return {
    ...store,
    activeConversationId: null,
  };
}

export function activateConversation(store: SessionStore, id: string): SessionStore {
  if (store.activeConversationId === id) {
    return store;
  }

  const exists = store.conversations.some((conversation) => conversation.id === id);
  if (!exists) {
    return store;
  }

  return {
    ...store,
    activeConversationId: id,
  };
}

export function appendUserMessage(store: SessionStore, content: string): SessionStore {
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content,
  };
  const active = findActiveConversation(store);

  if (!active) {
    const id = crypto.randomUUID();
    const created: Conversation = {
      id,
      title: titleFromMessage(content),
      messages: [message],
    };

    return {
      conversations: [created, ...store.conversations],
      activeConversationId: id,
    };
  }

  const updated: Conversation = {
    ...active,
    title: active.messages.length === 0 ? titleFromMessage(content) : active.title,
    messages: [...active.messages, message],
  };

  return {
    conversations: [
      updated,
      ...store.conversations.filter((conversation) => conversation.id !== active.id),
    ],
    activeConversationId: active.id,
  };
}

export function appendAssistantMessage(
  store: SessionStore,
  conversationId: string,
  content: string,
): SessionStore {
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
  };
  let found = false;
  const conversations = store.conversations.map((conversation) => {
    if (conversation.id !== conversationId) {
      return conversation;
    }

    found = true;
    return {
      ...conversation,
      messages: [...conversation.messages, message],
    };
  });

  if (!found) {
    return store;
  }

  return {
    ...store,
    conversations,
  };
}

function titleFromMessage(content: string): string {
  const singleLine = content.replace(/\s+/g, " ").trim();
  return generateConversationTitle(singleLine);
}

function findActiveConversation(store: SessionStore): Conversation | undefined {
  if (!store.activeConversationId) {
    return undefined;
  }

  return store.conversations.find(
    (conversation) => conversation.id === store.activeConversationId,
  );
}

function withValidActiveConversation(store: SessionStore): SessionStore {
  if (store.activeConversationId === null) {
    return store;
  }

  const exists = store.conversations.some(
    (conversation) => conversation.id === store.activeConversationId,
  );

  if (exists) {
    return store;
  }

  return {
    ...store,
    activeConversationId: null,
  };
}
