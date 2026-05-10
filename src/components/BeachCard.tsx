import { Link } from 'react-router-dom'
import type { BeachSummary, Balneabilidade } from '../types/Beach'
import { PRAIAS_INFO } from '../data/praias-info'

interface BeachCardProps {
  praia: BeachSummary
}

/** Configuração visual e textual do status de balneabilidade */
function balneabilidadeConfig(b: Balneabilidade) {
  switch (b) {
    case 'PROPRIA':
      return {
        label: 'Própria',
        badge: 'bg-teal text-white',
        dot: 'bg-green-300',
        descricao: 'Água dentro dos padrões da CETESB — segura para banho',
        cor: 'text-teal',
      }
    case 'IMPROPRIA':
      return {
        label: 'Imprópria',
        badge: 'bg-orange-400 text-white',
        dot: 'bg-orange-300',
        descricao: 'Coliformes acima do limite — evite contato com a água',
        cor: 'text-orange-400',
      }
    default:
      return {
        label: 'Sem dados',
        badge: 'bg-white/20 text-white',
        dot: 'bg-gray-300',
        descricao: 'Aguardando análise da CETESB',
        cor: 'text-gray-400',
      }
  }
}

/** Rótulo legível para o índice UV (2 casas decimais) */
function uvLabel(uv: number): string {
  const valor = uv.toFixed(2)
  if (uv <= 2)  return `${valor} · Baixo`
  if (uv <= 5)  return `${valor} · Moderado`
  if (uv <= 7)  return `${valor} · Alto`
  if (uv <= 10) return `${valor} · Muito alto`
  return `${valor} · Extremo`
}

/**
 * Card detalhado de praia no estilo dark card.
 * Exibe bairro, extensão, balneabilidade explicada e dados ambientais em tempo real.
 */
export function BeachCard({ praia }: BeachCardProps) {
  const bConfig = balneabilidadeConfig(praia.balneabilidade)
  const info = PRAIAS_INFO[praia.nome]

  return (
    <Link
      to={`/praias/${praia.id}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl
                 transition-all duration-300 hover:-translate-y-1.5"
      aria-label={`Ver condições da praia ${praia.nome}`}
    >
      {/* ── Topo escuro: imagem + info principal ── */}
      <div className="relative bg-marinho overflow-hidden">
        {/* Imagem com overlay */}
        <div className="h-40 relative">
          <img
            src={`/images/praias/${praia.imagem}`}
            alt={`Praia ${praia.nome}`}
            className="w-full h-full object-cover opacity-50 group-hover:scale-105
                       transition-transform duration-500"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-marinho via-marinho/60 to-transparent" />

          {/* Badge de balneabilidade */}
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs
                           font-semibold px-2.5 py-1 rounded-full ${bConfig.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${bConfig.dot}`} aria-hidden="true" />
            {bConfig.label}
          </div>

          {/* Score */}
          {praia.score > 0 && (
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm
                            text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ★ {praia.score.toFixed(1)}
            </div>
          )}
        </div>

        {/* Nome e localização */}
        <div className="px-4 pt-2 pb-4">
          <h3 className="font-bold text-white text-lg leading-tight group-hover:text-azul transition-colors">
            {praia.nome}
          </h3>
          <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {info ? `${info.bairro} · Praia Grande, SP` : 'Praia Grande, SP'}
          </p>
        </div>
      </div>

      {/* ── Corpo claro: dados detalhados ── */}
      <div className="bg-white border border-gray-100 px-4 py-4 space-y-3">

        {/* Extensão da praia */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <svg className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Extensão
          </span>
          <span className="font-semibold text-marinho">
            {info ? `~${info.extensaoKm} km` : '—'}
          </span>
        </div>

        {/* Qualidade da água (balneabilidade explicada) */}
        <div className="flex items-start justify-between text-sm gap-2">
          <span className="flex items-center gap-2 text-gray-500 flex-shrink-0">
            <svg className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-6 7.8-6 12a6 6 0 0 0 12 0c0-4.2-4.8-6.6-6-12Z" />
            </svg>
            Água
          </span>
          <span className={`text-right text-xs font-medium leading-snug ${bConfig.cor}`}>
            {bConfig.descricao}
          </span>
        </div>

        {/* Temperatura */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <svg className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            </svg>
            Temperatura
          </span>
          <span className="font-semibold text-marinho">
            {praia.dadosClimaticos?.temperaturaAr != null
              ? `${praia.dadosClimaticos.temperaturaAr.toFixed(1)}°C`
              : '—'}
          </span>
        </div>

        {/* Ondas */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <svg className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c1.5-3 3-3 4.5 0s3 3 3 0 3-3 4.5 0 3 3 4.5 0" />
            </svg>
            Ondas
          </span>
          <span className="font-semibold text-marinho">
            {praia.dadosMaritimos?.alturaOndas != null
              ? `${praia.dadosMaritimos.alturaOndas.toFixed(1)} m`
              : '—'}
          </span>
        </div>

        {/* Índice UV */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <svg className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            Índice UV
          </span>
          <span className="font-semibold text-marinho">
            {praia.dadosClimaticos?.indiceUv != null
              ? uvLabel(praia.dadosClimaticos.indiceUv)
              : '—'}
          </span>
        </div>

        {/* Botão Ir à praia */}
        <div className="pt-1">
          <div className="w-full bg-primary group-hover:bg-marinho text-white text-sm font-semibold
                          py-3 rounded-xl text-center transition-colors duration-200 flex items-center
                          justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Ver detalhes
          </div>
        </div>
      </div>
    </Link>
  )
}
