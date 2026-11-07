import { tool } from "langchain";
import { HttpClient } from "../../http-client.js";
import { idParamsSchema } from "../schemas.js";
import { callClient } from "../call-client.js";

export function getProductTool(client: HttpClient) {
  return tool(
    async ({ id }) => callClient("consultar_produto", () => client.getProduct(id)),
    {
      name: "consultar_produto",
      description:
        "Consulta um produto pelo id, com nome, preço e estoque. Use quando o cliente pedir o detalhe de um produto.",
      schema: idParamsSchema,
    },
  );
}
