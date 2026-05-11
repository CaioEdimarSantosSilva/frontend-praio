import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Página de cadastro — formulário com nome, email e senha.
 * Após cadastro bem-sucedido, redireciona para /usuario.
 */
export function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome]         = useState('')
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro]         = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setCarregando(true)
    try {
      await cadastrar({ nome, email, senha })
      navigate('/usuario', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { erro?: string } } })?.response?.data?.erro
      setErro(msg ?? 'Erro ao criar conta. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-fundo px-4 py-8">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logos/logo_branca.png" alt="Praiô" className="h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-marinho">Criar conta</h1>
            <p className="text-gray-500 text-sm mt-1">Salve suas praias favoritas</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="nome">
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                           focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                           focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                autoComplete="new-password"
                required
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                           focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmar">
                Confirmar senha
              </label>
              <input
                id="confirmar"
                type="password"
                autoComplete="new-password"
                required
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                           focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-marinho hover:bg-primary disabled:opacity-60 text-white font-semibold
                         py-3 rounded-xl transition-colors duration-200"
            >
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Rodapé */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
