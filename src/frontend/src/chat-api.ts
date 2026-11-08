import { z } from "zod";

const chatReplySchema = z.object({
  reply: z.string().min(1),
});

const chatErrorSchema = z.object({
  error: z.string().min(1),
});

export class ChatRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatRequestError";
  }
}

function agentBaseUrl(): string {
  const configured = import.meta.env.VITE_AGENT_BASE_URL;
  if (typeof configured === "string" && configured.trim().length > 0) {
    return configured.trim().replace(/\/$/, "");
  }

  return "http://127.0.0.1:3000";
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${agentBaseUrl()}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, message }),
    });
  } catch (error) {
    console.error("Chat request failed before a response.", error);
    throw new ChatRequestError(
      "Não foi possível falar com o atendimento. Verifique se o servidor está no ar.",
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const parsedError = chatErrorSchema.safeParse(payload);
    throw new ChatRequestError(
      parsedError.success
        ? parsedError.data.error
        : "Não foi possível processar a mensagem.",
    );
  }

  const parsedReply = chatReplySchema.safeParse(payload);
  if (!parsedReply.success) {
    throw new ChatRequestError("O atendimento retornou uma resposta inválida.");
  }

  return parsedReply.data.reply;
}
