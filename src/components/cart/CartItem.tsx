
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="h-16 w-16 bg-muted rounded overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">{item.price} ₽ / шт.</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.product, parseInt(e.target.value) || 1)}
            className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={() => updateQuantity(item.product, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <div className="w-20 text-right font-medium">
          {item.price * item.quantity} ₽
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeFromCart(item.product)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
