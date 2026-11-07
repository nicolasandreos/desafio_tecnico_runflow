import type { Order, Product } from "./schemas.js";

/** Current catalog and past orders. Stock is the available quantity, not derived from orders. */
export const products: Product[] = [
  { id: "1", name: "Mouse sem fio", price: 80, stock: 25 },
  { id: "2", name: "Teclado mecânico", price: 250, stock: 12 },
  { id: "3", name: "Cabo USB-C", price: 30, stock: 0 },
  { id: "4", name: "Suporte para notebook", price: 120, stock: 8 },
  { id: "5", name: "Monitor", price: 900, stock: 5 },
  { id: "6", name: "Webcam", price: 190, stock: 15 },
  { id: "7", name: "Fone de ouvido", price: 160, stock: 20 },
  { id: "8", name: "Caderno", price: 20, stock: 40 },
  { id: "9", name: "Luminária de mesa", price: 90, stock: 10 },
  { id: "10", name: "Garrafa de água", price: 35, stock: 30 },
];

export const orders: Order[] = [
  {
    id: "1",
    status: "confirmed",
    items: [
      { productId: "1", quantity: 1 },
      { productId: "8", quantity: 2 },
    ],
  },
  {
    id: "2",
    status: "shipped",
    items: [{ productId: "2", quantity: 1 }],
  },
  {
    id: "3",
    status: "delivered",
    items: [{ productId: "5", quantity: 1 }],
  },
  {
    id: "4",
    status: "confirmed",
    items: [
      { productId: "6", quantity: 1 },
      { productId: "7", quantity: 1 },
    ],
  },
  {
    id: "5",
    status: "shipped",
    items: [{ productId: "4", quantity: 1 }],
  },
  {
    id: "6",
    status: "delivered",
    items: [{ productId: "10", quantity: 2 }],
  },
  {
    id: "7",
    status: "confirmed",
    items: [{ productId: "8", quantity: 1 }],
  },
  {
    id: "8",
    status: "shipped",
    items: [
      { productId: "9", quantity: 1 },
      { productId: "4", quantity: 1 },
    ],
  },
  {
    id: "9",
    status: "delivered",
    items: [{ productId: "1", quantity: 2 }],
  },
  {
    id: "10",
    status: "confirmed",
    items: [{ productId: "8", quantity: 5 }],
  },
];

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function findOrder(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
