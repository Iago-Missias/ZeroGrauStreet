import { ReactNode, createContext, useState, useEffect } from 'react';
// CORREÇÃO 1: Importar o cliente 'supabase' correto e remover o 'onAuthStateChanged' do Firebase
import { supabase } from '../services/supabaseConnection';

type AuthContextData = {
  signed: boolean;
  loading: boolean;     
  loadingAuth: boolean; 
  handleInfoUser: ({ name, email, uid }: UserProps) => void; 
  user: UserProps | null;
  logout: () => Promise<void>; // Adicionado caso precise deslogar nas outras telas
};

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true); 

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      uid,
      name,
      email
    });
  }

  // Função para deslogar do sistema usando o Supabase
  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  useEffect(() => {
    // CORREÇÃO 2: Substituído o observador do Firebase pelo gerenciamento de sessão do Supabase
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          uid: session.user.id,
          name: session.user.user_metadata?.display_name || '',
          email: session.user.email || ''
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    checkSession();

    // Escuta mudanças de estado (login/logout) em tempo real no Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          name: session.user.user_metadata?.display_name || '',
          email: session.user.email || ''
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
        signed: !!user,
        loading,
        loadingAuth: loading, 
        handleInfoUser,
        user,
        logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
