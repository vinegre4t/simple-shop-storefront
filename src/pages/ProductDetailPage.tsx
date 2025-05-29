
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  
  const product = getProductById(productId!);

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться в каталог
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 rounded-lg overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад в каталог
          </Button>
          
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-semibold">{product.price} ₽</span>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          <Button
            size="lg"
            className="mt-8"
            onClick={() => addToCart(product._id)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Добавить в корзину
          </Button>
        </div>
      </div>
    </Layout>
  );
}
