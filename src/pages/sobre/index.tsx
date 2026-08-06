import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo.png'

export function Sobre() {
  return (
    <div className="w-full min-h-screen bg-zinc-50 pt-24 px-4 pb-12">
      <main className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
        
        <img 
          src={logoImg} 
          alt="Logo da Empresa" 
          className="h-28 w-auto object-contain mb-6 drop-shadow-sm" 
        />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
          Nossa História
        </h1>
        
        <p className="text-zinc-600 leading-relaxed mb-6 max-w-2xl">
          Bem-vindo à nossa plataforma! Nascemos com a missão de transformar a experiência 
          de compras online, unindo um catálogo cuidadosamente selecionado, preços justos e 
          um atendimento humanizado focado na satisfação dos nossos clientes.
        </p>

        <p className="text-zinc-600 leading-relaxed mb-8 max-w-2xl">
          Buscamos constantemente inovação e qualidade em cada detalhe. Navegue pelas nossas 
          categorias e descubra produtos incríveis feitos sob medida para o que você procura.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full border-t border-zinc-100 pt-8 mb-8">
          <div>
            <h3 className="font-semibold text-zinc-800 text-lg mb-1">Qualidade</h3>
            <p className="text-sm text-zinc-500">Produtos validados por especialistas.</p>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 text-lg mb-1">Segurança</h3>
            <p className="text-sm text-zinc-500">Seus dados e pagamentos protegidos.</p>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 text-lg mb-1">Suporte</h3>
            <p className="text-sm text-zinc-500">Atendimento ágil para suas dúvidas.</p>
          </div>
        </div>

        <Link 
          to="/" 
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          Ir para as compras
        </Link>
      </main>
    </div>
  )
}
