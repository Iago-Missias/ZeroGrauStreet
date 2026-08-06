import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register'; 
import { RoupaDetail } from './pages/roupa';
import { Layout } from './components/layout';
import { Dashboard } from './pages/dashboard';
import { New } from './pages/dashboard/new';
import { Sobre } from './pages/sobre'; // 1. ADICIONE ESTA IMPORTAÇÃO

import Private from './routes/Private';

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/sobre", // 2. ADICIONE ESTA NOVA ROTA AQUI
        element: <Sobre/>
      },
      {
        path: "/roupa/:id",
        element: <RoupaDetail/>
      },
      {
        path: "/dashboard",
        element: <Private> <Dashboard/> </Private> 
      },
      {
        path: "/dashboard/new",
        element: <Private> <New/> </Private> 
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register", 
    element: <Register/>
  }
]);

export { router };
