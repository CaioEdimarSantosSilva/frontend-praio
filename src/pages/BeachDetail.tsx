import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { buscarPraia } from '../services/api'
import type { BeachDetail as BeachDetailType, Balneabilidade } from '../types/Beach'
import { PRAIAS_INFO } from '../data/praias-info'

/** Mapeia balneabilidade para rótulo e classes visuais */
function balneabilidadeInfo(b: Balneabilidade) {
  switch (b) {
    case 'PROPRIA':
      return {
        label: '✓ Própria para banho',
        classes: 'bg-teal/10 text-teal border-teal/30',
        descricao: 'Água dentro dos padrões permitidos pela CETESB. Segura para banho e contato direto.',
        icon: '🟢',
      }
    case 'IMPROPRIA':
      return {
        label: '✗ Imprópria para banho',
        classes: 'bg-red-50 text-red-700 border-red-200',
        descricao: 'Concentração de coliformes fecais acima do limite permitido. Evite contato com a água.',
        icon: '🔴',
      }
    default:
      return {
        label: '— Sem dados de balneabilidade',
        classes: 'bg-gray-100 text-gray-500 border-gray-200',
        descricao: 'Análise da CETESB ainda não disponível para esta semana.',
        icon: '⚪',
      }
  }
}

/** Rótulo legível para o índice UV */
function uvDescricao(uv: number): string {
  if (uv <= 2)  return 'Baixo — sem proteção especial necessária'
  if (uv <= 5)  return 'Moderado — use protetor solar'
  if (uv <= 7)  return 'Alto — protetor e chapéu obrigatórios'
  if (uv <= 10) return 'Muito alto — evite exposição entre 10h–16h'
  return 'Extremo — evite ao máximo o sol'
}

/** Rótulo da altura das ondas */
function ondasDescricao(altura: number): string {
  if (altura <= 0.5) return 'Tranquilo — ótimo para banho'
  if (altura <= 1.0) return 'Ondas leves'
  if (altura <= 1.5) return 'Ondas moderadas'
  if (altura <= 2.0) return 'Ondas fortes — atenção'
  if (altura <= 2.5) return 'Muito agitado — cuidado'
  return 'Perigoso — evite entrar no mar'
}

/**
 * Página de detalhes de uma praia.
 * Exibe todos os dados ambientais: balneabilidade, clima, mar e qualidade do ar.
 */
export function BeachDetail() {
  const { id } = useParams<{ id: string }>()
  const [praia, setPraia] = useState<BeachDetailType | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelado = false
    async function carregar() {
      try {
        setCarregando(true)
        const dados = await buscarPraia(id!)
        if (!cancelado) setPraia(dados)
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os dados desta praia.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    void carregar()
    return () => { cancelado = true }
  }, [id])

  if (carregando) {
    return (
      <div className="flex justify-center items-center py-32" aria-label="Carregando">
        <div className="w-12 h-12 border-4 border-azul border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (erro || !praia) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center" role="alert">
        <p className="text-red-600 font-medium mb-4">{erro ?? 'Praia não encontrada.'}</p>
        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-marinho transition-colors">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const bInfo = balneabilidadeInfo(praia.balneabilidade)
  const info = PRAIAS_INFO[praia.nome]
  const clima = praia.dadosClimaticos
  const mar   = praia.dadosMaritimos
  const ar    = praia.qualidadeAr

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navegação */}
      <Link to="/" className="text-primary hover:text-marinho text-sm font-medium flex items-center gap-1 mb-6">
        ← Voltar para as praias
      </Link>

      {/* Cabeçalho da praia */}
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 mb-6">
        <div className="h-64 bg-gradient-to-br from-azul/30 to-marinho/40 relative">
          <img
            src={`/images/praias/${praia.imagem}`}
            alt={`Foto da praia ${praia.nome}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-marinho mb-1">{praia.nome}</h1>
          {info && (
            <p className="text-gray-500 text-sm mb-3">
              {info.bairro} · Praia Grande, SP · ~{info.extensaoKm} km de extensão
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${bInfo.classes}`}>
              {bInfo.label}
            </span>
            {praia.score > 0 && (
              <span className="text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full">
                ★ Score: {praia.score.toFixed(1)} / 10
              </span>
            )}
          </div>
          {/* Descrição da balneabilidade */}
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {bInfo.icon} {bInfo.descricao}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Dados climáticos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-marinho font-semibold text-lg mb-4">Clima</h2>
          {clima ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Temperatura</dt>
                <dd className="font-semibold text-marinho">
                  {clima.temperaturaAr != null ? `${clima.temperaturaAr.toFixed(1)}°C` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Vento</dt>
                <dd className="font-semibold text-marinho">
                  {clima.velocidadeVento != null ? `${clima.velocidadeVento.toFixed(0)} km/h` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Precipitação</dt>
                <dd className="font-semibold text-marinho">
                  {clima.precipitacao != null ? `${clima.precipitacao.toFixed(1)} mm/h` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Cobertura de nuvens</dt>
                <dd className="font-semibold text-marinho">
                  {clima.coberturaNuvens != null ? `${clima.coberturaNuvens}%` : '—'}
                </dd>
              </div>
              {clima.indiceUv != null && (
                <div className="mt-2 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <dt className="text-gray-500">Índice UV</dt>
                    <dd className="font-semibold text-marinho">{clima.indiceUv.toFixed(2)}</dd>
                  </div>
                  <p className="text-xs text-gray-400">{uvDescricao(clima.indiceUv)}</p>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-gray-400 text-sm">Dados climáticos ainda não disponíveis.</p>
          )}
        </div>

        {/* Dados marítimos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-marinho font-semibold text-lg mb-4">Mar</h2>
          {mar ? (
            <dl className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <dt className="text-gray-500">Altura das ondas</dt>
                  <dd className="font-semibold text-marinho">
                    {mar.alturaOndas != null ? `${mar.alturaOndas.toFixed(2)} m` : '—'}
                  </dd>
                </div>
                {mar.alturaOndas != null && (
                  <p className="text-xs text-gray-400">{ondasDescricao(mar.alturaOndas)}</p>
                )}
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Período das ondas</dt>
                <dd className="font-semibold text-marinho">
                  {mar.periodoOndas != null ? `${mar.periodoOndas.toFixed(1)} s` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Temperatura da água</dt>
                <dd className="font-semibold text-marinho">
                  {mar.temperaturaAgua != null ? `${mar.temperaturaAgua.toFixed(1)}°C` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Direção das ondas</dt>
                <dd className="font-semibold text-marinho">
                  {mar.direcaoOndas != null ? `${mar.direcaoOndas.toFixed(0)}°` : '—'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-400 text-sm">Dados marítimos ainda não disponíveis.</p>
          )}
        </div>

        {/* Qualidade do ar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-marinho font-semibold text-lg mb-4">Qualidade do Ar</h2>
          {ar ? (
            <dl className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <dt className="text-gray-500">IQA (Índice de Qualidade do Ar)</dt>
                  <dd className="font-semibold text-marinho">{ar.iqa?.toFixed(0) ?? '—'}</dd>
                </div>
                {ar.classificacao && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    ar.classificacao === 'BOA'        ? 'bg-teal/10 text-teal' :
                    ar.classificacao === 'MODERADA'   ? 'bg-yellow-50 text-yellow-700' :
                    ar.classificacao === 'RUIM'       ? 'bg-orange-50 text-orange-600' :
                    ar.classificacao === 'MUITO_RUIM' ? 'bg-red-50 text-red-700' :
                    ar.classificacao === 'PESSIMA'    ? 'bg-red-100 text-red-900' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {ar.classificacao.replace('_', ' ')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">PM2.5</dt>
                <dd className="font-semibold text-marinho">
                  {ar.pm25 != null ? `${ar.pm25.toFixed(1)} µg/m³` : '—'}
                </dd>
              </div>
              <div className="flex justify-between items-start gap-2">
                <dt className="text-gray-500 flex-shrink-0">Ozônio (O₃)</dt>
                <dd className="font-semibold text-marinho">
                  {ar.ozonio != null ? `${ar.ozonio.toFixed(1)} µg/m³` : '—'}
                </dd>
              </div>
            </dl>
          ) : (
            <div>
              <p className="text-gray-400 text-sm">Dados de qualidade do ar indisponíveis.</p>
              <p className="text-gray-300 text-xs mt-1">
                Requer cadastro no CETESB QUALAR (qualar.cetesb.sp.gov.br).
              </p>
            </div>
          )}
        </div>

        {/* Localização */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-marinho font-semibold text-lg mb-4">Localização</h2>
          <dl className="space-y-3 text-sm">
            {info && (
              <>
                <div className="flex justify-between items-start gap-2">
                  <dt className="text-gray-500 flex-shrink-0">Bairro</dt>
                  <dd className="font-semibold text-marinho text-right">{info.bairro}</dd>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <dt className="text-gray-500 flex-shrink-0">Extensão</dt>
                  <dd className="font-semibold text-marinho">~{info.extensaoKm} km</dd>
                </div>
              </>
            )}
            <div className="flex justify-between items-start gap-2">
              <dt className="text-gray-500 flex-shrink-0">Latitude</dt>
              <dd className="font-semibold text-marinho font-mono">{praia.latitude.toFixed(4)}°</dd>
            </div>
            <div className="flex justify-between items-start gap-2">
              <dt className="text-gray-500 flex-shrink-0">Longitude</dt>
              <dd className="font-semibold text-marinho font-mono">{praia.longitude.toFixed(4)}°</dd>
            </div>
            <div className="flex justify-between items-start gap-2">
              <dt className="text-gray-500 flex-shrink-0">Cidade</dt>
              <dd className="font-semibold text-marinho">Praia Grande, SP</dd>
            </div>
          </dl>
        </div>

      </div>
    </main>
  )
}
