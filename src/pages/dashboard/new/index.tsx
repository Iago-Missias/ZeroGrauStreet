import { ChangeEvent, useState, useContext  } from 'react';
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiUpload, FiTrash } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../../../contexts/AuthContext' 
import { v4 as uuidV4 } from 'uuid'
import { useNavigate } from 'react-router-dom';
// Importando estritamente a conexão do Supabase
import { supabase } from '../../../services/supabaseConnection'

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O campo modelo é obrigatório"),
  marca: z.string().nonempty("Marca obrigatória"),
  price: z.string().nonempty("O preço é obrigatório"),
  whatsapp: z.string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Número de telefone inválido (Insira DDD + Número)."
    })
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid: string;
  name: string; 
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // Estado criado para salvar a URL da foto principal e enviar junto no formulário final
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  // Estado para gerenciar a lista de imagens cadastradas
  const [roupaImag, setRoupaImages] = useState<ImageItemProps[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
      if(e.target.files && e.target.files[0]){
        const image = e.target.files[0];

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
           await handleUpload(image);
        } else {
          alert("Envie uma imagem jpeg ou png!");
          return;
        }
      }
  }

  // Função de upload nativa do Supabase Storage
  async function handleUpload(image: File){
      const currentUid = user?.id || user?.uid || "anonimo";
      const uidImage = uuidV4();
      const ext = image.type === 'image/jpeg' ? 'jpg' : 'png';
      
      const filePath = `${currentUid}/${uidImage}.${ext}`;

      const { data, error } = await supabase.storage
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

  // 3. Função de envio reestruturada 100% para salvar no banco de dados do Supabase
  async function onSubmit(data: FormData) {
    if(roupaImag.length === 0){
      alert("Por favor, envie alguma imagem de roupa antes de cadastrar!");
      return;
    }

    // Mapeia os links das imagens corretamente a partir do array de estado local
    const roupaListImages = roupaImag.map(roupa => {
      return {
        uid: roupa.uid,
        name: roupa.name,
        url: roupa.url
      }
    });

    try {
      // Grava os dados na tabela do seu banco de dados do Supabase
      // Certifique-se de ter criado uma tabela chamada 'roupas' ou mude o nome abaixo
      const { error } = await supabase
        .from('roupas') 
        .insert({
          name: data.name,
          model: data.model,
          marca: data.marca,
          price: data.price,
          whatsapp: data.whatsapp,
          uid: user?.id || user?.uid || "anonimo",
          images: roupaListImages // Salvando a lista de fotos como formato JSON/Text no banco
        });

      if (error) {
        console.error("Erro ao gravar dados no Supabase:", error.message);
        alert("Erro ao salvar o produto no banco de dados.");
        return;
      }

      console.log("CADASTRADO COM SUCESSO NO SUPABASE!");
      
      // Limpa os campos do formulário e estados locais
      reset();
      setRoupaImages([]);
      setAvatarUrl("");
      
      // Redireciona o administrador de volta ao painel
      navigate("/dashboard");

    } catch (error) {
      console.log("Erro inesperado no cadastro:", error);
    }
  }

  // 4. Função de exclusão de arquivos do Storage
  async function handleDeleteImage(item: ImageItemProps){
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
    } catch(err) {
      console.log("ERRO AO DELETAR:", err);
    }
  }

  return (
    <Container>
      <DashboardHeader/>
      
      {/* Área de Upload de Foto */}
      <div className="w-full bg-white p-4 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-4 border border-zinc-200">
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
                <FiUpload size={30} color="#000"/>
              </div>
              <span className="text-zinc-600 text-sm font-medium">Escolher foto</span>
            </>
          )}

          <input type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFile} 
          />
        </label>

        {roupaImag.map( item => (
          <div key={item.name} className="w-48 h-48 flex items-center justify-center relative">
            <button 
              className="absolute z-10 bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition-colors" 
              onClick={() => handleDeleteImage(item)}
              type="button"
            >
              <FiTrash size={20} color="#FFF"/>
            </button>
            <img
              src={item.previewUrl}
              className='rounded-lg w-full h-full object-cover border border-zinc-200'
              alt="foto"
              />
          </div>
        ))}
      </div>

      {/* Formulário com todos os seus campos do Zod */}
      <div className="w-full bg-white text-black p-4 rounded-lg flex flex-col gap-4 mt-3 border border-zinc-200">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          
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
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium hover:bg-zinc-800 transition-colors mt-2"
          >
            Cadastrar Produto
          </button>

        </form>
      </div>
    </Container>
  );
}
