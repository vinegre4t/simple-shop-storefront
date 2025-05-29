
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProducts, Product, NewProduct } from "@/context/ProductContext";

const productSchema = z.object({
  name: z.string().min(2, "Название должно содержать не менее 2 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов"),
  price: z.coerce.number().min(1, "Цена должна быть больше 0"),
  imageUrl: z.string().default("https://example.com/placeholder.jpg"),
  category: z.string().min(2, "Категория должна содержать не менее 2 символов"),
  stock: z.coerce.number().min(0, "Количество должно быть больше или равно 0"),
});

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const isEditing = !!product;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      imageUrl: product?.imageUrl || "https://example.com/placeholder.jpg",
      category: product?.category || "",
      stock: product?.stock || 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      if (isEditing && product) {
        await updateProduct(product._id, data);
      } else {
        await addProduct(data as NewProduct);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (!isEditing) {
        form.reset({
          name: "",
          description: "",
          price: 0,
          imageUrl: "https://example.com/placeholder.jpg",
          category: "",
          stock: 0,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название товара</FormLabel>
              <FormControl>
                <Input placeholder="Название товара" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Подробное описание товара" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена (₽)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <FormControl>
                <Input placeholder="Категория товара" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="URL изображения" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isEditing ? "Обновить товар" : "Добавить товар"}
        </Button>
      </form>
    </Form>
  );
}
