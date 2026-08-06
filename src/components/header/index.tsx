import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import logoImg from '../../assets/logo.png'
import { Link } from 'react-router-dom' 
import { FiUser, FiLogIn, FiInstagram } from 'react-icons/fi'

export function Header() {
  const { signed, loading } = useContext(AuthContext);

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex items-center justify-center h-16 bg-black drop-shadow">
        <header className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
            
            {/* CORRIGIDO: Altura reduzida para h-12 para se ajustar perfeitamente aos 64px da barra */}
            <Link to="/">
                <img src={logoImg} alt="Logo do site" className="h-12 w-auto object-contain" />
            </Link>

            <div className="flex items-center gap-8">
                
                <nav className="flex items-center gap-6 text-white font-medium">
                    <Link to="/sobre" className="hover:text-zinc-400 transition-colors">
                        <span>Sobre</span>
                    </Link>

                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">
                        <FiInstagram size={20} title="Instagram" />
                    </a>
                </nav>

                <div className="h-6 w-[1px] bg-zinc-700"></div>

                <div className="flex items-center">
                    {/* Exibe o ícone de usuário se estiver logado */}
                    {!loading && signed && (
                      <Link to="/dashboard">
                          <div className='border-2 rounded-full p-1 border-white hover:bg-zinc-800 transition-colors'>
                              <FiUser size={26} color="white"/>
                          </div>
                      </Link>
                    )}

                    {/* CORRIGIDO: Removido o 'isAdmin' para permitir que usuários deslogados vejam o botão de login */}
                    {!loading && !signed && (
                      <Link to="/login">
                          <div className="border-2 rounded-full p-1 border-white hover:bg-zinc-800 transition-colors">
                              <FiLogIn size={26} color="white"/>
                          </div>
                      </Link>
                    )}
                </div>

            </div>
        </header>
    </div>
  );
}
