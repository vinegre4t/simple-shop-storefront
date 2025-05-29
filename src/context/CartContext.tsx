
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

export type CartItem = {
  product: string; // ID товара
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type Cart = {
  _id: string;
  user: string;
  items: CartItem[];
};

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const loadCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const cartData = await cartAPI.get();
      setItems(cartData.items || []);
    } catch (error: any) {
      console.error('Error loading cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Необходима авторизация",
        description: "Войдите в систему для добавления товаров в корзину.",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.add(productId, quantity);
      await loadCart(); // Перезагружаем корзину
      
      toast({
        title: "Товар добавлен",
        description: "Товар добавлен в корзину.",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка добавления",
        description: error.message || "Не удалось добавить товар в корзину.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await cartAPI.remove(productId);
      await loadCart(); // Перезагружаем корзину
      
      toast({
        title: "Товар удален",
        description: "Товар удален из корзины.",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message || "Не удалось удалить товар из корзины.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      await cartAPI.update(productId, quantity);
      await loadCart(); // Перезагружаем корзину
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить количество.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setItems([]);
      
      toast({
        title: "Корзина очищена",
        description: "Все товары были удалены из корзины.",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка очистки",
        description: error.message || "Не удалось очистить корзину.",
        variant: "destructive",
      });
    }
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      loadCart,
      cartTotal,
      itemCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
