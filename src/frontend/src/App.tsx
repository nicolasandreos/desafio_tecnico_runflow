import { useEffect, useState } from "react";
import { ChatRequestError, sendChatMessage } from "./chat-api";
import { Composer } from "./components/Composer";
import { Sidebar } from "./components/Sidebar";
import { Transcript } from "./components/Transcript";
import {
  activateConversation,
  appendAssistantMessage,
  appendUserMessage,
  loadSessionStore,
  openDraft,
  saveSessionStore,
} from "./session-store";

export function App() {
  const [store, setStore] = useState(loadSessionStore);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [failedSessionId, setFailedSessionId] = useState<string | null>(null);
  const [communicationError, setCommunicationError] = useState<string | null>(null);

  useEffect(() => {
    saveSessionStore(store);
  }, [store]);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  const active =
    store.conversations.find((conversation) => conversation.id === store.activeConversationId) ??
    null;
  const messages = active?.messages ?? [];
  const isPending = active !== null && pendingSessionId === active.id;
  const visibleError =
    communicationError && failedSessionId === store.activeConversationId
      ? communicationError
      : null;

  async function handleSend(message: string) {
    if (pendingSessionId) {
      return;
    }

    const next = appendUserMessage(store, message);
    const sessionId = next.activeConversationId;
    if (!sessionId) {
      return;
    }

    setStore(next);
    setPendingSessionId(sessionId);
    setFailedSessionId(null);
    setCommunicationError(null);

    try {
      const reply = await sendChatMessage(sessionId, message);
      setStore((current) => appendAssistantMessage(current, sessionId, reply));
    } catch (error) {
      console.error("Failed to receive the agent reply.", error);
      const text =
        error instanceof ChatRequestError
          ? error.message
          : "Não foi possível processar a mensagem.";
      setFailedSessionId(sessionId);
      setCommunicationError(text);
    } finally {
      setPendingSessionId((current) => (current === sessionId ? null : current));
    }
  }

  function handleSelect(id: string) {
    setStore((current) => activateConversation(current, id));
    setSidebarOpen(false);
  }

  function handleNewConversation() {
    setStore((current) => openDraft(current));
    setSidebarOpen(false);
  }

  return (
    <div className="app">
      <Sidebar
        open={sidebarOpen}
        conversations={store.conversations}
        activeConversationId={store.activeConversationId}
        onSelect={handleSelect}
        onNewConversation={handleNewConversation}
      />

      {sidebarOpen ? (
        <button
          type="button"
          className="backdrop"
          aria-label="Fechar conversas"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className={messages.length === 0 ? "chat is-empty" : "chat"}>
        <header className="topbar">
          <button
            type="button"
            className="menu-button"
            aria-label="Abrir conversas"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <PanelIcon />
          </button>
        </header>

        <Transcript
          key={`transcript-${store.activeConversationId ?? "draft"}`}
          messages={messages}
          pending={isPending}
        />
        {visibleError ? (
          <p className="chat-error" role="alert">
            {visibleError}
          </p>
        ) : null}
        <Composer
          key={`composer-${store.activeConversationId ?? "draft"}`}
          disabled={isPending || pendingSessionId !== null}
          onSend={handleSend}
        />
      </main>
    </div>
  );
}

function PanelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3.5"
        y="4"
        width="17"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9.5 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
