/**
 * Dados do usuário autenticado retornados pelo backend.
 */
export interface User {
  id: string
  nome: string
  email: string
  roles: string[]
  ativo: boolean
  favoritosIds: string[]
  dataCriacao: string
}

/**
 * Estado global de autenticação gerenciado pelo AuthContext.
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
}

/** Payload de login */
export interface LoginRequest {
  email: string
  senha: string
}

/** Payload de cadastro */
export interface CadastroRequest {
  nome: string
  email: string
  senha: string
}

/** Payload de atualização de perfil */
export interface UsuarioUpdateRequest {
  nome?: string
  novaSenha?: string
}
