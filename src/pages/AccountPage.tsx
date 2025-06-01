
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">В ожидании</Badge>;
    case "processing":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">В обработке</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Отправлен</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Доставлен</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Отменен</Badge>;
    default:
      return <Badge variant="outline">Неизвестно</Badge>;
  }
};

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState([]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    
    if (user) {
      const orders = getUserOrders(user.id);
      setUserOrders(orders);
    }
  }, [user, isLoading, navigate, getUserOrders]);

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <p>Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Личный кабинет</CardTitle>
            <CardDescription>Управляйте своей учетной записью и просматривайте заказы</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Профиль</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Имя</h3>
                      <p className="mt-1">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="mt-1">{user.email}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="orders">
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">У вас пока нет заказов</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">№ заказа</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Сумма</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Товары</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>{order.total} ₽</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{order.items.length} товаров</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
