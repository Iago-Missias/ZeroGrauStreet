import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom' // Adicionado useNavigate
import { supabase as db } from '../../services/supabaseConnection' 

interface ImagesRoupasProps {
  uid: string;
  name: string;
  url: string;
}

interface RoupaProps {
  id: string;
  name: string;
  modelo: string;
  price: string | number;
  marca: string;
  uid: string;
  whatsapp: string; 
  images: ImagesRoupasProps[];
  created?: string; 
}

export function RoupaDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Instanciando o navegador
  const [roupa, setRoupa] = useState<RoupaProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    async function loadRoupa() {
      if (!id) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const { data, error } = await db
          .from('roupas')
          .select('*')
          .eq('id', id)
          .single(); 

        // Se houver erro no banco ou o registro não existir (data nulo)
        if (error || !data) {
          console.error("Produto não encontrado ou erro:", error?.message);
          navigate('/', { replace: true }); // Redireciona para a Home
          return;
        }

        const roupaData = data as RoupaProps;
        setRoupa(roupaData);
        
        if (roupaData.images && roupaData.images.length > 0) {
          setActiveImage(roupaData.images[0].url);
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
        navigate('/', { replace: true }); // Redireciona em caso de falha crítica
      } finally {
        setLoading(false);
      }
    }

    loadRoupa();
  }, [id, navigate]); // Adicionado navigate nas dependências

  if (loading) {
    return (
      <Container>
        <h1 className="text-center font-medium my-4">Carregando detalhes...</h1>
      </Container>
    );
  }

  // Se chegou aqui e não tem roupa, redireciona por segurança
  if (!roupa) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <Container>
      {/* Área da Imagem Principal em Destaque */}
      {activeImage && (
        <div className="w-full max-w-3xl mx-auto my-4 bg-white rounded-lg p-2 shadow-sm">
          <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={activeImage} 
              alt={roupa.name}
              className="w-full h-full object-contain transition-all duration-300" 
            />
          </div>

          {/* Miniaturas abaixo da foto principal para clique */}
          {roupa.images && roupa.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
              {roupa.images.map((image, index) => (
                <button
                  key={`${image.uid}-${index}`}
                  onClick={() => setActiveImage(image.url)} 
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
                    activeImage === image.url ? 'border-blue-500 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt="Miniatura" 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <main className='w-full bg-white rounded-lg p-6 my-4 shadow-sm'>
        <div className='flex flex-col sm:flex-row mb-4 items-center justify-between gap-2'>
          <h1 className='font-bold text-3xl text-black'>{roupa.name}</h1>
          <h1 className='font-bold text-3xl text-black'>R$ {roupa.price}</h1>
        </div>
        
        <p className="text-gray-700 mb-4">{roupa.modelo}</p>
        
        <div className='flex w-full gap-6 my-4 text-black border-t border-b py-4 border-gray-100'>
          <div>
            <p className="text-gray-400 text-sm">Marca</p>
            <strong className="text-lg">{roupa.marca}</strong>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Modelo</p>
            <strong className="text-lg">{roupa.modelo}</strong>
          </div>
        </div>

        {/* Botão do WhatsApp */}
        {roupa.whatsapp && (
          <a
            href={`https://api.whatsapp.com/send?phone=${roupa?.whatsapp}&text=Olá vi esse ${roupa?.name} e fiquei interessado`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white flex items-center justify-center gap-2 p-3 rounded-lg font-bold hover:bg-green-600 transition-colors w-full text-center"
          >
            <FaWhatsapp size={20} />
            Falar com o vendedor
          </a>
        )}
      </main>
    </Container>
  )
}
