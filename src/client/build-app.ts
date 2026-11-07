import Fastify, { type FastifyInstance } from "fastify";
import type { FastifyPluginAsync } from "fastify";
import { orderRoutes } from "./routes/orders.routes.js";
import { productRoutes } from "./routes/products.routes.js";


export const registerRoutes: FastifyPluginAsync = async (app) => {
    await app.register(productRoutes);
    await app.register(orderRoutes);
  };


export const buildApp = (): FastifyInstance => {
    const app = Fastify({
        logger: true,
    });

    app.register(registerRoutes, {
        prefix: "/api/v1",
    });

    return app;
}
