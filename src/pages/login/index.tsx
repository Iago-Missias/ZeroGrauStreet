import logoImg from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// CORREÇÃO 1: Importar o cliente 'supabase' correto no lugar do antigo 'auth'
import { supabase } from '../../services/supabaseConnection';

// COLOQUE AQUI O ÚNICO E-MAIL E SENHA PERMITIDOS NO SITE
const ADMIN_EMAIL = "zero.grau20260208@gmail.com";
const ADMIN_PASSWORD = "Senha12345678"; 

const schema = z.object({
  email: z.string().email("Insira um email valido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
});

type formData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<formData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  // CORREÇÃO 2: Transformada em função assíncrona (async) para usar o Supabase
  async function onSubmit(data: formData){
    // 1. Bloqueia imediatamente se digitarem qualquer outro e-mail
    if (data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("email", {
        type: "manual",
        message: "Acesso restrito ao administrador do site."
      });
      return;
    }

    // 2. Bloqueia imediatamente se digitarem a senha incorreta antes mesmo de chamar o banco
    if (data.password !== ADMIN_PASSWORD) {
      setError("password", {
        type: "manual",
        message: "E-mail ou senha incorretos."
      });
      return;
    }

    try {
      // CORREÇÃO 3: Autenticação refeita usando a API de autenticação do Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.log("ERRO AO LOGAR", error.message);
        setError("password", {
          type: "manual",
          message: "E-mail ou senha incorretos."
        });
        return;
      }

      // Se passou por todas as validações e logou no Supabase com sucesso
      if (authData.user) {
        console.log("LOGADO COM SUCESSO!");
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      console.log("Erro inesperado no login:", err);
      setError("password", {
        type: "manual",
        message: "Erro interno ao tentar fazer login."
      });
    }
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" >
          <img 
            src={logoImg}
            alt="Logo do site"
            className="w-full" 
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email.."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha.."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button type="submit" className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">
            Acessar
          </button>
        </form>
      </div>
    </Container>
  );
}
