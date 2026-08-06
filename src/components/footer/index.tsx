import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Link do Google Mapas configurado exatamente para o seu endereço
  const googleMapsUrl = "https://google.com";

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800 text-zinc-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna 1: Sobre a Loja */}
        <div className="flex flex-col gap-2">
          <h2 className="text-zinc-100 font-bold text-lg tracking-wider">
            MULTI<span className="text-sky-400">MARCAS</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-sm">
            Encontre as melhores roupas de marcas exclusivas em todo o Brasil. Estilo, qualidade e o melhor preço em um só lugar.
          </p>
        </div>

        {/* Coluna 2: Links Rápidos (Minha Conta Removido) */}
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-100 font-semibold text-base">Navegação</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/sobre" className="hover:text-sky-400 transition-colors">Sobre Nós</Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Nosso Endereço (Atualizado com o Google Mapas) */}
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-100 font-semibold text-base">Nossa Loja</h3>
          <p className="text-sm">Venha nos visitar:</p>
          <a 
            href={googleMapsUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sky-400 font-medium hover:underline text-sm leading-relaxed"
          >
            Rua Armando Sebastião Bonomi, 31
          </a>
        </div>

      </div>

      {/* Faixa de Direitos Autorais */}
      <div className="w-full border-t border-zinc-900 py-4 bg-zinc-950 text-center text-xs">
        <p>&copy; {currentYear} Multimarcas - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
