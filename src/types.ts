export interface CakeMenu {
  [key: string]: {
      price: number;
      sizes: string[];
  };
}

export interface SizeMultipliers {
  [key: string]: number;
}

export interface Order {
  flavor: string;
  size: string;
  price: number;
  status: 'pending' | 'paid' | 'processing' | 'completed';
  paymentIntentId: string;
  customerPhone?: string;
  platform: 'telegram' | 'whatsapp';
  userId: string;
  orderDate: Date;
}

export interface OrderStore {
  [key: number]: Order;
}
