
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";

export default function CartSummary() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login?redirect=cart");
      return;
    }

    setIsProcessing(true);
    
    try {
      if (items.length > 0) {
        await createOrder({
          shippingAddress: "Адрес будет указан при оформлении"
        });
        
        await clearCart();
        navigate("/account");
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold">Сводка заказа</h3>
      <Separator className="my-4" />
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Товары ({items.length})</span>
          <span>{cartTotal} ₽</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Доставка</span>
          <span>Бесплатно</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-semibold">
        <span>Итого</span>
        <span>{cartTotal} ₽</span>
      </div>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? "Обработка..." : "Оформить заказ"}
      </Button>
      <Button
        variant="ghost"
        className="mt-2 w-full"
        onClick={() => navigate("/products")}
      >
        Продолжить покупки
      </Button>
    </div>
  );
}
