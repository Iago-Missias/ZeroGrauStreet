import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import logoImg from '../../assets/logo.png'
import { Link, useLocation } from 'react-router-dom' // Importe useLocation
import { FiUser, FiInstagram } from 'react-icons/fi'

export function Header() {
  const { signed, loading } = useContext(AuthContext);
  const location = useLocation(); // Pega a rota atual
  const isHomePage = location.pathname === '/'; // Verifica se é a home

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex items-center justify-center h-16 bg-black drop-shadow">
        <header className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
            
            <Link to="/">
                <img src={logoImg} alt="Logo do site" className="h-20 w-auto object-contain" />
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

                {/* Só mostra o ícone do painel se NÃO estiver na home E o usuário estiver logado */}
                {!loading && signed && !isHomePage && (
                  <>
                    <div className="h-6 w-[1px] bg-zinc-700"></div>
                    
                    <div className="flex items-center">
                      <Link to="/dashboard">
                          <div className='border-2 rounded-full p-1 border-white hover:bg-zinc-800 transition-colors'>
                              <FiUser size={26} color="white"/>
                          </div>
                      </Link>
                    </div>
                  </>
                )}

            </div>
        </header>
    </div>
  );
}