import { tool } from "langchain";
import * as z from "zod";
import { HttpClient } from "../../http-client.js";
import { createOrderBodySchema } from "../schemas.js";
import { callClient } from "../call-client.js";

const createOrderInputSchema = z.object({
  items: createOrderBodySchema.describe(
    "Lista de produtos e quantidades do pedido",
  ),
});

export function createOrderTool(client: HttpClient) {
  return tool(
    async ({ items }) =>
      callClient("criar_pedido", () => client.createOrder(items)),
    {
      name: "criar_pedido",
      description:
        "Cria um pedido. Chame só quando cada item tiver productId e quantity. A API confirma se o produto existe, se a quantidade é válida e se há estoque.",
      schema: createOrderInputSchema,
    },
  );
}
