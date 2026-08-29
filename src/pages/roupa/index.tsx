import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase as db } from '../../services/supabaseConnection'
import { Helmet } from 'react-helmet-async'

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
  instagram?: string;
  images: ImagesRoupasProps[];
  created?: string; 
}

export function RoupaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roupa, setRoupa] = useState<RoupaProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  // Função para abrir o WhatsApp com a mensagem
  const handleWhatsAppClick = () => {
    if (!roupa) return;
    
    // Pega a URL atual
    const currentUrl = window.location.href;
    
    // Formata o número (remove espaços, parênteses, etc.)
    let phoneNumber = roupa.whatsapp.replace(/\D/g, ''); // Remove tudo que não é número
    
    // Remove o 55 se já tiver
    if (phoneNumber.startsWith('55')) {
      phoneNumber = phoneNumber.substring(2);
    }
    
    // Mensagem completa
    const message = `Olá, vi esse ${roupa.name} e fiquei interessado!
    
📌 Link do produto: ${currentUrl}

💰 Preço: R$ ${roupa.price}
👕 Modelo: ${roupa.modelo}
🏷️ Marca: ${roupa.marca}
🆔 Código: ${roupa.id}`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Cria o link do WhatsApp
    const whatsappLink = `https://api.whatsapp.com/send?phone=55${phoneNumber}&text=${encodedMessage}`;
    
    // Abre em nova aba
    window.open(whatsappLink, '_blank');
  };

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

        if (error || !data) {
          console.error("Produto não encontrado ou erro:", error?.message);
          navigate('/', { replace: true });
          return;
        }

        const roupaData = data as RoupaProps;
        setRoupa(roupaData);
        
        if (roupaData.images && roupaData.images.length > 0) {
          setActiveImage(roupaData.images[0].url);
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadRoupa();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container>
        <h1 className="text-center font-medium my-4">Carregando detalhes...</h1>
      </Container>
    );
  }

  if (!roupa) {
    navigate('/', { replace: true });
    return null;
  }

  const ogImage = roupa.images && roupa.images.length > 0 
    ? roupa.images[0].url 
    : 'https://seusite.com/imagem-padrao.jpg';

  return (
    <>
      <Helmet>
        <title>{roupa.name} - {roupa.marca}</title>
        <meta property="og:title" content={`${roupa.name} - ${roupa.marca}`} />
        <meta property="og:description" content={`${roupa.modelo} - R$ ${roupa.price} - Marca: ${roupa.marca}`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Sua Loja" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${roupa.name} - ${roupa.marca}`} />
        <meta name="twitter:description" content={`${roupa.modelo} - R$ ${roupa.price}`} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Container>
        {activeImage && (
          <div className="w-full max-w-3xl mx-auto my-4 bg-white rounded-lg p-2 shadow-sm">
            <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={activeImage} 
                alt={roupa.name}
                className="w-full h-full object-contain transition-all duration-300" 
              />
            </div>

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

          <div className="flex flex-col gap-3">
            {/* Botão do WhatsApp CORRIGIDO */}
            {roupa.whatsapp && (
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 text-white flex items-center justify-center gap-2 p-3 rounded-lg font-bold hover:bg-green-600 transition-colors w-full text-center"
              >
                <FaWhatsapp size={20} />
                Falar com o vendedor
              </button>
            )}

            {/* Botão do Instagram */}
            {roupa.instagram && (
              <a
                href={roupa.instagram.startsWith('http') ? roupa.instagram : `https://instagram.com/${roupa.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center gap-2 p-3 rounded-lg font-bold hover:opacity-90 transition-opacity w-full text-center"
              >
                <FaInstagram size={20} />
                Ver no Instagram
              </a>
            )}
          </div>
        </main>
      </Container>
    </>
  )
}