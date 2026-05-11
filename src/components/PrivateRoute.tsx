import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Se true, exige ROLE_ADMIN — redireciona para / se não for admin */
  adminOnly?: boolean
}

/**
 * Componente de rota protegida.
 * - Redireciona para /login se não autenticado
 * - Redireciona para / se adminOnly e usuário não for admin
 */
export function PrivateRoute({ children, adminOnly = false }: Props) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  // Aguarda a reidratação do token antes de decidir
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
