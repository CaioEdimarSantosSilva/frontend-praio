import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sobe o scroll para o topo da página a cada mudança de rota.
 * Deve ser renderizado dentro do BrowserRouter.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
