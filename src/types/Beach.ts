/**
 * Status de balneabilidade de uma praia conforme CETESB.
 */
export type Balneabilidade = 'PROPRIA' | 'IMPROPRIA' | 'SEM_DADOS'

/**
 * Dados climáticos atuais retornados pelo backend (Open-Meteo).
 */
export interface DadosClimaticos {
  temperaturaAr: number | null
  precipitacao: number | null
  velocidadeVento: number | null
  direcaoVento: number | null
  indiceUv: number | null
  coberturaNuvens: number | null
  codigoClima: number | null
  ultimaAtualizacao: string | null
}

/**
 * Dados marítimos atuais retornados pelo backend (Open-Meteo Marine).
 */
export interface DadosMaritimos {
  alturaOndas: number | null
  periodoOndas: number | null
  direcaoOndas: number | null
  temperaturaAgua: number | null
  altura: number | null
  ultimaAtualizacao: string | null
}

/**
 * Dados de qualidade do ar retornados pelo backend (CETESB QUALAR).
 */
export interface QualidadeAr {
  iqa: number | null
  classificacao: string | null
  pm25: number | null
  ozonio: number | null
  ultimaAtualizacao: string | null
}

/**
 * DTO resumido de praia — usado na listagem principal.
 * Inclui dados ambientais cacheados no MongoDB para exibição nos cards.
 */
export interface BeachSummary {
  id: string
  nome: string
  imagem: string
  latitude: number
  longitude: number
  balneabilidade: Balneabilidade
  dadosClimaticos: DadosClimaticos | null
  dadosMaritimos: DadosMaritimos | null
  qualidadeAr: QualidadeAr | null
  score: number
}

/**
 * DTO completo de praia — usado na página de detalhes.
 */
export interface BeachDetail extends BeachSummary {
  dadosClimaticos: DadosClimaticos | null
  dadosMaritimos: DadosMaritimos | null
  qualidadeAr: QualidadeAr | null
}
