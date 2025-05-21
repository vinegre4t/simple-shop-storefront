
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
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
  user: AuthUser | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Проверяем сессию пользователя при загрузке
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      
      // Проверяем текущую сессию
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session) {
        setSession(data.session);
        const { user } = data.session;
        
        // Получаем данные профиля пользователя
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUser({
          id: user.id,
          email: user.email || '',
          name: profileData?.name || 'Пользователь',
          isAdmin: profileData?.is_admin || false,
        });
      }
      
      setIsLoading(false);
      
      // Слушаем изменения состояния аутентификации
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          
          if (currentSession && currentSession.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: profileData?.name || 'Пользователь',
              isAdmin: profileData?.is_admin || false,
            });
          } else {
            setUser(null);
          }
          
          setIsLoading(false);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    getSession();
  }, []);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    // Регистрируем пользователя
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    
    if (error) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (authData.user) {
      // Создаем профиль пользователя
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          is_admin: false,
        });
      
      if (profileError) {
        toast({
          title: "Ошибка создания профиля",
          description: profileError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Успешная регистрация",
          description: `Добро пожаловать, ${data.name}!`,
        });
      }
    }
    
    setIsLoading(false);
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль.",
        variant: "destructive",
      });
    } else if (authData.user) {
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему.",
      });
    }
    
    setIsLoading(false);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Ошибка выхода",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      setSession(null);
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы.",
      });
    }
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      isAdmin,
      session
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
