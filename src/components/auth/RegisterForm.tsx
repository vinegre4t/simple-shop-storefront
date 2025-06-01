
import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useAuth, RegisterData } from "@/context/AuthContext";
import { useAjaxValidation } from "@/hooks/useAjaxValidation";

const registerSchema = z.object({
  username: z.string().min(2, "Имя пользователя должно содержать не менее 2 символов"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string().min(6, "Подтвердите пароль"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { validationState, isValidating, validateUsername, validatePassword, clearValidation } = useAjaxValidation();
  const [usernameCheckTimer, setUsernameCheckTimer] = useState<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedUsername = form.watch("username");
  const watchedPassword = form.watch("password");

  // AJAX валидация имени пользователя с debounce
  useEffect(() => {
    if (usernameCheckTimer) {
      clearTimeout(usernameCheckTimer);
    }

    if (watchedUsername && watchedUsername.length >= 2) {
      const timer = setTimeout(() => {
        validateUsername(watchedUsername);
      }, 500); // Задержка 500мс для избежания частых запросов
      
      setUsernameCheckTimer(timer);
    } else {
      clearValidation('username');
    }

    return () => {
      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
      }
    };
  }, [watchedUsername, validateUsername, clearValidation]);

  // AJAX валидация пароля
  useEffect(() => {
    if (watchedPassword && watchedPassword.length > 0) {
      validatePassword(watchedPassword);
    } else {
      clearValidation('password');
    }
  }, [watchedPassword, validatePassword, clearValidation]);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      // Проверяем результаты AJAX валидации перед отправкой
      if (validationState.username && !validationState.username.isValid) {
        return;
      }
      
      if (validationState.password && !validationState.password.isValid) {
        return;
      }

      const { confirmPassword, ...registerData } = data;
      await register(registerData as RegisterData);
      navigate("/");
    } catch (error) {
      // Ошибка уже обработана в AuthContext
    }
  };

  const isFormValid = () => {
    const usernameValid = validationState.username?.isValid !== false;
    const passwordValid = validationState.password?.isValid !== false;
    const notValidating = !isValidating.username && !isValidating.password;
    
    return usernameValid && passwordValid && notValidating;
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Создать аккаунт</h1>
        <p className="text-muted-foreground">
          Введите данные для регистрации
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
                  <div className="relative">
                    <Input placeholder="Введите имя пользователя" {...field} />
                    {isValidating.username && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {validationState.username && (
                  <p className={`text-xs ${validationState.username.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validationState.username.message}
                  </p>
                )}
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
                {validationState.password && (
                  <p className={`text-xs ${validationState.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validationState.password.message}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтверждение пароля</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? "Создание учетной записи..." : "Зарегистрироваться"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </div>

      <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
        <strong>Требования к паролю:</strong>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Минимум 6 символов</li>
          <li>Хотя бы одна заглавная буква</li>
          <li>Хотя бы одна строчная буква</li>
          <li>Хотя бы одна цифра</li>
        </ul>
      </div>
    </div>
  );
}
