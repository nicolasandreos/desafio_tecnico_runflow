import { readFileSync } from "node:fs";
import { createAgent, type BaseMessage } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { HttpClient } from "../http-client.js";
import { chatBodySchema, validationMessage } from "./schemas.js";
import { createOrderTool } from "./tools/create-order.js";
import { getOrderStatusTool } from "./tools/get-order-status.js";
import { getProductTool } from "./tools/get-product.js";
import { listProductsTool } from "./tools/list-products.js";

const STORE_SYSTEM_PROMPT = readFileSync(
  new URL("./system-prompt.md", import.meta.url),
  "utf8",
);

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

const memorySaver = new MemorySaver();

let storeAgent: ReturnType<typeof createAgent> | undefined;

function getStoreAgent(): ReturnType<typeof createAgent> {
  if (storeAgent) {
    return storeAgent;
  }

  const model = requiredEnv("GEMINI_MODEL");
  requiredEnv("GOOGLE_API_KEY");
  const client = new HttpClient(requiredEnv("CLIENT_API_BASE_URL"));

  const createdAgent = createAgent({
    model: `google:${model}`,
    tools: [
      listProductsTool(client),
      getProductTool(client),
      getOrderStatusTool(client),
      createOrderTool(client),
    ],
    systemPrompt: STORE_SYSTEM_PROMPT,
    checkpointer: memorySaver,
  });

  storeAgent = createdAgent;
  return createdAgent;
}

function replyText(message: BaseMessage | undefined): string {
  if (!message || message.type !== "ai") {
    throw new Error("O agente não retornou uma resposta");
  }

  const { content } = message;
  if (typeof content !== "string") {
    throw new Error(
      "O agente não retornou uma resposta em texto: " + typeof content,
    );
  }

  const reply = content.trim();
  if (!reply) {
    throw new Error("O agente retornou uma resposta vazia");
  }

  return reply;
}

export async function sendMessage(
  sessionId: string,
  message: string,
): Promise<string> {
  const userMessage = chatBodySchema.safeParse({ sessionId, message });
  if (!userMessage.success) {
    throw new Error(validationMessage(userMessage.error));
  }

  const result = await getStoreAgent().invoke(
    { messages: [{ role: "user", content: userMessage.data.message }] },
    { configurable: { thread_id: userMessage.data.sessionId } },
  );

  const reply = [...result.messages]
    .reverse()
    .find((item) => item.type === "ai");

  return replyText(reply);
}
