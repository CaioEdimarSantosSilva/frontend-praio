import api from './api'
import type { User, LoginRequest, CadastroRequest, UsuarioUpdateRequest } from '../types/User'

/** Resposta de login/cadastro do backend */
interface AuthResponse {
  token: string
  id: string
  nome: string
  email: string
  roles: string[]
}

/**
 * Autentica o usuário e retorna token + dados básicos.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>('/auth/login', data)
  return res
}

/**
 * Cadastra novo usuário e retorna token + dados básicos.
 */
export async function cadastrar(data: CadastroRequest): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>('/auth/cadastro', data)
  return res
}

/**
 * Busca o perfil completo do usuário autenticado.
 */
export async function buscarPerfil(): Promise<User> {
  const { data } = await api.get<User>('/usuario/perfil')
  return data
}

/**
 * Atualiza nome e/ou senha do usuário autenticado.
 */
export async function atualizarPerfil(data: UsuarioUpdateRequest): Promise<User> {
  const { data: res } = await api.put<User>('/usuario/perfil', data)
  return res
}

/**
 * Adiciona uma praia à lista de favoritos.
 */
export async function adicionarFavorito(praiaId: string): Promise<User> {
  const { data } = await api.post<User>(`/usuario/favoritos/${praiaId}`)
  return data
}

/**
 * Remove uma praia da lista de favoritos.
 */
export async function removerFavorito(praiaId: string): Promise<User> {
  const { data } = await api.delete<User>(`/usuario/favoritos/${praiaId}`)
  return data
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function listarUsuarios(): Promise<User[]> {
  const { data } = await api.get<User[]>('/admin/usuarios')
  return data
}

export async function toggleAtivoUsuario(id: string): Promise<User> {
  const { data } = await api.patch<User>(`/admin/usuarios/${id}/toggle-ativo`)
  return data
}

export async function deletarUsuario(id: string): Promise<void> {
  await api.delete(`/admin/usuarios/${id}`)
}

export async function dispararAtualizacaoBalneabilidade(): Promise<{ praias_atualizadas: number }> {
  const { data } = await api.post('/admin/balneabilidade/atualizar')
  return data
}

export async function listarPraiasAdmin() {
  const { data } = await api.get('/admin/praias')
  return data
}

export async function atualizarPraiaAdmin(id: string, praia: object) {
  const { data } = await api.put(`/admin/praias/${id}`, praia)
  return data
}
