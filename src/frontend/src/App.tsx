import { useEffect, useState } from "react";
import { Composer } from "./components/Composer";
import { Sidebar } from "./components/Sidebar";
import { Transcript } from "./components/Transcript";
import {
  activateConversation,
  appendUserMessage,
  loadSessionStore,
  openDraft,
  saveSessionStore,
} from "./session-store";

export function App() {
  const [store, setStore] = useState(loadSessionStore);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  function handleSend(message: string) {
    setStore((current) => appendUserMessage(current, message));
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

        <Transcript key={`transcript-${store.activeConversationId ?? "draft"}`} messages={messages} />
        <Composer key={`composer-${store.activeConversationId ?? "draft"}`} onSend={handleSend} />
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
