import type { OrderItem, OrderStatus, Product } from "./client/schemas.js";

export type OrderDetails = {
  id: string;
  status: OrderStatus;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
};

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    return await response.json() as Product[];
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    return await response.json() as Product;
  }

  async getOrderStatus(id: string): Promise<OrderDetails> {
    const response = await fetch(`${this.baseUrl}/orders/${id}`);
    return await response.json() as OrderDetails;
  }

  async createOrder(items: OrderItem[]): Promise<OrderDetails> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(items),
    });
    return await response.json() as OrderDetails;
  }
}
