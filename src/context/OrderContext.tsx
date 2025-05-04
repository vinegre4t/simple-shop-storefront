
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { CartItem } from './CartContext';
import { User } from './AuthContext';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
  customerName: string;
  customerEmail: string;
};

export type NewOrder = Omit<Order, "id" | "createdAt" | "status">;

interface OrderContextType {
  orders: Order[];
  createOrder: (order: NewOrder) => void;
  updateOrderStatus: (id: number, status: OrderStatus) => void;
  getUserOrders: (userId: number) => Order[];
  getAllOrders: () => Order[];
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock orders for demo purposes
const initialOrders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      { id: 1, name: "Минималистичная футболка", price: 1200, image: "/placeholder.svg", quantity: 2 },
      { id: 3, name: "Кожаный кошелек", price: 2500, image: "/placeholder.svg", quantity: 1 }
    ],
    total: 4900,
    status: 'delivered',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    address: "ул. Пушкина, д. 10, кв. 5",
    customerName: "Иван Иванов",
    customerEmail: "user@example.com"
  }
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createOrder = (order: NewOrder) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    
    toast({
      title: "Заказ создан",
      description: `Номер заказа: #${newOrder.id}`,
    });
    
    return newOrder.id;
  };

  const updateOrderStatus = (id: number, status: OrderStatus) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Статус заказа обновлен",
      description: `Заказ #${id} теперь в статусе: ${status}`,
    });
  };

  const getUserOrders = (userId: number) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      createOrder, 
      updateOrderStatus, 
      getUserOrders,
      getAllOrders,
      isLoading
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
