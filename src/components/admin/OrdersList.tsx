
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus, useOrders } from "@/context/OrderContext";

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

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered": return "bg-green-100 text-green-800 border-green-200";
    case "cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function OrdersList() {
  const { orders, updateOrderStatus } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID заказа</TableHead>
            <TableHead>Покупатель</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                Нет заказов для отображения
              </TableCell>
            </TableRow>
          ) : (
            sortedOrders.map((order) => (
              <>
                <TableRow 
                  key={order._id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.total} ₽</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge className={`${getStatusColor(order.status)} font-normal`}>
                            {order.status === "pending" ? "В ожидании" : 
                             order.status === "processing" ? "В обработке" : 
                             order.status === "shipped" ? "Отправлен" : 
                             order.status === "delivered" ? "Доставлен" : 
                             "Отменен"}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">В ожидании</SelectItem>
                        <SelectItem value="processing">В обработке</SelectItem>
                        <SelectItem value="shipped">Отправлен</SelectItem>
                        <SelectItem value="delivered">Доставлен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
                {expandedOrder === order._id && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={5} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Информация о заказе</h4>
                          <div className="text-sm text-muted-foreground mt-1 grid grid-cols-2 gap-2">
                            <div>Пользователь: {order.user}</div>
                            <div>Адрес: {order.shippingAddress}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Товары</h4>
                          <ul className="mt-1 space-y-2">
                            {order.items.map((item, index) => (
                              <li key={`${item.product}-${index}`} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span className="font-medium">{item.price * item.quantity} ₽</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
