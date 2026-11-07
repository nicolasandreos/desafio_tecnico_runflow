import { tool } from "langchain";
import * as z from "zod";
import { HttpClient } from "../../http-client.js";
import { callClient } from "../call-client.js";

export function listProductsTool(client: HttpClient) {
  return tool(
    async () => callClient("listar_produtos", () => client.listProducts()),
    {
      name: "listar_produtos",
      description:
        "Lista os produtos da loja com nome, preço e estoque. Use quando o cliente quiser ver o que está disponível.",
      schema: z.object({}),
    },
  );
}
