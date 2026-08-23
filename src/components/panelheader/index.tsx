import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

export function DashboardHeader(){
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return( 
        <div className="w-full items-center flex bg-gradient-to-r from-sky-500 to-blue-600 font-medium gap-4 px-4 py-3 mb-4 rounded-lg text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.6)] mt-10">
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