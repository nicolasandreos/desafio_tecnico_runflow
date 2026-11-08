import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

type ComposerProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export function Composer({ disabled = false, onSend }: ComposerProps) {
  const [draft, setDraft] = useState("");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const canSend = !disabled && draft.trim().length > 0;

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) {
      return;
    }

    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 160)}px`;
  }, [draft]);

  function submit() {
    const content = draft.trim();
    if (!content) {
      setDraft("");
      return;
    }

    onSend(content);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    submit();
  }

  return (
    <form className="composer-wrap" onSubmit={handleSubmit}>
      <div className="composer-shell">
        <label className="visually-hidden" htmlFor={fieldId}>
          Mensagem
        </label>
        <textarea
          id={fieldId}
          ref={fieldRef}
          className="composer-input"
          rows={1}
          value={draft}
          placeholder="Envie uma mensagem"
          autoComplete="off"
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="send"
          disabled={!canSend}
          aria-label={disabled ? "Aguardando resposta" : "Enviar mensagem"}
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 19V6M6.5 11.5 12 6l5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
