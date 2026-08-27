import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from "../../components/container";
import { DashboardHeader } from '../../components/panelheader';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../services/supabaseConnection';
import { AuthContext } from '../../contexts/AuthContext';

interface RoupaProps {
  id: string | number;
  name: string;
  model: string;
  marca: string;
  price: string | number;
  images: ImageRoupaProps[];
  uid: string;
  estilo: string;
}

interface ImageRoupaProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [roupas, setRoupas] = useState<RoupaProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  async function loadRoupas() {
    if (!user?.uid) return;
    const { data, error } = await supabase
      .from('roupas')
      .select('*')
      .eq('uid', user.uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar roupas:", error.message);
      return;
    }
    if (data) setRoupas(data as RoupaProps[]);
  }

  // 🔥 Recarrega SEMPRE que a URL mudar (location inteiro)
  useEffect(() => {
    loadRoupas();
  }, [user, location]); // <-- location inteiro

  async function handleDeleteRoupa(roupa: RoupaProps) {
    const confirmou = window.confirm(`Deseja mesmo deletar "${roupa.name}"?`);
    if (!confirmou) return;

    try {
      if (roupa.images && roupa.images.length > 0) {
        const imagensParaDeletar = roupa.images.map(img => img.name);
        await supabase.storage.from('ZeroGrau').remove(imagensParaDeletar);
      }

      const { error } = await supabase
        .from('roupas')
        .delete()
        .eq('id', roupa.id);

      if (error) {
        alert(`O banco recusou a deleção: ${error.message}`);
        return;
      }

      setRoupas(prev => prev.filter(item => item.id !== roupa.id));
      alert("Produto deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      alert("Erro interno no código ao tentar deletar.");
    }
  }

  function handleEditRoupa(id: string | number) {
    navigate(`/dashboard/edit/${id}`);
  }

  function formatPrice(price: string | number) {
    if (!price) return "0,00";
    if (typeof price === 'number') return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    let cleanPrice = price.replace(/\s/g, '').replace(/[R\$]/g, '').trim();
    cleanPrice = cleanPrice.includes('.') && cleanPrice.includes(',') 
      ? cleanPrice.replace(/\./g, '').replace(',', '.') 
      : cleanPrice.replace(',', '.');

    const parsedPrice = Number(cleanPrice);
    return isNaN(parsedPrice) ? String(price) : parsedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  return (
    <Container>
      <DashboardHeader/>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {roupas.map((roupa) => (
          <section key={roupa.id} className="w-full bg-white rounded-lg relative pb-4 shadow-sm border border-zinc-100 flex flex-col justify-between">
            <div>
              <button
                onClick={() => handleEditRoupa(roupa.id)}
                className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center top-2 right-12 shadow-md hover:bg-zinc-50 transition-colors z-20 cursor-pointer"
                type="button"
              >
                <FiEdit2 size={20} color="#3B82F6" />
              </button>
              <button
                onClick={() => handleDeleteRoupa(roupa)}
                className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center top-2 right-2 shadow-md hover:bg-zinc-50 transition-colors z-20 cursor-pointer"
                type="button"
              >
                <FiTrash2 size={20} color="#EF4444" />
              </button>
              
              <div className="bg-zinc-900 rounded-t-lg p-2 h-48 flex items-center justify-center overflow-hidden">
                <img 
                  src={roupa.images && roupa.images.length > 0 ? roupa.images[0].url : '/caminho-padrao.jpg'} 
                  alt={roupa.name} 
                  className="w-40 h-40 object-contain mx-auto transition-transform duration-300 hover:scale-105" 
                />
              </div>

              <p className="font-bold mt-3 px-3 text-zinc-900 text-lg uppercase line-clamp-1">{roupa.name}</p>
              
              <div className="flex flex-col px-3 mt-1">
                <span className="text-zinc-500 text-sm font-medium">
                  Modelo: {roupa.model} | Marca: {roupa.marca} | Estilo: {roupa.estilo}
                </span>
                <strong className="text-black font-bold text-xl mt-2">
                  R$ {formatPrice(roupa.price)}
                </strong>
              </div>
            </div>
          </section>
        ))}

        {roupas.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-zinc-500 font-medium">Você ainda não possui roupas cadastradas.</p>
          </div>
        )}
      </main>
    </Container>
  );
}