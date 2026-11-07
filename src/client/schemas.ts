import * as z from "zod";

z.config(z.locales.ptBR());

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  stock: z.int().nonnegative(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, "O produto é obrigatório"),
  quantity: z
    .int("A quantidade deve ser um número inteiro")
    .positive("A quantidade deve ser maior que zero"),
});

export const orderStatusSchema = z.enum(["confirmed", "shipped", "delivered"]);

export const orderSchema = z.object({
  id: z.string(),
  status: orderStatusSchema,
  items: z.array(orderItemSchema).min(1),
});

export const idParamsSchema = z.object({
  id: z.string().min(1, "O id é obrigatório"),
});

export const createOrderBodySchema = z
  .array(orderItemSchema, "O pedido deve ser uma lista de produtos")
  .min(1, "O pedido precisa ter pelo menos um produto");

export type Product = z.infer<typeof productSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type Order = z.infer<typeof orderSchema>;

export function validationMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return "Requisição inválida";
  }

  return issue.message;
}
