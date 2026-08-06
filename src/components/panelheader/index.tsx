import { Link } from 'react-router-dom'
import { useContext } from 'react' // CORREÇÃO 1: Adicionado o hook useContext do React
import { AuthContext } from '../../contexts/AuthContext' // CORREÇÃO 2: Importado o contexto global

export function DashboardHeader(){
    // CORREÇÃO 3: Puxa a função de logout do Supabase já configurada no contexto
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        // CORREÇÃO 4: Executa o logout limpo e sem dependências do Firebase
        await logout();
    }

    return( 
        <div className="w-full items-center flex h-10 bg-cyan-500 font-medium gap-4 px-4 mb-4 rounded-lg text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Link to="/dashboard">
                Dashboard
            </Link>

            <Link to="/dashboard/new">
                Cadastrar Roupa
            </Link>

            <button className="ml-auto" onClick={handleLogout}>
                Sair da conta
            </button>
        </div>
    )
}
