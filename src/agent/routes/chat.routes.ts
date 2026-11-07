import type { FastifyPluginAsync } from "fastify";
import { sendMessage } from "../agent.js";
import { chatBodySchema, validationMessage } from "../schemas.js";

export const chatRoutes: FastifyPluginAsync = async (app) => {
  app.post("/chat", async (request, response) => {
    const body = chatBodySchema.safeParse(request.body);
    if (!body.success) {
      return response
        .code(400)
        .send({ error: validationMessage(body.error) });
    }

    try {
      const reply = await sendMessage(body.data.sessionId, body.data.message);
      return response.code(200).send({ reply });
    } catch (error) {
      console.error("Erro ao processar a mensagem: ", error);
      return response
        .code(500)
        .send({ error: "Não foi possível processar a mensagem." });
    }
  });
};
