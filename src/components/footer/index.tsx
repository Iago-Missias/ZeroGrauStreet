import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const googleMapsUrl = "https://google.com";

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800 text-zinc-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Coluna 1: Sobre */}
        <div className="flex flex-col gap-2">
          <h2 className="text-zinc-100 font-bold text-lg tracking-wider">
            Zero<span className="text-sky-400">Grau</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-sm">
            Encontre as melhores roupas de marcas exclusivas em todo o Brasil. Estilo, qualidade e o melhor preço em um só lugar.
          </p>
        </div>

        {/* Coluna 2: Formas de Pagamento */}
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-100 font-semibold text-base">Formas de Pagamento</h3>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-sky-400">●</span>
              <span>PIX </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400">●</span>
              <span>Cartão de Crédito </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400">●</span>
              <span>Cartão de Débito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400">●</span>
              <span>Dinheiro</span>
            </div>
           
          </div>
        </div>

        {/* Coluna 3: Parcelamento */}
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-100 font-semibold text-base">Parcelamento</h3>
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-zinc-300">Cartão de Crédito:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-0.5 ml-2">
              <li>Até  <strong className="text-white">4x sem Juros</strong></li>
              <li>Parcelas a partir de <strong className="text-white">R$ 50,00</strong></li>
            </ul>
            
            <div className="mt-3 pt-2 border-t border-zinc-800">
              <p className="text-emerald-400 text-xs">✦ PIX </p>
              <p className="text-emerald-400 text-xs">✦ Dinheiro</p>
            </div>
          </div>
        </div>

        {/* Coluna 4: Localização */}
        <div className="flex flex-col gap-2">
          <h3 className="text-zinc-100 font-semibold text-base">Nossa Loja</h3>
          <a 
            href={googleMapsUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sky-400 font-medium hover:underline text-sm leading-relaxed"
          >
            Rua Armando Sebastião Bonomi, 31
          </a>
          
          {/* Bandeiras */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">Visa</span>
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">Master</span>
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">Elo</span>
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">Hiper</span>
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">Amex</span>
            <span className="bg-zinc-900 px-2 py-0.5 rounded text-xs text-zinc-300">PIX</span>
          </div>
        </div>

      </div>

      {/* Rodapé */}
      <div className="w-full border-t border-zinc-900 py-4 bg-zinc-950 text-center text-xs">
        <p>&copy; {currentYear} ZeroGrauStreet - Todos os direitos reservados.</p>
        <p className="text-zinc-600 text-[10px] mt-1">
          * Consulte condições de parcelamento e descontos
        </p>
      </div>
    </footer>
  );
}