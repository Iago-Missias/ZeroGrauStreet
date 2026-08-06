import { useState, useEffect } from 'react'
import { Container } from "../../components/container";
import { supabase } from '../../services/supabaseConnection'; 
import { Link } from 'react-router-dom'; 
import camisaImg from '../../assets/NK.jpg'; 
import { Carrossel } from '../../components/carrosel'; // 1. IMPORTAÇÃO DO SEU CARROSSEL (Ajuste a pasta se necessário)

interface RoupaProps {
  id: string;
  name: string;
  model: string; 
  marca: string; 
  price: string | number; 
  images: RoupaImageProps[];
  uid: string;
  whatsapp: string; 
}

interface RoupaImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [roupas, setRoupas] = useState<RoupaProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("")

  async function loadRoupas() {
    const { data, error } = await supabase
      .from('roupas')
      .select('*')
      .order('created_at', { ascending: false });

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
        whatsapp: item.whatsapp || ""
      }));

      setRoupas(listRoupas);

      // CORREÇÃO DE BUG: Ativa o carregamento automático para produtos sem imagem em anexo
      listRoupas.forEach(item => {
        if (!item.images || item.images.length === 0) {
          handleImageLoad(item.id);
        }
      });
    }
  }

  useEffect(() => {
    loadRoupas();

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
    setLoadImages((prevImageLoaded) => {
      if (prevImageLoaded.includes(id)) return prevImageLoaded;
      return [...prevImageLoaded, id];
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

  async function handleSearchRoupa(){
    if(input === ''){
      loadRoupas();
      return;
    }

    setRoupas([]);
    setLoadImages([]);

    const { data, error } = await supabase
      .from('roupas')
      .select('*')
      .ilike('name', `%${input}%`) 
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar termo:", error.message);
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
        whatsapp: item.whatsapp || ""
      }));

      setRoupas(listRoupas);

      listRoupas.forEach(item => {
        if (!item.images || item.images.length === 0) {
          handleImageLoad(item.id);
        }
      });
    }
  }

  return (
    <>
      {/* 2. O CARROSSEL ADICIONADO AQUI (Fora do Container para ocupar toda a largura da tela) */}
      <div className="w-full mb-6">
        <Carrossel />
      </div>

      <Container>
        <section className="bg-sky-400 p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
          <input 
            placeholder="Digite o nome da roupa.."
            className="w-full border-2 rounded-lg h-9 px-3 text-black"
            value={input}
            onChange={ (e) => setInput(e.target.value)}
          />
          <button 
            className="bg-black h-9 px-8 rounded-lg text-white font-medium text-lg"
            onClick={handleSearchRoupa}
          >
            Buscar
          </button> 
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4 text-white">
          Roupas de multimarcas em todo Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
          {roupas.map((roupa) => (
            <Link 
              to={`/roupa/${roupa.id}`} 
              key={roupa.id} 
              className="block h-full transition-transform duration-300 hover:scale-102"
            >
              <section 
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 h-full select-none"
              >
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
                    onLoad={ () => handleImageLoad(roupa.id) }
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

                <div className="text-xs text-zinc-500 border-t border-zinc-900 pt-2 mt-auto">
                  <span>{roupa.marca}</span>
                </div>
              </section>
            </Link>
          ))}
        </main>
      </Container>
    </>
  ); 
}
