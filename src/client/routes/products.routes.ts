import type { FastifyPluginAsync } from "fastify";
import { findProduct, products } from "../data.js";
import { idParamsSchema, validationMessage } from "../schemas.js";

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/products", async (request, response) => {
    return response.code(200).send(products);
  });

  app.get("/products/:id", async (request, response) => {
    const params = idParamsSchema.safeParse(request.params);
    if (!params.success) {
      return response
        .code(400)
        .send({ error: validationMessage(params.error) });
    }

    const product = findProduct(params.data.id);
    if (!product) {
      return response
        .code(404)
        .send({ error: `Produto não encontrado: ${params.data.id}` });
    }

    return response.code(200).send(product);
  });
};
