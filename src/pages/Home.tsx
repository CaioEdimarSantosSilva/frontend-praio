import { useState, useRef } from 'react'
import { BeachCard } from '../components/BeachCard'
import { useBeaches } from '../hooks/useBeaches'
import type { Balneabilidade } from '../types/Beach'

/** Praias populares exibidas como tags rápidas no hero */
const TAGS_POPULARES = ['Canto do Forte', 'Boqueirão', 'Guilhermina', 'Ocian', 'Tupi']

/** Opções do filtro de balneabilidade */
const FILTROS: { label: string; valor: Balneabilidade | 'TODAS' }[] = [
  { label: 'Todas', valor: 'TODAS' },
  { label: 'Próprias', valor: 'PROPRIA' },
  { label: 'Impróprias', valor: 'IMPROPRIA' },
  { label: 'Sem dados', valor: 'SEM_DADOS' },
]

/**
 * Página principal — hero com foto de fundo + listagem das 12 praias de Praia Grande SP.
 * Design espelhado do projeto original Praiô.
 */
export function Home() {
  const { praias, carregando, erro } = useBeaches()
  const [filtro, setFiltro] = useState<Balneabilidade | 'TODAS'>('TODAS')
  const [busca, setBusca] = useState('')
  const listaRef = useRef<HTMLElement>(null)

  const praiasFiltradas = praias
    .filter((p) => filtro === 'TODAS' || p.balneabilidade === filtro)
    .filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))

  /** Rola a página até a listagem de praias */
  const rolarParaLista = () => {
    listaRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /** Preenche a busca com a tag clicada e rola para a lista */
  const selecionarTag = (nome: string) => {
    setBusca(nome)
    rolarParaLista()
  }

  return (
    <>
      {/* ======================================================
          HERO — foto de praia com overlay + conteúdo centralizado
          ====================================================== */}
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

        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-5 drop-shadow-lg text-white">
          Conheça a Qualidade das Praias de Praia Grande
        </h1>

        {/* Subtítulo */}
        <p className="text-white text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Informações em tempo real sobre balneabilidade, qualidade do ar e
          condições do mar nas praias monitoradas
        </p>

        {/* Barra de busca */}
        <div className="w-full max-w-xl mx-auto mb-5">
          <div className="flex items-stretch bg-white rounded-full shadow-xl overflow-hidden">
            <svg
              className="h-5 w-5 text-gray-400 ml-5 flex-shrink-0 self-center"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
            </svg>
            <input
              type="search"
              placeholder="Busque por uma praia..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={rolarParaLista}
              aria-label="Buscar praia pelo nome"
              className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 bg-transparent
                         focus:outline-none text-base"
            />
            <button
              type="button"
              onClick={rolarParaLista}
              className="bg-primary hover:bg-marinho text-white font-semibold px-8
                         transition-colors duration-200 text-sm"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Tags de praias populares */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          <span className="text-white/60 text-sm">Popular:</span>
          {TAGS_POPULARES.map((nome) => (
            <button
              key={nome}
              type="button"
              onClick={() => selecionarTag(nome)}
              className="text-sm bg-white/10 hover:bg-white/20 border border-white/25
                         rounded-full px-3 py-1 transition-colors duration-200"
            >
              {nome}
            </button>
          ))}
        </div>

        {/* Botão "Explorar" com seta para baixo */}
        <button
          type="button"
          onClick={rolarParaLista}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                     gap-1 text-white/60 hover:text-white transition-colors group"
          aria-label="Rolar para a lista de praias"
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Explorar</span>
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* ======================================================
          SEÇÃO DE PRAIAS — filtros + grid de cards
          ====================================================== */}
      <section
        ref={listaRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
        aria-label="Lista das praias"
      >
        {/* Título da seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-marinho">As 12 Praias de Praia Grande</h2>
            <p className="text-gray-500 text-sm mt-1">
              {busca
                ? `Buscando por "${busca}" — ${praiasFiltradas.length} resultado(s)`
                : 'Selecione uma praia para ver as condições atuais'}
            </p>
          </div>

          {/* Filtros de balneabilidade */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por balneabilidade"
          >
            {FILTROS.map(({ label, valor }) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltro(valor)}
                aria-pressed={filtro === valor}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  filtro === valor
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Estado de carregamento */}
        {carregando && (
          <div
            className="flex flex-col items-center justify-center py-32 gap-4"
            aria-live="polite"
            aria-label="Carregando praias"
          >
            <div className="w-12 h-12 border-4 border-azul border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Carregando praias...</p>
          </div>
        )}

        {/* Estado de erro */}
        {!carregando && erro && (
          <div className="text-center py-16" role="alert">
            <p className="text-red-500 font-medium mb-5">{erro}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-marinho
                         transition-colors font-medium text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de cards de praias */}
        {!carregando && !erro && (
          <>
            {praiasFiltradas.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-xl mb-2">Nenhuma praia encontrada</p>
                <p className="text-sm">Tente ajustar os filtros ou o termo de busca</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
                {praiasFiltradas.map((praia) => (
                  <li key={praia.id}>
                    <BeachCard praia={praia} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </>
  )
}
