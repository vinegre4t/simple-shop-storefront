
import Layout from "@/components/layout/Layout";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, clearCart } = useCart();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Корзина</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCart}>
              Очистить корзину
            </Button>
          )}
        </div>

        <Separator />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Ваша корзина пуста</h2>
            <p className="text-muted-foreground mb-8">Похоже, вы еще не добавили товары в корзину</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Перейти к покупкам
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item, index) => (
                <CartItem key={`${item.product}-${index}`} item={item} />
              ))}
              <Separator />
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
