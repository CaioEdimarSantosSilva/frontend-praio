import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { atualizarPerfil, adicionarFavorito, removerFavorito } from '../services/authApi'
import { listarPraias } from '../services/api'

/**
 * Página do perfil do usuário autenticado.
 * Abas: Dashboard de praias favoritas · Editar perfil
 */
export function PerfilUsuario() {
  const { user, atualizarUser, logout } = useAuth()
  const [aba, setAba] = useState<'dashboard' | 'perfil'>('dashboard')

  // ── Dados de praias para o dashboard ──────────────────────────────────────
  const { praias, carregando: loadingPraias } = usePraias()

  const praiasFavoritas = praias.filter(p => user?.favoritosIds.includes(p.id)) ?? []
  const melhoresPraias  = [...praias].sort((a, b) => b.score - a.score).slice(0, 3)

  // ── Favoritos ─────────────────────────────────────────────────────────────
  const toggleFavorito = async (praiaId: string) => {
    if (!user) return
    try {
      const isFavorito = user.favoritosIds.includes(praiaId)
      const updated = isFavorito
        ? await removerFavorito(praiaId)
        : await adicionarFavorito(praiaId)
      atualizarUser(updated)
    } catch {
      console.error('Erro ao atualizar favorito')
    }
  }

  // ── Editar perfil ─────────────────────────────────────────────────────────
  const [nome, setNome]         = useState(user?.nome ?? '')
  const [novaSenha, setNovaSenha] = useState('')
  const [sucesso, setSucesso]   = useState('')
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault()
    setSucesso('')
    setErroForm('')
    setSalvando(true)
    try {
      const updated = await atualizarPerfil({
        nome: nome || undefined,
        novaSenha: novaSenha || undefined,
      })
      atualizarUser(updated)
      setNovaSenha('')
      setSucesso('Perfil atualizado com sucesso!')
    } catch {
      setErroForm('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const balneabilidadeLabel = (b: string) =>
    b === 'PROPRIA' ? '✅ Própria' : b === 'IMPROPRIA' ? '❌ Imprópria' : '⚪ Sem dados'

  const balneabilidadeColor = (b: string) =>
    b === 'PROPRIA' ? 'bg-green-100 text-green-700' :
    b === 'IMPROPRIA' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-[calc(100vh-128px)] bg-fundo">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header do perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-marinho flex items-center justify-center text-white text-xl font-bold">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-marinho">{user?.nome}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-300 px-4 py-2 rounded-xl"
          >
            Sair
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6">
          {(['dashboard', 'perfil'] as const).map(a => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                aba === a
                  ? 'bg-marinho text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {a === 'dashboard' ? 'Minhas praias' : 'Editar perfil'}
            </button>
          ))}
        </div>

        {/* ── Aba Dashboard ─────────────────────────────────────── */}
        {aba === 'dashboard' && (
          <div className="space-y-6">

            {/* Melhores praias do momento */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-marinho text-lg mb-4">🏆 Melhores praias agora</h2>
              {loadingPraias ? (
                <p className="text-gray-400 text-sm">Carregando...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {melhoresPraias.map((praia, i) => (
                    <Link
                      key={praia.id}
                      to={`/praias/${praia.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <span className="text-2xl font-bold text-primary/30">#{i + 1}</span>
                      <div>
                        <p className="font-medium text-sm text-marinho">{praia.nome}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${balneabilidadeColor(praia.balneabilidade)}`}>
                          {balneabilidadeLabel(praia.balneabilidade)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Praias favoritas */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-marinho text-lg mb-4">
                ⭐ Minhas favoritas
                <span className="ml-2 text-sm font-normal text-gray-400">({praiasFavoritas.length})</span>
              </h2>
              {praiasFavoritas.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  Você ainda não tem praias favoritas.{' '}
                  <Link to="/" className="text-primary hover:underline">Explorar praias</Link>
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {praiasFavoritas.map(praia => (
                    <div key={praia.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                      <Link to={`/praias/${praia.id}`} className="font-medium text-sm text-marinho hover:text-primary">
                        {praia.nome}
                      </Link>
                      <button
                        onClick={() => toggleFavorito(praia.id)}
                        className="text-yellow-400 hover:text-gray-300 transition-colors ml-2"
                        title="Remover dos favoritos"
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Todas as praias */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-marinho text-lg mb-4">🌊 Todas as praias</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {praias.map(praia => {
                  const isFav = user?.favoritosIds.includes(praia.id)
                  return (
                    <div key={praia.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                      <Link to={`/praias/${praia.id}`} className="text-sm text-marinho hover:text-primary truncate mr-2">
                        {praia.nome}
                      </Link>
                      <button
                        onClick={() => toggleFavorito(praia.id)}
                        className={`text-lg transition-colors flex-shrink-0 ${isFav ? 'text-yellow-400 hover:text-gray-300' : 'text-gray-200 hover:text-yellow-400'}`}
                        title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        ★
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* ── Aba Perfil ────────────────────────────────────────── */}
        {aba === 'perfil' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-marinho text-lg mb-6">Editar perfil</h2>
            <form onSubmit={handleSalvar} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                             focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">O email não pode ser alterado.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Deixe em branco para manter"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none
                             focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
                />
              </div>

              {sucesso && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  {sucesso}
                </div>
              )}
              {erroForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {erroForm}
                </div>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="bg-marinho hover:bg-primary disabled:opacity-60 text-white font-semibold
                           px-6 py-2.5 rounded-xl transition-colors duration-200"
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

/** Hook local para listar praias com tratamento de loading */
function usePraias() {
  const [praias, setPraias] = useState<Array<{
    id: string; nome: string; balneabilidade: string; score: number
  }>>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarPraias()
      .then(data => setPraias(data as never))
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  return { praias, carregando }
}
