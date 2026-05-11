import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthState, CadastroRequest, LoginRequest, User } from '../types/User'
import { login as apiLogin, cadastrar as apiCadastrar, buscarPerfil } from '../services/authApi'

const TOKEN_KEY = 'praio_token'

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<User>
  cadastrar: (data: CadastroRequest) => Promise<User>
  logout: () => void
  atualizarUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Provider de autenticação — gerencia o token JWT e os dados do usuário.
 * O token é persistido no localStorage para sobreviver a recarregamentos.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
  })

  /** Ao montar, se houver token, busca o perfil para reidratar o estado. */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState(s => ({ ...s, isLoading: false }))
      return
    }

    buscarPerfil()
      .then(user => {
        setState({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.roles.includes('ROLE_ADMIN'),
          isLoading: false,
        })
      })
      .catch(() => {
        // Token expirado ou inválido — limpa
        localStorage.removeItem(TOKEN_KEY)
        setState({ user: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false })
      })
  }, [])

  const login = async (data: LoginRequest): Promise<User> => {
    const res = await apiLogin(data)
    localStorage.setItem(TOKEN_KEY, res.token)

    const user = await buscarPerfil()
    setState({
      user,
      token: res.token,
      isAuthenticated: true,
      isAdmin: user.roles.includes('ROLE_ADMIN'),
      isLoading: false,
    })
    return user
  }

  const cadastrar = async (data: CadastroRequest): Promise<User> => {
    const res = await apiCadastrar(data)
    localStorage.setItem(TOKEN_KEY, res.token)

    const user = await buscarPerfil()
    setState({
      user,
      token: res.token,
      isAuthenticated: true,
      isAdmin: user.roles.includes('ROLE_ADMIN'),
      isLoading: false,
    })
    return user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false })
  }

  const atualizarUser = (user: User) => {
    setState(s => ({ ...s, user, isAdmin: user.roles.includes('ROLE_ADMIN') }))
  }

  return (
    <AuthContext.Provider value={{ ...state, login, cadastrar, logout, atualizarUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook para consumir o AuthContext.
 * Lança erro se usado fora do AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
