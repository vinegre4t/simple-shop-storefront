
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { ordersAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  product: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
};

export type NewOrder = {
  shippingAddress: string;
};

interface OrderContextType {
  orders: Order[];
  createOrder: (order: NewOrder) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getUserOrders: () => Promise<void>;
  getAllOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdmin } = useAuth();

  const createOrder = async (orderData: NewOrder) => {
    setIsLoading(true);
    try {
      const newOrder = await ordersAPI.create(orderData);
      setOrders(prev => [...prev, newOrder]);
      
      toast({
        title: "Заказ создан",
        description: `Номер заказа: #${newOrder._id}`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка создания заказа",
        description: error.message || "Не удалось создать заказ.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order._id === id ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Статус заказа обновлен",
        description: `Заказ #${id} теперь в статусе: ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления статуса",
        description: error.message || "Не удалось обновить статус заказа.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getUserOrders = async () => {
    setIsLoading(true);
    try {
      const userOrders = await ordersAPI.getUserOrders();
      setOrders(userOrders);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки заказов",
        description: error.message || "Не удалось загрузить заказы.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAllOrders = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const allOrders = await ordersAPI.getAllOrders();
      setOrders(allOrders);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки заказов",
        description: error.message || "Не удалось загрузить заказы.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
