
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { useAuth, LoginData } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Введите имя пользователя"),
  password: z.string().min(1, "Введите пароль"),
});

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data as LoginData);
      navigate("/");
    } catch (error) {
      // Ошибка уже обработана в AuthContext
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      form.setValue('username', 'admin');
      form.setValue('password', 'admin123');
    } else {
      form.setValue('username', 'user');
      form.setValue('password', 'user123');
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Вход в аккаунт</h1>
        <p className="text-muted-foreground">
          Введите свои данные для входа
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input placeholder="Введите имя пользователя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Еще нет аккаунта?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>

      <div className="border-t pt-4 text-center text-sm">
        <p className="text-muted-foreground mb-2">Демо аккаунты для тестирования:</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('user')}>
            Пользователь
          </Button>
          <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('admin')}>
            Администратор
          </Button>
        </div>
      </div>
    </div>
  );
}
