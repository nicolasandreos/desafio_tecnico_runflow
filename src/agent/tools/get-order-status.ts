import { tool } from "langchain";
import * as z from "zod";
import { HttpClient } from "../../http-client.js";
import { callClient } from "../call-client.js";

const orderIdSchema = z.object({
  id: z.string().min(1).describe("Id do pedido"),
});

export function getOrderStatusTool(client: HttpClient) {
  return tool(
    async ({ id }) =>
      callClient("consultar_status_pedido", () => client.getOrderStatus(id)),
    {
      name: "consultar_status_pedido",
      description:
        "Consulta o status, os itens e o total de um pedido pelo id. Use quando o cliente perguntar de um pedido.",
      schema: orderIdSchema,
    },
  );
}
