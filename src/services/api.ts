import axios from 'axios'
import type { BeachDetail, BeachSummary, Balneabilidade } from '../types/Beach'

/**
 * Instância Axios configurada para o backend Praiô PG.
 * Em desenvolvimento, o Vite proxy redireciona /api para http://localhost:8080.
 * Nunca chame APIs externas a partir daqui — apenas endpoints do backend próprio.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

/**
 * Retorna o resumo de todas as 12 praias de Praia Grande SP.
 */
export async function listarPraias(): Promise<BeachSummary[]> {
  const { data } = await api.get<BeachSummary[]>('/praias')
  return data
}

/**
 * Retorna os detalhes completos de uma praia pelo ID.
 *
 * @param id - ID MongoDB da praia
 */
export async function buscarPraia(id: string): Promise<BeachDetail> {
  const { data } = await api.get<BeachDetail>(`/praias/${id}`)
  return data
}

/**
 * Lista praias filtradas por status de balneabilidade.
 *
 * @param balneabilidade - PROPRIA | IMPROPRIA | SEM_DADOS
 */
export async function listarPorBalneabilidade(balneabilidade: Balneabilidade): Promise<BeachSummary[]> {
  const { data } = await api.get<BeachSummary[]>(`/praias/balneabilidade/${balneabilidade}`)
  return data
}

/**
 * Lista as melhores praias com score acima do mínimo.
 *
 * @param scoreMinimo - pontuação mínima (padrão: 7.0)
 */
export async function listarMelhoresPraias(scoreMinimo = 7.0): Promise<BeachSummary[]> {
  const { data } = await api.get<BeachSummary[]>('/praias/melhores', {
    params: { scoreMinimo },
  })
  return data
}

/**
 * Interceptor de requisição — injeta o token JWT no header Authorization
 * se houver um token salvo no localStorage.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('praio_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
