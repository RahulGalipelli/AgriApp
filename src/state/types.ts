export type Money = number;

export type Product = {
  id: string;
  name: string;
  price: Money;
  unit?: string;
  tags?: string[];
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type PaymentMethod = "COD";

export type OrderStatus = "PLACED" | "SHIPPED" | "DELIVERED";

export type OrderLine = {
  productId: string;
  quantity: number;
  price: Money;
};

export type Order = {
  id: string;
  createdAt: number;
  status: OrderStatus;
  address: string;
  paymentMethod: PaymentMethod;
  lines: OrderLine[];
};

