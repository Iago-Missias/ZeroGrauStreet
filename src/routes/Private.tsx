import { ReactNode, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; 
import { Navigate } from 'react-router-dom';

interface PrivateProps {
  children: ReactNode;
}

const ADMIN_EMAIL = "zero.grau20260208@gmail.com";

function Private({ children }: PrivateProps) {
  const { signed, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-zinc-950 text-white">
        <p className="font-medium text-lg animate-pulse">Verificando credenciais...</p>
      </div>
    );
  }

  if (!signed || user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default Private;
