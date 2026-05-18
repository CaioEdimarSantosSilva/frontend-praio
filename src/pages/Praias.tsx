import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useBeaches } from '../hooks/useBeaches'
import { BeachCard } from '../components/BeachCard'
import { PRAIAS_INFO } from '../data/praias-info'
import type { BeachSummary, Balneabilidade } from '../types/Beach'

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Filtro    = Balneabilidade | 'TODAS'
type Ordem     = 'nome' | 'score' | 'balneabilidade'
type Visao     = 'grid' | 'lista'

// ── Constantes ────────────────────────────────────────────────────────────────

const FILTROS: { label: string; valor: Filtro; cor: string; bg: string }[] = [
  { label: 'Todas',      valor: 'TODAS',     cor: 'text-marinho', bg: 'bg-marinho'        },
  { label: 'Próprias',   valor: 'PROPRIA',   cor: 'text-teal',    bg: 'bg-teal'           },
  { label: 'Impróprias', valor: 'IMPROPRIA', cor: 'text-orange-500', bg: 'bg-orange-400'  },
  { label: 'Sem dados',  valor: 'SEM_DADOS', cor: 'text-gray-500',   bg: 'bg-gray-400'    },
]

const ORDENS: { label: string; valor: Ordem }[] = [
  { label: 'Nome A–Z',    valor: 'nome'         },
  { label: 'Melhor score', valor: 'score'        },
  { label: 'Balneabilidade', valor: 'balneabilidade' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function ordenar(praias: BeachSummary[], ordem: Ordem): BeachSummary[] {
  return [...praias].sort((a, b) => {
    if (ordem === 'nome')  return a.nome.localeCompare(b.nome, 'pt-BR')
    if (ordem === 'score') return b.score - a.score
    // balneabilidade: PROPRIA → IMPROPRIA → SEM_DADOS
    const rank = { PROPRIA: 0, IMPROPRIA: 1, SEM_DADOS: 2 }
    return (rank[a.balneabilidade] ?? 2) - (rank[b.balneabilidade] ?? 2)
  })
}

function balneabilidadeStats(praias: BeachSummary[]) {
  return {
    proprias:  praias.filter(p => p.balneabilidade === 'PROPRIA').length,
    improprias: praias.filter(p => p.balneabilidade === 'IMPROPRIA').length,
    semDados:  praias.filter(p => p.balneabilidade === 'SEM_DADOS').length,
  }
}

// ── Componente de linha (visão lista) ─────────────────────────────────────────

function BeachRow({ praia }: { praia: BeachSummary }) {
  const info = PRAIAS_INFO[praia.nome]
  const bConf = {
    PROPRIA:   { label: 'Própria',   cls: 'bg-teal/10 text-teal border-teal/20'           },
    IMPROPRIA: { label: 'Imprópria', cls: 'bg-orange-50 text-orange-500 border-orange-200' },
    SEM_DADOS: { label: 'Sem dados', cls: 'bg-gray-50 text-gray-400 border-gray-200'      },
  }[praia.balneabilidade]

  return (
    <Link
      to={`/praias/${praia.id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
    >
      {/* Miniatura */}
      <div className="h-16 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-marinho/10">
        <img
          src={`/images/praias/${praia.imagem}`}
          alt={praia.nome}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.currentTarget.style.display = 'none' }}
          loading="lazy"
        />
      </div>

      {/* Nome + bairro */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-marinho group-hover:text-primary transition-colors truncate">
          {praia.nome}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{info?.bairro ?? 'Praia Grande'} · ~{info?.extensaoKm ?? '—'} km</p>
      </div>

      {/* Dados inline */}
      <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500 flex-shrink-0">
        <span title="Temperatura">
          🌡 {praia.dadosClimaticos?.temperaturaAr != null
            ? `${praia.dadosClimaticos.temperaturaAr.toFixed(1)}°C`
            : '—'}
        </span>
        <span title="Ondas">
          🌊 {praia.dadosMaritimos?.alturaOndas != null
            ? `${praia.dadosMaritimos.alturaOndas.toFixed(1)} m`
            : '—'}
        </span>
        {praia.score > 0 && (
          <span className="font-semibold text-primary">★ {praia.score.toFixed(1)}</span>
        )}
      </div>

      {/* Badge balneabilidade */}
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex-shrink-0 ${bConf.cls}`}>
        {bConf.label}
      </span>

      {/* Seta */}
      <svg className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  )
}

// ── Skeleton de loading ───────────────────────────────────────────────────────

function Skeleton({ visao }: { visao: Visao }) {
  return (
    <div className={visao === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
      : 'flex flex-col gap-3'
    }>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden
          ${visao === 'lista' ? 'h-24' : ''}`}>
          {visao === 'grid' && <div className="h-40 bg-gray-100" />}
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            {visao === 'grid' && <>
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
            </>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

/**
 * Página /praias — exibe as 12 praias de Praia Grande com busca, filtros,
 * ordenação e toggle entre visão grid e lista.
 */
export function Praias() {
  const { praias, carregando, erro } = useBeaches()
  const [searchParams, setSearchParams] = useSearchParams()

  const [busca,  setBusca]  = useState(searchParams.get('q') ?? '')
  const [filtro, setFiltro] = useState<Filtro>('TODAS')
  const [ordem,  setOrdem]  = useState<Ordem>('nome')
  const [visao,  setVisao]  = useState<Visao>('grid')

  // Sincroniza busca com query param ?q=
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setBusca(q)
  }, [searchParams])

  const praiasProcessadas = useMemo(() => {
    const filtradas = praias
      .filter(p => filtro === 'TODAS' || p.balneabilidade === filtro)
      .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    return ordenar(filtradas, ordem)
  }, [praias, filtro, busca, ordem])

  const stats = useMemo(() => balneabilidadeStats(praias), [praias])

  const handleBusca = (valor: string) => {
    setBusca(valor)
    if (valor.trim()) {
      setSearchParams({ q: valor.trim() }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-fundo">

      {/* ── Banner topo ───────────────────────────────────────── */}
      <div
        className="relative py-16 px-4 text-white text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #042C53 0%, #185FA5 60%, #1a7abf 100%)',
        }}
      >
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 relative">
          🏖️ Praias de Praia Grande
        </h1>
        <p className="text-white/70 text-sm sm:text-base mb-8 relative">
          12 praias monitoradas em tempo real — balneabilidade, clima e condições do mar
        </p>

        {/* Stats */}
        {!carregando && (
          <div className="flex justify-center gap-4 sm:gap-8 mb-8 relative flex-wrap">
            {[
              { label: 'Próprias',   valor: stats.proprias,   cor: 'text-emerald-300' },
              { label: 'Impróprias', valor: stats.improprias, cor: 'text-orange-300'  },
              { label: 'Sem dados',  valor: stats.semDados,   cor: 'text-white/50'    },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-3xl font-extrabold ${s.cor}`}>{s.valor}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Barra de busca */}
        <div className="max-w-lg mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
          </svg>
          <input
            type="search"
            placeholder="Buscar praia..."
            value={busca}
            onChange={e => handleBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/95 text-gray-700
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm shadow-lg"
          />
        </div>
      </div>

      {/* ── Barra de controles ─────────────────────────────────── */}
      <div className="sticky top-[65px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">

          {/* Filtros balneabilidade */}
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filtrar por balneabilidade">
            {FILTROS.map(({ label, valor, bg }) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                aria-pressed={filtro === valor}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
                  filtro === valor
                    ? `${bg} text-white border-transparent shadow-sm`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Ordenação */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:inline">Ordenar:</span>
            <select
              value={ordem}
              onChange={e => setOrdem(e.target.value as Ordem)}
              className="text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5
                         focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white cursor-pointer"
            >
              {ORDENS.map(o => (
                <option key={o.valor} value={o.valor}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Contagem */}
          <span className="text-xs text-gray-400 hidden sm:inline">
            {carregando ? '...' : `${praiasProcessadas.length} praia${praiasProcessadas.length !== 1 ? 's' : ''}`}
          </span>

          {/* Toggle visão */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setVisao('grid')}
              title="Visão em grade"
              className={`p-1.5 transition-colors ${visao === 'grid' ? 'bg-marinho text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
            <button
              onClick={() => setVisao('lista')}
              title="Visão em lista"
              className={`p-1.5 transition-colors ${visao === 'lista' ? 'bg-marinho text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Conteúdo principal ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Loading */}
        {carregando && <Skeleton visao={visao} />}

        {/* Erro */}
        {!carregando && erro && (
          <div className="text-center py-24" role="alert">
            <p className="text-5xl mb-4">🌊</p>
            <p className="text-red-500 font-medium mb-5">{erro}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-marinho
                         transition-colors font-medium text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Lista de praias */}
        {!carregando && !erro && (
          <>
            {praiasProcessadas.length === 0 ? (
              <div className="text-center py-28 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-xl font-medium mb-1">Nenhuma praia encontrada</p>
                <p className="text-sm">Tente outro termo ou remova os filtros</p>
                <button
                  onClick={() => { setBusca(''); setFiltro('TODAS') }}
                  className="mt-5 px-5 py-2 text-sm text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : visao === 'grid' ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 list-none p-0">
                {praiasProcessadas.map(praia => (
                  <li key={praia.id}>
                    <BeachCard praia={praia} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col gap-3 list-none p-0">
                {praiasProcessadas.map(praia => (
                  <li key={praia.id}>
                    <BeachRow praia={praia} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}
