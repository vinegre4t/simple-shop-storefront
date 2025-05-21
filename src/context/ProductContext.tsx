
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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
  getProductById: (id: number) => Product | null;
  searchProducts: (query: string) => Product[];
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

  // Получение продукта по ID - теперь синхронная функция
  const getProductById = (id: number) => {
    // Проверяем в локальном состоянии
    const localProduct = products.find(product => product.id === id);
    return localProduct || null;
  };

  // Синхронный поиск продуктов
  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
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
