
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { authAPI } from '@/lib/api';

export type User = {
  username: string;
  role: 'admin' | 'user';
};

export type RegisterData = {
  username: string;
  password: string;
};

export type LoginData = {
  username: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('Restored user from localStorage:', JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    console.log('Attempting login for user:', data.username);
    
    try {
      const response = await authAPI.login(data);
      console.log('Login response:', response);
      
      // Бэкенд возвращает { token, user: { username, role } }
      const userData = {
        username: response.user.username,
        role: response.user.role
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', response.token);
      
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${userData.username}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверные учетные данные.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    console.log('Attempting registration for user:', data.username);
    
    try {
      const response = await authAPI.register(data);
      console.log('Registration response:', response);
      
      // Автоматически входим после регистрации
      if (response.token) {
        const userData = {
          username: response.user.username,
          role: response.user.role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', response.token);
      }
      
      toast({
        title: "Успешная регистрация",
        description: `Добро пожаловать, ${data.username}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
