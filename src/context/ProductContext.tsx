
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { productsAPI } from '@/lib/api';

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type NewProduct = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

interface ProductContextType {
  products: Product[];
  addProduct: (product: NewProduct) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  loadProducts: (keyword?: string) => Promise<void>;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadProducts = async (keyword?: string) => {
    setIsLoading(true);
    try {
      const data = await productsAPI.getAll(keyword);
      setProducts(data);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки товаров",
        description: error.message || "Не удалось загрузить товары.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (product: NewProduct) => {
    try {
      const newProduct = await productsAPI.create(product);
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Товар добавлен",
        description: `${product.name} успешно добавлен.`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка добавления товара",
        description: error.message || "Не удалось добавить товар.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updatedProduct = await productsAPI.update(id, updatedFields);
      setProducts(currentProducts => 
        currentProducts.map(product => 
          product._id === id ? { ...product, ...updatedProduct } : product
        )
      );
      
      toast({
        title: "Товар обновлен",
        description: `Товар успешно обновлен.`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления товара",
        description: error.message || "Не удалось обновить товар.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      const productToRemove = products.find(p => p._id === id);
      setProducts(currentProducts => currentProducts.filter(product => product._id !== id));
      
      if (productToRemove) {
        toast({
          title: "Товар удален",
          description: `${productToRemove.name} удален из каталога.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка удаления товара",
        description: error.message || "Не удалось удалить товар.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product._id === id);
  };

  const searchProducts = (query: string) => {
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
      loadProducts,
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
