
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import OrdersList from "@/components/admin/OrdersList";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <p>Загрузка...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <p>У вас нет доступа к этой странице</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Управление товарами</h2>
              <Button onClick={() => setIsAddProductOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Добавить товар
              </Button>
            </div>
            
            <ProductGrid products={products} />
            
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Добавить новый товар</DialogTitle>
                </DialogHeader>
                <ProductForm onSuccess={() => setIsAddProductOpen(false)} />
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Управление заказами</h2>
            </div>
            
            <OrdersList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
