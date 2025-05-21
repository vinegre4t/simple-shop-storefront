
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { ProductType } from '@/lib/supabase';

export type Product = ProductType;
export type NewProduct = Omit<Product, "id" | "created_at">;

interface ProductContextType {
  products: Product[];
  addProduct: (product: NewProduct) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<Product[]>;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем продукты при монтировании компонента
  useEffect(() => {
    fetchProducts();
  }, []);

  // Получение всех продуктов
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({
        title: "Ошибка загрузки товаров",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProducts(data);
    }
    
    setIsLoading(false);
  };

  // Добавление нового продукта
  const addProduct = async (product: NewProduct) => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
      
    if (error) {
      toast({
        title: "Ошибка добавления товара",
        description: error.message,
        variant: "destructive",
      });
    } else if (data && data[0]) {
      setProducts(prevProducts => [data[0], ...prevProducts]);
      toast({
        title: "Товар добавлен",
        description: `${product.name} успешно добавлен.`,
      });
    }
    
    setIsLoading(false);
  };

  // Обновление продукта
  const updateProduct = async (id: number, updatedFields: Partial<Product>) => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('products')
      .update(updatedFields)
      .eq('id', id)
      .select();
      
    if (error) {
      toast({
        title: "Ошибка обновления товара",
        description: error.message,
        variant: "destructive",
      });
    } else if (data && data[0]) {
      setProducts(prevProducts =>
        prevProducts.map(product => 
          product.id === id ? { ...product, ...data[0] } : product
        )
      );
      
      toast({
        title: "Товар обновлен",
        description: `Товар успешно обновлен.`,
      });
    }
    
    setIsLoading(false);
  };

  // Удаление продукта
  const deleteProduct = async (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    
    if (!productToDelete) return;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast({
        title: "Ошибка удаления товара",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProducts(currentProducts => 
        currentProducts.filter(product => product.id !== id)
      );
      
      toast({
        title: "Товар удален",
        description: `${productToDelete.name} удален из каталога.`,
      });
    }
    
    setIsLoading(false);
  };

  // Получение продукта по ID
  const getProductById = async (id: number) => {
    // Сначала проверяем в локальном состоянии
    const localProduct = products.find(product => product.id === id);
    if (localProduct) return localProduct;
    
    // Если не найден локально, запрашиваем с сервера
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Ошибка получения товара:", error);
      return null;
    }
    
    return data;
  };

  // Поиск продуктов
  const searchProducts = async (query: string) => {
    if (!query.trim()) return products;
    
    const lowerCaseQuery = query.toLowerCase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${lowerCaseQuery}%,description.ilike.%${lowerCaseQuery}%,category.ilike.%${lowerCaseQuery}%`);
      
    if (error) {
      console.error("Ошибка поиска товаров:", error);
      return [];
    }
    
    return data || [];
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductById,
      searchProducts,
      isLoading
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
