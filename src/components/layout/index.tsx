import { Header } from "../header";
import { Footer } from "../footer"; // Importa o rodapé criado
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    // min-h-screen + flex-col garantem o rodapé fixo embaixo se a página tiver pouco conteúdo
    <div className="flex flex-col min-h-screen bg-zinc-900">
      
      {/* Menu preto fixo no topo */}
      <Header />
      
      {/* pt-16 libera o espaço do menu fixo e flex-grow empurra o rodapé para o fim da tela */}
      <main className="pt-16 flex-grow">
        {/* Conteúdo dinâmico das suas páginas (Home, Roupa, Dashboard) */}
        <Outlet />
      </main>

      {/* Rodapé adicionado no final da estrutura */}
      <Footer />
      
    </div>
  );
}
