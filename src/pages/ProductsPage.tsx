
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchForm from "@/components/products/SearchForm";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/context/ProductContext";
import { ProductType } from "@/lib/supabase";

export default function ProductsPage() {
  const { products, searchProducts } = useProducts();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(searchProducts(searchQuery));
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products, searchProducts]);

  const handleSearch = (query: string) => {
    setFilteredProducts(query ? searchProducts(query) : products);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold">Каталог товаров</h1>
          <SearchForm defaultValue={searchQuery} onSearch={handleSearch} />
        </div>

        <div className="mt-8">
          <ProductGrid 
            products={filteredProducts} 
            emptyMessage={searchQuery ? "Товары не найдены по вашему запросу" : "Товары не найдены"} 
          />
        </div>
      </div>
    </Layout>
  );
}
