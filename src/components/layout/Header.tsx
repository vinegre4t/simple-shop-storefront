
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">МиниМаркет</span>
          </Link>
          
          <nav className="hidden gap-6 md:flex">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Главная
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Каталог
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                Админ
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {searchOpen ? (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Искать..."
                className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Выйти
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Войти</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
