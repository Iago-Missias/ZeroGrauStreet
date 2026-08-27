import { ChangeEvent, useState, useContext, useEffect } from 'react';
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiUpload, FiTrash } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../../../contexts/AuthContext';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../services/supabaseConnection';

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O campo modelo é obrigatório"),
  marca: z.string().nonempty("Marca obrigatória"),
  price: z.string().nonempty("O preço é obrigatório"),
  whatsapp: z.string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Número de telefone inválido (Insira DDD + Número)."
    }),
  estilo: z.string().nonempty("O campo estilo é obrigatório"),
  categoria: z.string().nonempty("Selecione uma categoria"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [roupaImag, setRoupaImages] = useState<ImageItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  // 🔥 CARREGA OS DADOS PARA EDIÇÃO
  useEffect(() => {
    if (id) {
      console.log('🔍 ID recebido para edição:', id);
      async function fetchRoupa() {
        try {
          const { data, error } = await supabase
            .from('roupas')
            .select('*')
            .eq('id', Number(id))
            .single();

          console.log('📦 Dados da roupa:', data);
          console.log('❌ Erro ao buscar:', error);

          if (error) {
            console.error('Erro ao buscar roupa:', error);
            alert('Erro ao carregar dados para edição.');
            navigate('/dashboard');
            return;
          }
          if (data) {
            reset({
              name: data.name,
              model: data.model,
              marca: data.marca,
              price: String(data.price),
              whatsapp: data.whatsapp,
              estilo: data.estilo,
              categoria: data.categoria,
            });
            if (data.images && data.images.length > 0) {
              setAvatarUrl(data.images[0].url);
            }
            console.log('✅ Formulário preenchido com sucesso!');
          } else {
            alert('Nenhum registro encontrado com este ID.');
            navigate('/dashboard');
          }
        } catch (err) {
          console.error('Erro inesperado:', err);
          alert('Erro ao carregar dados.');
          navigate('/dashboard');
        } finally {
          setInitialLoading(false);
        }
      }
      fetchRoupa();
    } else {
      setInitialLoading(false);
    }
  }, [id, reset, navigate]);

  // ===== HANDLERS DE UPLOAD E IMAGENS =====
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem jpeg ou png!");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    const currentUid = user?.id || user?.uid || "anonimo";
    const uidImage = uuidV4();
    const ext = image.type === 'image/jpeg' ? 'jpg' : 'png';
    const filePath = `${currentUid}/${uidImage}.${ext}`;

    const { error } = await supabase.storage
      .from('ZeroGrau')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      alert("Erro ao fazer upload da imagem: " + error.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('ZeroGrau')
      .getPublicUrl(filePath);

    const downloadUrl = publicUrlData.publicUrl;

    const imageItem: ImageItemProps = {
      name: filePath,
      uid: currentUid,
      previewUrl: URL.createObjectURL(image),
      url: downloadUrl
    };

    setRoupaImages((images) => [...images, imageItem]);
    setAvatarUrl(downloadUrl);
  }

  async function handleDeleteImage(item: ImageItemProps) {
    try {
      const { error } = await supabase.storage
        .from('ZeroGrau')
        .remove([item.name]);

      if (error) {
        alert("Erro ao deletar arquivo do servidor: " + error.message);
        return;
      }

      setRoupaImages((images) => images.filter((roupa) => roupa.url !== item.url));
      if (avatarUrl === item.url) {
        setAvatarUrl("");
      }
    } catch (err) {
      console.log("ERRO AO DELETAR:", err);
    }
  }

  // ===== SUBMIT =====
  async function onSubmit(data: FormData) {
    // Se for cadastro (sem id), exige imagem
    if (roupaImag.length === 0 && !id) {
      alert("Por favor, envie alguma imagem de roupa antes de cadastrar!");
      return;
    }

    const roupaListImages = roupaImag.map(roupa => ({
      uid: roupa.uid,
      name: roupa.name,
      url: roupa.url
    }));

    setLoading(true);

    try {
      if (id) {
        // 🔥 EDIÇÃO: atualiza a roupa
        console.log('📤 Enviando UPDATE para ID:', Number(id));
        const updateData = {
          name: data.name,
          model: data.model,
          marca: data.marca,
          price: data.price, // será convertido para número pelo Supabase se for texto? melhor converter
          whatsapp: data.whatsapp,
          estilo: data.estilo,
          categoria: data.categoria,
          ...(roupaListImages.length > 0 && { images: roupaListImages }),
        };
        console.log('📤 Dados do update:', updateData);

        const { data: updated, error } = await supabase
          .from('roupas')
          .update(updateData)
          .eq('id', Number(id))
          .select();

        console.log('✅ Resultado do update:', updated);
        console.log('❌ Erro do update:', error);

        if (error) {
          console.error('Erro no update:', error);
          alert(`Erro ao atualizar: ${error.message}`);
          return;
        }

        if (!updated || updated.length === 0) {
          alert('⚠️ Nenhum registro foi atualizado. Verifique se o ID existe.');
          return;
        }

        alert('Roupa atualizada com sucesso!');
        navigate('/dashboard');
        setTimeout(() => window.location.reload(), 200);
      } else {
        // 🔥 CADASTRO
        const { error } = await supabase
          .from('roupas')
          .insert({
            name: data.name,
            model: data.model,
            marca: data.marca,
            price: data.price,
            whatsapp: data.whatsapp,
            uid: user?.id || user?.uid || "anonimo",
            images: roupaListImages,
            estilo: data.estilo,
            categoria: data.categoria,
          });

        if (error) {
          console.error('Erro no insert:', error);
          alert(`Erro ao cadastrar: ${error.message}`);
          return;
        }

        alert('Roupa cadastrada com sucesso!');
        navigate('/dashboard');
        setTimeout(() => window.location.reload(), 200);
      }

      reset();
      setRoupaImages([]);
      setAvatarUrl("");

    } catch (error: any) {
      console.error("Erro no onSubmit:", error);
      alert(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <Container>
        <DashboardHeader />
        <div className="text-center py-10">Carregando dados para edição...</div>
      </Container>
    );
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full pt-16 bg-white p-4 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-4 border border-zinc-200">
        <label className="border-2 border-dashed border-zinc-300 w-48 h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-zinc-50 transition-all gap-2 relative overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Preview da roupa"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <div className="p-2 rounded-full bg-zinc-100">
                <FiUpload size={30} color="#000" />
              </div>
              <span className="text-zinc-600 text-sm font-medium">Escolher foto</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        {roupaImag.map(item => (
          <div key={item.name} className="w-48 h-48 flex items-center justify-center relative">
            <button
              className="absolute z-10 bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition-colors"
              onClick={() => handleDeleteImage(item)}
              type="button"
            >
              <FiTrash size={20} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className='rounded-lg w-full h-full object-cover border border-zinc-200'
              alt="foto"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white text-black p-4 rounded-lg flex flex-col gap-4 mt-3 border border-zinc-200">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            {id ? 'Editar Roupa' : 'Cadastrar Roupa'}
          </h2>

          <div className="mb-1">
            <p className="mb-2 font-medium">Nome da Roupa</p>
            <Input
              type="text"
              placeholder="Ex: Camiseta Nike Overflow..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="mb-2 font-medium">Modelo</p>
              <Input
                type="text"
                placeholder="Ex: Oversized, Streetwear..."
                name="model"
                error={errors.model?.message}
                register={register}
              />
            </div>
            <div>
              <p className="mb-2 font-medium">Marca</p>
              <Input
                type="text"
                placeholder="Ex: Nike, Adidas..."
                name="marca"
                error={errors.marca?.message}
                register={register}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Estilo</p>
            <Input
              type="text"
              placeholder="Ex: Casual, Esportivo, Social..."
              name="estilo"
              error={errors.estilo?.message}
              register={register}
            />
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Categoria</p>
            <select
              {...register('categoria')}
              className="w-full border-2 rounded-md h-11 px-2 bg-white border-zinc-300 focus:border-sky-500 outline-none transition-colors"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Shorts">Shorts</option>
              <option value="Acessório">Acessório</option>
              <option value="Camisa">Camisa</option>
              <option value="Calça">Calça</option>
              <option value="Cueca">Cueca</option>
            </select>
            {errors.categoria && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.categoria.message}
              </span>
            )}
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="mb-2 font-medium">Preço</p>
              <Input
                type="text"
                placeholder="Ex: 199,00..."
                name="price"
                error={errors.price?.message}
                register={register}
              />
            </div>
            <div>
              <p className="mb-2 font-medium">WhatsApp de Contato</p>
              <Input
                type="text"
                placeholder="Ex: 67999999999"
                name="whatsapp"
                error={errors.whatsapp?.message}
                register={register}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium hover:bg-zinc-800 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : (id ? 'Atualizar Produto' : 'Cadastrar Produto')}
          </button>
        </form>
      </div>
    </Container>
  );
}