
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  { id: 1, name: "Admin", email: "admin@example.com", isAdmin: true },
  { id: 2, name: "User", email: "user@example.com" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (data: LoginData) => {
    setIsLoading(true);
    // Mock login - in a real app this would be an API call
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.email === data.email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${foundUser.name}!`,
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный email или пароль.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const register = (data: RegisterData) => {
    setIsLoading(true);
    // Mock registration - in a real app this would be an API call
    setTimeout(() => {
      const exists = mockUsers.some(u => u.email === data.email);
      
      if (exists) {
        toast({
          title: "Ошибка регистрации",
          description: "Пользователь с таким email уже существует.",
          variant: "destructive",
        });
      } else {
        const newUser: User = {
          id: mockUsers.length + 1,
          name: data.name,
          email: data.email,
        };
        
        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast({
          title: "Успешная регистрация",
          description: `Добро пожаловать, ${data.name}!`,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
    });
  };

  const isAdmin = user?.isAdmin || false;

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
