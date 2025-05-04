
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/context/ProductContext";

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 order-2 lg:order-1">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Минималистичный дизайн для повседневной жизни
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Откройте для себя нашу коллекцию минималистичных и качественных товаров,
                которые сделают вашу жизнь проще и стильнее.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link to="/products">Смотреть каталог</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">О нас</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-xl overflow-hidden">
              <img
                alt="Hero image"
                src="/placeholder.svg"
                className="aspect-[4/3] object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Популярные товары</h2>
              <p className="text-muted-foreground md:text-xl">
                Взгляните на наши самые популярные товары
              </p>
            </div>
            <div className="w-full pt-8">
              <ProductGrid products={featuredProducts} />
            </div>
            <Button asChild className="mt-8">
              <Link to="/products">Смотреть все товары</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Минималистичный дизайн</h3>
              <p className="text-sm text-muted-foreground">
                Наши товары отличаются простотой и элегантностью, что делает их идеальными для любого интерьера.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Качественные материалы</h3>
              <p className="text-sm text-muted-foreground">
                Мы используем только лучшие материалы для наших товаров, обеспечивая их долговечность.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Быстрая доставка</h3>
              <p className="text-sm text-muted-foreground">
                Мы гарантируем быструю и безопасную доставку ваших заказов в любую точку страны.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
