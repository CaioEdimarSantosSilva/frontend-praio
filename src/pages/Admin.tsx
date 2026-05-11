import { useEffect, useState } from 'react'
import {
  listarUsuarios,
  toggleAtivoUsuario,
  deletarUsuario,
  dispararAtualizacaoBalneabilidade,
  listarPraiasAdmin,
  atualizarPraiaAdmin,
} from '../services/authApi'
import type { User } from '../types/User'
import { useAuth } from '../context/AuthContext'

type Aba = 'usuarios' | 'balneabilidade' | 'praias'

/**
 * Página administrativa — acesso restrito a ROLE_ADMIN.
 * Abas: gestão de usuários · disparar atualização · editar praias
 */
export function Admin() {
  const { user: adminUser, logout } = useAuth()
  const [aba, setAba] = useState<Aba>('usuarios')

  // ── Usuários ──────────────────────────────────────────────────────────────
  const [usuarios, setUsuarios]       = useState<User[]>([])
  const [loadUsuarios, setLoadUsuarios] = useState(true)
  const [erroUsuarios, setErroUsuarios] = useState('')

  useEffect(() => {
    if (aba !== 'usuarios') return
    setLoadUsuarios(true)
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => setErroUsuarios('Erro ao carregar usuários.'))
      .finally(() => setLoadUsuarios(false))
  }, [aba])

  const handleToggleAtivo = async (id: string) => {
    const updated = await toggleAtivoUsuario(id)
    setUsuarios(prev => prev.map(u => u.id === id ? updated : u))
  }

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Deletar o usuário "${nome}"? Esta ação é irreversível.`)) return
    await deletarUsuario(id)
    setUsuarios(prev => prev.filter(u => u.id !== id))
  }

  // ── Balneabilidade ────────────────────────────────────────────────────────
  const [atualizando, setAtualizando]   = useState(false)
  const [resultadoAtualiz, setResultadoAtualiz] = useState<string>('')

  const handleAtualizar = async () => {
    setAtualizando(true)
    setResultadoAtualiz('')
    try {
      const res = await dispararAtualizacaoBalneabilidade()
      setResultadoAtualiz(`✅ ${res.praias_atualizadas} praia(s) atualizadas com sucesso!`)
    } catch {
      setResultadoAtualiz('❌ Erro ao atualizar balneabilidade.')
    } finally {
      setAtualizando(false)
    }
  }

  // ── Praias ────────────────────────────────────────────────────────────────
  const [praias, setPraias]             = useState<Array<{
    id: string; nome: string; latitude: number; longitude: number; imagem: string
  }>>([])
  const [loadPraias, setLoadPraias]     = useState(true)
  const [editando, setEditando]         = useState<string | null>(null)
  const [form, setForm]                 = useState({ nome: '', latitude: '', longitude: '', imagem: '' })
  const [salvo, setSalvo]               = useState('')

  useEffect(() => {
    if (aba !== 'praias') return
    setLoadPraias(true)
    listarPraiasAdmin()
      .then((data: unknown) => setPraias(data as never))
      .catch(() => {})
      .finally(() => setLoadPraias(false))
  }, [aba])

  const iniciarEdicao = (praia: typeof praias[0]) => {
    setEditando(praia.id)
    setForm({
      nome: praia.nome,
      latitude: String(praia.latitude),
      longitude: String(praia.longitude),
      imagem: praia.imagem ?? '',
    })
    setSalvo('')
  }

  const handleSalvarPraia = async () => {
    if (!editando) return
    const payload = {
      nome: form.nome,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      imagem: form.imagem,
    }
    const updated = await atualizarPraiaAdmin(editando, payload)
    setPraias(prev => prev.map(p => p.id === editando ? { ...p, ...updated } as never : p))
    setEditando(null)
    setSalvo('Praia atualizada com sucesso!')
    setTimeout(() => setSalvo(''), 3000)
  }

  const abas: { id: Aba; label: string }[] = [
    { id: 'usuarios',      label: '👥 Usuários'         },
    { id: 'balneabilidade', label: '🌊 Balneabilidade'   },
    { id: 'praias',        label: '🏖️ Praias'            },
  ]

  return (
    <div className="min-h-[calc(100vh-128px)] bg-fundo">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-marinho">Painel Administrativo</h1>
            <p className="text-gray-500 text-sm">{adminUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-300 px-4 py-2 rounded-xl"
          >
            Sair
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {abas.map(a => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                aba === a.id
                  ? 'bg-marinho text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* ── Aba Usuários ──────────────────────────────────────── */}
        {aba === 'usuarios' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-marinho text-lg mb-4">
              Usuários cadastrados
              <span className="ml-2 text-sm font-normal text-gray-400">({usuarios.length})</span>
            </h2>
            {loadUsuarios && <p className="text-gray-400 text-sm">Carregando...</p>}
            {erroUsuarios && <p className="text-red-500 text-sm">{erroUsuarios}</p>}
            {!loadUsuarios && usuarios.length === 0 && <p className="text-gray-400 text-sm">Nenhum usuário encontrado.</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-left">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Roles</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-marinho">{u.nome}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3">
                        {u.roles.map(r => (
                          <span key={r} className={`inline-block text-xs px-2 py-0.5 rounded-full mr-1 ${
                            r === 'ROLE_ADMIN' ? 'bg-marinho/10 text-marinho' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {u.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {u.email !== adminUser?.email && (
                            <>
                              <button
                                onClick={() => handleToggleAtivo(u.id)}
                                className="text-xs border border-gray-200 hover:border-primary hover:text-primary px-3 py-1 rounded-lg transition-colors"
                              >
                                {u.ativo ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                onClick={() => handleDeletar(u.id, u.nome)}
                                className="text-xs border border-red-100 text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                              >
                                Deletar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Aba Balneabilidade ────────────────────────────────── */}
        {aba === 'balneabilidade' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-marinho text-lg mb-2">Atualizar balneabilidade</h2>
            <p className="text-gray-500 text-sm mb-6">
              Dispara uma consulta imediata ao ArcGIS da CETESB e atualiza o status de
              balneabilidade de todas as praias de Praia Grande SP.
              Normalmente executado toda quinta-feira às 09:00.
            </p>
            <button
              onClick={handleAtualizar}
              disabled={atualizando}
              className="bg-marinho hover:bg-primary disabled:opacity-60 text-white font-semibold
                         px-6 py-3 rounded-xl transition-colors duration-200"
            >
              {atualizando ? 'Atualizando...' : '🔄 Disparar atualização agora'}
            </button>
            {resultadoAtualiz && (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm border ${
                resultadoAtualiz.startsWith('✅')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {resultadoAtualiz}
              </div>
            )}
          </div>
        )}

        {/* ── Aba Praias ────────────────────────────────────────── */}
        {aba === 'praias' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-marinho text-lg mb-4">Editar praias</h2>
            {salvo && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-green-50 border border-green-200 text-green-700">
                {salvo}
              </div>
            )}
            {loadPraias ? (
              <p className="text-gray-400 text-sm">Carregando praias...</p>
            ) : (
              <div className="space-y-3">
                {praias.map(praia => (
                  <div key={praia.id} className="border border-gray-100 rounded-xl p-4">
                    {editando === praia.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
                            <input
                              value={form.nome}
                              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Imagem</label>
                            <input
                              value={form.imagem}
                              onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                            <input
                              type="number"
                              step="any"
                              value={form.latitude}
                              onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                            <input
                              type="number"
                              step="any"
                              value={form.longitude}
                              onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSalvarPraia}
                            className="bg-marinho text-white text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-marinho">{praia.nome}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {praia.latitude}, {praia.longitude}
                          </p>
                        </div>
                        <button
                          onClick={() => iniciarEdicao(praia)}
                          className="text-sm border border-gray-200 hover:border-primary hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
