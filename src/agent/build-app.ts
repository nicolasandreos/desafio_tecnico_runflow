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

  app.register(registerRoutes);

  return app;
};
