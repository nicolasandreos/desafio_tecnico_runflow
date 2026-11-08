import type { Conversation } from "../session-store";

type SidebarProps = {
  open: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
};

export function Sidebar({
  open,
  conversations,
  activeConversationId,
  onSelect,
  onNewConversation,
}: SidebarProps) {
  const draftActive = activeConversationId === null && conversations.length > 0;

  return (
    <aside className={open ? "sidebar is-open" : "sidebar"} aria-label="Conversas">
      <button
        type="button"
        className={draftActive ? "new-chat is-active" : "new-chat"}
        onClick={onNewConversation}
      >
        <PlusIcon />
        <span>Nova conversa</span>
      </button>

      <div className="session-scroll">
        {conversations.length === 0 ? (
          <p className="session-empty">Nenhuma conversa ainda</p>
        ) : (
          <ul className="session-list">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    className={isActive ? "session is-active" : "session"}
                    aria-current={isActive ? "true" : undefined}
                    title={tooltipFor(conversation)}
                    onClick={() => onSelect(conversation.id)}
                  >
                    {conversation.title}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

function tooltipFor(conversation: Conversation): string {
  const firstUserMessage = conversation.messages.find((message) => message.role === "user");
  return firstUserMessage?.content ?? conversation.title;
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
