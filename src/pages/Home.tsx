import { useState, useMemo, useEffect, useRef } from 'react'
import { useBeaches } from '../hooks/useBeaches'
import { PRAIAS_INFO } from '../data/praias-info'
import type { BeachSummary, Balneabilidade } from '../types/Beach'

// ── Constantes ────────────────────────────────────────────────────────────────

const TAGS_POPULARES = ['Canto do Forte', 'Boqueirão', 'Guilhermina', 'Ocian', 'Tupi']

// ── Helpers ───────────────────────────────────────────────────────────────────

function balneabilidadeConf(b: Balneabilidade) {
  switch (b) {
    case 'PROPRIA':
      return {
        label: 'Própria para banho',
        descricao: 'Água dentro dos padrões CETESB — segura para banho e contato direto.',
        badge: 'bg-emerald-500 text-white',
        bar: 'bg-emerald-500',
        icon: '✓',
      }
    case 'IMPROPRIA':
      return {
        label: 'Imprópria para banho',
        descricao: 'Coliformes acima do limite permitido — evite contato com a água.',
        badge: 'bg-orange-500 text-white',
        bar: 'bg-orange-500',
        icon: '✕',
      }
    default:
      return {
        label: 'Sem dados de balneabilidade',
        descricao: 'Análise da CETESB ainda não disponível para esta semana.',
        badge: 'bg-slate-500 text-white',
        bar: 'bg-slate-500',
        icon: '—',
      }
  }
}

function uvLabel(uv: number) {
  if (uv <= 2)  return { texto: 'Baixo',      cor: 'text-emerald-600' }
  if (uv <= 5)  return { texto: 'Moderado',   cor: 'text-yellow-600'  }
  if (uv <= 7)  return { texto: 'Alto',        cor: 'text-orange-500'  }
  if (uv <= 10) return { texto: 'Muito alto',  cor: 'text-red-500'     }
  return           { texto: 'Extremo',     cor: 'text-red-700'     }
}

function ondasLabel(m: number) {
  if (m <= 0.5) return 'Tranquilo'
  if (m <= 1.0) return 'Leve'
  if (m <= 1.5) return 'Moderado'
  if (m <= 2.0) return 'Forte'
  return 'Muito forte'
}

/**
 * Converte o código WMO do Open-Meteo em ícone + rótulo de tempo
 * no estilo dos widgets de clima de celular.
 */
function climaLabel(codigo: number): { icon: string; texto: string } {
  if (codigo === 0)                          return { icon: '☀️',  texto: 'Céu limpo'      }
  if (codigo === 1)                          return { icon: '🌤️',  texto: 'Principalmente limpo' }
  if (codigo === 2)                          return { icon: '⛅',  texto: 'Parcialmente nublado' }
  if (codigo === 3)                          return { icon: '☁️',  texto: 'Nublado'         }
  if (codigo === 45 || codigo === 48)        return { icon: '🌫️',  texto: 'Neblina'         }
  if (codigo === 51 || codigo === 56)        return { icon: '🌦️',  texto: 'Chuviscando'     }
  if (codigo === 53 || codigo === 55 || codigo === 57) return { icon: '🌧️', texto: 'Garoa'  }
  if (codigo === 61)                         return { icon: '🌧️',  texto: 'Chuva leve'     }
  if (codigo === 63)                         return { icon: '🌧️',  texto: 'Chuva moderada' }
  if (codigo === 65)                         return { icon: '🌧️',  texto: 'Chuva forte'    }
  if (codigo === 71 || codigo === 73)        return { icon: '🌨️',  texto: 'Neve leve'      }
  if (codigo === 75 || codigo === 77)        return { icon: '❄️',  texto: 'Neve forte'      }
  if (codigo === 80)                         return { icon: '🌦️',  texto: 'Pancadas leves' }
  if (codigo === 81 || codigo === 82)        return { icon: '⛈️',  texto: 'Pancadas fortes' }
  if (codigo === 85 || codigo === 86)        return { icon: '🌨️',  texto: 'Neve em pancadas' }
  if (codigo === 95)                         return { icon: '⛈️',  texto: 'Tempestade'     }
  if (codigo === 96 || codigo === 99)        return { icon: '⛈️',  texto: 'Tempestade c/ granizo' }
  return { icon: '🌡️', texto: 'Indisponível' }
}

// ── Card grande da praia selecionada ──────────────────────────────────────────

function FeaturedBeachCard({ praia, onFechar }: { praia: BeachSummary; onFechar: () => void }) {
  const info  = PRAIAS_INFO[praia.nome]
  const bConf = balneabilidadeConf(praia.balneabilidade)
  const clima = praia.dadosClimaticos
  const mar   = praia.dadosMaritimos
  const uv         = clima?.indiceUv    != null ? uvLabel(clima.indiceUv)       : null
  const ondas      = mar?.alturaOndas   != null ? ondasLabel(mar.alturaOndas)  : null
  const condicao   = clima?.codigoClima != null ? climaLabel(clima.codigoClima) : null

  const stats: { label: string; valor: string; sub?: string; cor?: string }[] = [
    {
      label: 'Temperatura',
      valor: clima?.temperaturaAr != null ? `${clima.temperaturaAr.toFixed(1)}°C` : '—',
    },
    {
      label: 'Ondas',
      valor: mar?.alturaOndas != null ? `${mar.alturaOndas.toFixed(1)} m` : '—',
      sub: ondas ?? undefined,
    },
    {
      label: 'Vento',
      valor: clima?.velocidadeVento != null ? `${clima.velocidadeVento.toFixed(0)} km/h` : '—',
    },
    {
      label: 'Índice UV',
      valor: clima?.indiceUv != null ? clima.indiceUv.toFixed(1) : '—',
      sub: uv?.texto,
      cor: uv?.cor,
    },
    {
      label: 'Temp. água',
      valor: mar?.temperaturaAgua != null ? `${mar.temperaturaAgua.toFixed(1)}°C` : '—',
    },
    {
      label: 'Tempo',
      valor: condicao?.texto ?? '—',
    },
  ]

  return (
    <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden
                    animate-fadeSlideUp">

      {/* Botão fechar */}
      <button
        onClick={onFechar}
        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50
                   text-white flex items-center justify-center transition-colors"
        aria-label="Fechar"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* ── Topo: imagem com overlay ── */}
      <div className="relative h-72 sm:h-80 bg-marinho overflow-hidden">
        <img
          src={`/images/praias/${praia.imagem}`}
          alt={praia.nome}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        {/* Score */}
        {praia.score > 0 && (
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm border border-white/20
                          text-white text-sm font-bold px-3 py-1 rounded-full">
            ★ {praia.score.toFixed(1)} / 10
          </div>
        )}
      </div>

      {/* ── Badge de balneabilidade ── */}
      <div className={`${bConf.bar} px-6 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-base">{bConf.icon}</span>
          <span className="text-white font-semibold text-sm">{bConf.label}</span>
        </div>
        <p className="text-white/80 text-xs hidden sm:block max-w-xs text-right">{bConf.descricao}</p>
      </div>

      {/* ── Grid de dados ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-100 border-b border-gray-100">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col items-center justify-center py-5 px-2 text-center">
            <span className="text-xs text-gray-400 mb-1">{s.label}</span>
            <span className="font-bold text-marinho text-base leading-tight">{s.valor}</span>
            {/* Espaço reservado para sub — invisível quando ausente, mantém altura uniforme */}
            <span className={`text-xs mt-1 h-4 leading-none ${s.sub ? (s.cor ?? 'text-gray-400') : 'invisible'}`}>
              {s.sub ?? '·'}
            </span>
          </div>
        ))}
      </div>

      {/* ── Rodapé: nome + localização + descrição + botão ── */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold text-marinho leading-tight">{praia.nome}</h2>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5 mb-3">
          <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {info ? `${info.bairro} · Praia Grande, SP · ~${info.extensaoKm} km` : 'Praia Grande, SP'}
        </p>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-gray-500 text-sm leading-relaxed flex-1 min-w-0">
            {info?.descricao ?? `Uma das 12 praias monitoradas de Praia Grande SP.`}
          </p>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${praia.latitude},${praia.longitude}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-marinho text-white
                       text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Como chegar
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Página Home ───────────────────────────────────────────────────────────────

/**
 * Página principal — hero fullscreen + pesquisa de praia com card grande inline.
 * Totalmente independente de /praias.
 */
export function Home() {
  const { praias, carregando } = useBeaches()
  const [busca, setBusca]                   = useState('')
  const [praiaSelecionada, setPraiaSelecionada] = useState<BeachSummary | null>(null)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sugestões filtradas pelo que foi digitado
  const sugestoes = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo || termo.length < 2) return []
    return praias.filter(p => p.nome.toLowerCase().includes(termo))
  }, [praias, busca])

  // Scroll suave para o card quando uma praia é selecionada
  useEffect(() => {
    if (!praiaSelecionada) return
    const timer = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [praiaSelecionada?.id])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selecionarPraia = (praia: BeachSummary) => {
    setPraiaSelecionada(praia)
    setBusca(praia.nome)
    setDropdownAberto(false)
  }

  const handleInputChange = (valor: string) => {
    setBusca(valor)
    setDropdownAberto(true)
    if (!valor.trim()) setPraiaSelecionada(null)
  }

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (sugestoes.length > 0) selecionarPraia(sugestoes[0])
    }
    if (e.key === 'Escape') setDropdownAberto(false)
  }

  const handleBuscarClick = () => {
    if (sugestoes.length > 0) selecionarPraia(sugestoes[0])
  }

  const handleTag = (nome: string) => {
    const praia = praias.find(p => p.nome === nome)
    if (praia) selecionarPraia(praia)
    else { setBusca(nome); setDropdownAberto(true) }
  }

  const limpar = () => {
    setBusca('')
    setPraiaSelecionada(null)
    setDropdownAberto(false)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-white text-center px-4"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(4, 44, 83, 0.50) 0%,
              rgba(24, 95, 165, 0.40) 50%,
              rgba(4, 44, 83, 0.65) 100%
            ),
            url('/images/bg_hero.avif') center center / cover no-repeat
          `,
          backgroundColor: '#185FA5',
        }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-5 drop-shadow-lg">
          Conheça a Qualidade das Praias de Praia Grande
        </h1>

        <p className="text-white text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Informações em tempo real sobre balneabilidade, qualidade do ar e
          condições do mar nas praias monitoradas
        </p>

        {/* Barra de busca com autocomplete */}
        <div className="w-full max-w-xl mx-auto mb-5 relative" ref={containerRef}>
          <div className="flex items-stretch bg-white rounded-full shadow-xl overflow-visible relative z-10">
            <svg
              className="h-5 w-5 text-gray-400 ml-5 flex-shrink-0 self-center"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2} aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={carregando ? 'Carregando praias...' : 'Busque por uma praia...'}
              value={busca}
              disabled={carregando}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleEnter}
              onFocus={() => busca.trim().length >= 2 && setDropdownAberto(true)}
              aria-label="Buscar praia pelo nome"
              className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 bg-transparent
                         focus:outline-none text-base min-w-0 rounded-l-full disabled:cursor-wait"
            />
            {/* Botão limpar */}
            {busca && (
              <button
                type="button"
                onClick={limpar}
                className="self-center pr-2 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label="Limpar busca"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleBuscarClick}
              disabled={carregando}
              className="bg-primary hover:bg-marinho disabled:opacity-50 text-white font-semibold
                         px-8 transition-colors duration-200 text-sm rounded-r-full flex-shrink-0"
            >
              Buscar
            </button>
          </div>

          {/* Dropdown de sugestões */}
          {dropdownAberto && sugestoes.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl
                            border border-gray-100 overflow-hidden z-50">
              {sugestoes.map((praia, i) => {
                const info = PRAIAS_INFO[praia.nome]
                const bConf = balneabilidadeConf(praia.balneabilidade)
                return (
                  <button
                    key={praia.id}
                    type="button"
                    onClick={() => selecionarPraia(praia)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50
                                transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    {/* Miniatura */}
                    <div className="h-10 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-marinho/10">
                      <img
                        src={`/images/praias/${praia.imagem}`}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-marinho text-sm">{praia.nome}</p>
                      <p className="text-gray-400 text-xs truncate">
                        {info?.bairro ?? 'Praia Grande'} · ~{info?.extensaoKm ?? '?'} km
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${bConf.badge}`}>
                      {praia.balneabilidade === 'PROPRIA' ? 'Própria' :
                       praia.balneabilidade === 'IMPROPRIA' ? 'Imprópria' : 'Sem dados'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Dropdown "sem resultado" */}
          {dropdownAberto && busca.trim().length >= 2 && sugestoes.length === 0 && !carregando && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl
                            border border-gray-100 px-5 py-4 z-50 text-center">
              <p className="text-gray-400 text-sm">Nenhuma praia encontrada para "{busca}"</p>
            </div>
          )}
        </div>

        {/* Tags de praias populares */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          <span className="text-white/60 text-sm">Popular:</span>
          {TAGS_POPULARES.map(nome => (
            <button
              key={nome}
              type="button"
              onClick={() => handleTag(nome)}
              className="text-sm bg-white/10 hover:bg-white/20 border border-white/25
                         rounded-full px-3 py-1 transition-colors duration-200"
            >
              {nome}
            </button>
          ))}
        </div>

      </section>

      {/* ── Resultado: card grande ────────────────────────────── */}
      <div
        ref={resultRef}
        className={`bg-fundo transition-all duration-500 ${praiaSelecionada ? 'py-12' : 'py-0'}`}
      >
        {praiaSelecionada && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Label de resultado */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
              </svg>
              Resultado da pesquisa
            </p>
            <FeaturedBeachCard praia={praiaSelecionada} onFechar={limpar} />
          </div>
        )}
      </div>
    </>
  )
}
