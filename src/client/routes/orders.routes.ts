import type { FastifyPluginAsync } from "fastify";
import { findOrder, findProduct, orders } from "../data.js";
import {
  createOrderBodySchema,
  idParamsSchema,
  validationMessage,
  type Order,
  type OrderItem,
  type Product,
} from "../schemas.js";

type PlaceOrderResult =
  | { statusCode: 201; order: Order }
  | { statusCode: 400 | 404 | 409; error: string };

function placeOrder(items: OrderItem[]): PlaceOrderResult {
  const selected: { product: Product; quantity: number }[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.productId)) {
      return { statusCode: 400, error: "Produto duplicado no pedido" };
    }
    seen.add(item.productId);
    const product = findProduct(item.productId);
    if (!product) {
      return {
        statusCode: 404,
        error: `Produto não encontrado: ${item.productId}`,
      };
    }
    if (item.quantity > product.stock) {
      return {
        statusCode: 409,
        error: `Estoque insuficiente para o produto ${product.id}`,
      };
    }
    selected.push({ product, quantity: item.quantity });
  }

  for (const item of selected) {
    item.product.stock -= item.quantity;
  }

  const order: Order = {
    id: `${orders.length + 1}`,
    status: "confirmed",
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
  orders.push(order);

  return { statusCode: 201, order };
}

export const orderRoutes: FastifyPluginAsync = async (app) => {
  app.get("/orders/:id", async (request, response) => {
    const params = idParamsSchema.safeParse(request.params);
    if (!params.success) {
      return response
        .code(400)
        .send({ error: validationMessage(params.error) });
    }

    const order = findOrder(params.data.id);
    if (!order) {
      return response
        .code(404)
        .send({ error: `Pedido não encontrado: ${params.data.id}` });
    }

    const items: { name: string; price: number; quantity: number }[] = [];
    for (const item of order.items) {
      const product = findProduct(item.productId);
      if (!product) {
        return response
          .code(404)
          .send({ error: `Produto não encontrado: ${item.productId}` });
      }
      items.push({
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return response.code(200).send({
      id: order.id,
      status: order.status,
      items,
      total,
    });
  });

  app.post("/orders", async (request, response) => {
    const body = createOrderBodySchema.safeParse(request.body);
    if (!body.success) {
      return response.code(400).send({ error: validationMessage(body.error) });
    }

    const result = placeOrder(body.data);
    if (result.statusCode === 201) {
      const order = result.order;
      const items: { name: string; price: number; quantity: number }[] = [];
      for (const item of order.items) {
        const product = findProduct(item.productId);
        if (!product) {
          return response
            .code(404)
            .send({ error: `Produto não encontrado: ${item.productId}` });
        }
        items.push({
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return response.code(201).send({
        id: order.id,
        status: order.status,
        items,
        total,
      });
    }

    return response.code(result.statusCode).send({ error: result.error });
  });
};
