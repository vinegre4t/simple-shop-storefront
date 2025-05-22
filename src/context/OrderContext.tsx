
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { OrderType, OrderStatus } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export type Order = OrderType;
export type { OrderStatus };

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'created_at'>) => Promise<void>;
  updateOrderStatus: (id: number, status: Order['status']) => Promise<void>;
  getOrdersByUser: (userId: string) => Promise<Order[]>;
  getAllOrders: () => Promise<Order[]>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isAdmin } = useAuth();
  
  // Загружаем заказы при монтировании компонента и изменении пользователя
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        // Загружаем все заказы для админа
        getAllOrders();
      } else {
        // Загружаем только заказы пользователя
        getOrdersByUser(user.id);
      }
    }
  }, [user, isAdmin]);

  // Получение всех заказов (только для админа)
  const getAllOrders = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({
        title: "Ошибка загрузки заказов",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return [];
    } else if (data) {
      setOrders(data);
      setIsLoading(false);
      return data;
    }
    
    setIsLoading(false);
    return [];
  };

  // Получение заказов пользователя
  const getOrdersByUser = async (userId: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({
        title: "Ошибка загрузки заказов",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return [];
    } else if (data) {
      setOrders(data);
      setIsLoading(false);
      return data;
    }
    
    setIsLoading(false);
    return [];
  };

  // Создание нового заказа
  const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
      
    if (error) {
      toast({
        title: "Ошибка создания заказа",
        description: error.message,
        variant: "destructive",
      });
    } else if (data && data[0]) {
      setOrders(prevOrders => [data[0], ...prevOrders]);
      toast({
        title: "Заказ создан",
        description: `Заказ #${data[0].id} успешно оформлен.`,
      });
    }
    
    setIsLoading(false);
  };

  // Обновление статуса заказа
  const updateOrderStatus = async (id: number, status: Order['status']) => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) {
      toast({
        title: "Ошибка обновления статуса",
        description: error.message,
        variant: "destructive",
      });
    } else if (data && data[0]) {
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order.id === id ? { ...order, status: data[0].status } : order
        )
      );
      
      toast({
        title: "Статус обновлен",
        description: `Статус заказа #${id} изменен на "${status}".`,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      createOrder, 
      updateOrderStatus, 
      getOrdersByUser,
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
