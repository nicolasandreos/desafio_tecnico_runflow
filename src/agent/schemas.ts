import * as z from "zod";

export const idParamsSchema = z.object({
  id: z.string().min(1, "O id é obrigatório"),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, "O produto é obrigatório"),
  quantity: z
    .int("A quantidade deve ser um número inteiro")
    .positive("A quantidade deve ser maior que zero"),
});

export const createOrderBodySchema = z
  .array(orderItemSchema, "O pedido deve ser uma lista de produtos")
  .min(1, "O pedido precisa ter pelo menos um produto");

export const chatBodySchema = z.object({
  sessionId: z
    .string("A sessão é obrigatória")
    .min(1, "A sessão é obrigatória"),
  message: z
    .string("A mensagem é obrigatória")
    .min(1, "A mensagem é obrigatória"),
});

export type ChatBody = z.infer<typeof chatBodySchema>;

export function validationMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return "Requisição inválida";
  }

  return issue.message;
}
