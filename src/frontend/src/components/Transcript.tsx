import { useEffect, useRef } from "react";
import type { ChatMessage } from "../session-store";

type TranscriptProps = {
  messages: ChatMessage[];
  pending: boolean;
};

export function Transcript({ messages, pending }: TranscriptProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0 && !pending;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, pending]);

  return (
    <div
      className={isEmpty ? "transcript is-empty" : "transcript"}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={pending}
    >
      <div className="thread">
        {isEmpty ? (
          <p className="greeting">Olá! Como posso ajudar você hoje?</p>
        ) : (
          messages.map((message) => (
            <article
              key={message.id}
              className={
                message.role === "user" ? "message message-user" : "message message-assistant"
              }
            >
              {message.content}
            </article>
          ))
        )}
        {pending ? <p className="pending">Aguardando resposta...</p> : null}
        <div ref={endRef} />
      </div>
    </div>
  );
}
