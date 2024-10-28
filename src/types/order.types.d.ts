
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Full Order interface with all fields (used for GET responses)
export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  orderNumber: string;
  status: "Ожидает оплаты" | "Отправлен" | "Доставлен";
  products: Product[];
  totalAmount: number;
}

// OrderPost type for creating new orders (excluding `id` and `createdAt`)
export type OrderPost = Omit<Order, "id" | "createdAt">;