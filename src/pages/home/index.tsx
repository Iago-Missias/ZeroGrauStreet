import { useState, useEffect, useCallback } from 'react'
import { Container } from "../../components/container";
import { supabase } from '../../services/supabaseConnection'; 
import { Link } from 'react-router-dom'; 
import camisaImg from '../../assets/NK.jpg'; 
import { Carrossel } from '../../components/carrosel';
import { FiSearch, FiX } from 'react-icons/fi';

interface RoupaProps {
  id: string;
  name: string;
  model: string; 
  marca: string; 
  price: string | number; 
  images: RoupaImageProps[];
  uid: string;
  whatsapp: string;
  estilo: string;
  categoria: string;
}

interface RoupaImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [roupas, setRoupas] = useState<RoupaProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  
  const [busca, setBusca] = useState("");
  const [estilosSelecionados, setEstilosSelecionados] = useState<string[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  const estilosDisponiveis = ["Casual", "Esporte", "Esporte Fino"];
  const categoriasDisponiveis = ["Shorts", "Acessório", "Camisa", "Calça", "Cueca"];

  const fetchRoupas = useCallback(async (filtroNome: string, filtroEstilos: string[], filtroCategorias: string[]) => {
    let query = supabase
      .from('roupas')
      .select('*')
      .order('created_at', { ascending: false });

    if (filtroNome.trim() !== '') {
      query = query.ilike('name', `%${filtroNome}%`);
    }
    if (filtroEstilos.length > 0) {
      query = query.in('estilo', filtroEstilos);
    }
    if (filtroCategorias.length > 0) {
      query = query.in('categoria', filtroCategorias);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar roupas:", error.message);
      return;
    }

    if (data) {
      const listRoupas = data.map((item: any) => ({
        id: item.id,
        name: item.name || "Sem nome",
        price: item.price, 
        model: item.model || "Padrão", 
        marca: item.marca || "Multimarcas", 
        images: item.images || [], 
        uid: item.uid || "",
        whatsapp: item.whatsapp || "",
        estilo: item.estilo || "Não definido",
        categoria: item.categoria || "Não definida",
      }));

      setRoupas(listRoupas);

      listRoupas.forEach(item => {
        if (!item.images || item.images.length === 0) {
          handleImageLoad(item.id);
        }
      });
    }
  }, []);

  useEffect(() => {
    fetchRoupas(busca, estilosSelecionados, categoriasSelecionadas);
  }, [busca, estilosSelecionados, categoriasSelecionadas, fetchRoupas]);

  useEffect(() => {
    const channel = supabase
      .channel('roupas-alteracoes')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'roupas' }, 
        (payload: any) => {
          setRoupas((prevRoupas) => prevRoupas.filter(roupa => roupa.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleImageLoad(id: string){
    setLoadImages((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  function formatPrice(price: string | number) {
    if (price === undefined || price === null || price === '') return "0,00";
    if (typeof price === 'number') {
      return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    let cleanPrice = price.replace(/\s/g, '').replace(/[R\$]/g, '').trim();
    if (cleanPrice.includes('.') && cleanPrice.includes(',')) {
      cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.');
    } else {
      cleanPrice = cleanPrice.replace(',', '.');
    }
    const parsedPrice = Number(cleanPrice);
    if (isNaN(parsedPrice)) return String(price);
    return parsedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  function toggleEstilo(estilo: string) {
    setEstilosSelecionados((prev) =>
      prev.includes(estilo) ? prev.filter((e) => e !== estilo) : [...prev, estilo]
    );
  }

  function toggleCategoria(categoria: string) {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );
  }

  function limparFiltros() {
    setEstilosSelecionados([]);
    setCategoriasSelecionadas([]);
    setBusca("");
  }

  const totalFiltrosAtivos = estilosSelecionados.length + categoriasSelecionadas.length + (busca.trim() !== '' ? 1 : 0);

  return (
    <>
      <div className="w-full mb-6">
        <Carrossel />
      </div>

      <Container>
        <section className="bg-gradient-to-r from-sky-500 to-blue-600 p-5 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-inner">
            <FiSearch size={20} className="text-zinc-400" />
            <input 
              placeholder="Buscar pelo nome da roupa..."
              className="flex-1 h-10 bg-transparent outline-none text-black placeholder-zinc-400"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            {busca && (
              <button 
                onClick={() => setBusca("")} 
                className="text-zinc-400 hover:text-zinc-600"
              >
                <FiX size={18} />
              </button>
            )}
            <button 
              className="bg-black hover:bg-zinc-800 text-white font-medium px-6 py-1.5 rounded-full transition"
              onClick={() => fetchRoupas(busca, estilosSelecionados, categoriasSelecionadas)}
            >
              Buscar
            </button>
          </div>

          {/* FILTROS: ALTERADO PARA FICAR ESTILOS EM CIMA E CATEGORIAS EM BAIXO NO CELULAR */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 justify-center text-white">
            {/* Estilos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Estilo</span>
              {estilosDisponiveis.map((estilo) => (
                <label key={estilo} className="flex items-center gap-1.5 text-sm cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">
                  <input
                    type="checkbox"
                    checked={estilosSelecionados.includes(estilo)}
                    onChange={() => toggleEstilo(estilo)}
                    className="accent-black w-4 h-4"
                  />
                  {estilo}
                </label>
              ))}
            </div>

            {/* Separador - escondido no mobile */}
            <span className="hidden sm:block text-white/30">|</span>

            {/* Categorias */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Categoria</span>
              {categoriasDisponiveis.map((categoria) => (
                <label key={categoria} className="flex items-center gap-1.5 text-sm cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(categoria)}
                    onChange={() => toggleCategoria(categoria)}
                    className="accent-black w-4 h-4"
                  />
                  {categoria}
                </label>
              ))}
            </div>

            {/* Limpar filtros */}
            {totalFiltrosAtivos > 0 && (
              <button
                onClick={limparFiltros}
                className="flex items-center gap-1 text-sm bg-red-500/80 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition"
              >
                <FiX size={14} /> Limpar ({totalFiltrosAtivos})
              </button>
            )}
          </div>
        </section>

        <h1 className="font-bold text-center mt-8 text-2xl mb-4 text-white">
          Roupas de multimarcas em todo Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
          {roupas.map((roupa) => (
            <Link 
              to={`/roupa/${roupa.id}`} 
              key={roupa.id} 
              className="block h-full transition-transform duration-300 hover:scale-102"
            >
              <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 h-full select-none">
                <div 
                  className="w-full h-40 bg-zinc-900 rounded-lg animate-pulse"
                  style={{ display: loadImages.includes(roupa.id) ? "none" : "block" }}
                />
                <div 
                  className="bg-zinc-900 rounded-lg p-2 flex items-center justify-center overflow-hidden"
                  style={{ display: loadImages.includes(roupa.id) ? "flex" : "none" }}
                >
                  <img 
                    src={roupa.images && roupa.images.length > 0 ? roupa.images[0].url : camisaImg}
                    alt={roupa.name} 
                    className="w-40 h-40 object-contain mx-auto" 
                    onLoad={() => handleImageLoad(roupa.id)}
                    style={{ display: loadImages.includes(roupa.id) ? "block" : "none" }}
                  />
                </div>

                <div>
                  <p className="text-zinc-100 font-medium text-base">{roupa.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-zinc-400 text-sm">{roupa.model}</span>
                    <strong className="text-zinc-50 font-bold">
                      R$ {formatPrice(roupa.price)}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 border-t border-zinc-900 pt-2 mt-auto flex justify-between">
                  <span>{roupa.marca}</span>
                  <span className="text-zinc-400">Estilo: {roupa.estilo}</span>
                </div>
                <div className="text-xs text-zinc-600 border-t border-zinc-800 pt-1 flex justify-end">
                  <span className="bg-zinc-800 px-2 py-0.5 rounded-full">Categoria: {roupa.categoria}</span>
                </div>
              </section>
            </Link>
          ))}
        </main>

        {roupas.length === 0 && (
          <div className="text-center py-10 text-zinc-400">
            <p>Nenhuma roupa encontrada para os filtros selecionados.</p>
          </div>
        )}
      </Container>
    </>
  ); 
}
