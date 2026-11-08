import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import type { FastifyPluginAsync } from "fastify";
import { chatRoutes } from "./routes/chat.routes.js";

export const registerRoutes: FastifyPluginAsync = async (app) => {
  await app.register(chatRoutes);
};

export const buildApp = (): FastifyInstance => {
  const app = Fastify({
    logger: true,
  });

  // A interface roda em outra porta local e só chama POST /chat.
  app.register(cors, {
    origin: "http://127.0.0.1:5174",
    methods: ["POST"],
  });
  app.register(registerRoutes);

  return app;
};
