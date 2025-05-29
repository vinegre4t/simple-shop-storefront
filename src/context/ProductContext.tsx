
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type NewProduct = Omit<Product, "id">;

interface ProductContextType {
  products: Product[];
  addProduct: (product: NewProduct) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  searchProducts: (query: string) => Product[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock product data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Минималистичная футболка",
    description: "Классическая футболка из 100% органического хлопка. Минималистичный дизайн для повседневной носки.",
    price: 1200,
    image: "/placeholder.svg",
    category: "Одежда"
  },
  {
    id: 2,
    name: "Керамическая чашка",
    description: "Стильная керамическая чашка ручной работы. Идеально подходит для вашего утреннего кофе или чая.",
    price: 950,
    image: "/placeholder.svg",
    category: "Дом"
  },
  {
    id: 3,
    name: "Кожаный кошелек",
    description: "Прочный кошелек из натуральной кожи с множеством отделений для карт и купюр.",
    price: 2500,
    image: "/placeholder.svg",
    category: "Аксессуары"
  },
  {
    id: 4,
    name: "Настольная лампа",
    description: "Современная настольная лампа с регулируемой яркостью. Идеальное дополнение к вашему рабочему пространству.",
    price: 3200,
    image: "/placeholder.svg",
    category: "Дом"
  },
  {
    id: 5,
    name: "Ноутбук-органайзер",
    description: "Стильный органайзер для заметок и планирования с минималистичным дизайном.",
    price: 850,
    image: "/placeholder.svg",
    category: "Канцтовары"
  },
  {
    id: 6,
    name: "Беспроводные наушники",
    description: "Высококачественные беспроводные наушники с шумоподавлением и длительным сроком службы батареи.",
    price: 8500,
    image: "/placeholder.svg",
    category: "Электроника"
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addProduct = (product: NewProduct) => {
    const newProduct = {
      ...product,
      id: Date.now()
    };
    
    setProducts([...products, newProduct]);
    toast({
      title: "Товар добавлен",
      description: `${product.name} успешно добавлен.`,
    });
  };

  const updateProduct = (id: number, updatedFields: Partial<Product>) => {
    setProducts(currentProducts => 
      currentProducts.map(product => 
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
    
    toast({
      title: "Товар обновлен",
      description: `Товар успешно обновлен.`,
    });
  };

  const deleteProduct = (id: number) => {
    setProducts(currentProducts => {
      const productToRemove = currentProducts.find(p => p.id === id);
      if (productToRemove) {
        toast({
          title: "Товар удален",
          description: `${productToRemove.name} удален из каталога.`,
        });
      }
      return currentProducts.filter(product => product.id !== id);
    });
  };

  const getProductById = (id: number) => {
    return products.find(product => product.id === id);
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
