import { createHashRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { RoupaDetail } from './pages/roupa';
import { Layout } from './components/layout';
import { Dashboard } from './pages/dashboard';
import { New } from './pages/dashboard/new';
import { Sobre } from './pages/sobre';
import Private from './routes/Private';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/roupa/:id", element: <RoupaDetail /> },
      {
        path: "/dashboard",
        element: <Private> <Dashboard /> </Private>
      },
      {
        path: "/dashboard/new",
        element: <Private> <New /> </Private>
      },
      // 🔥 ROTA DE EDIÇÃO (USA O MESMO New)
      {
        path: "/dashboard/edit/:id",
        element: <Private> <New /> </Private>
      }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }
]);

export { router };