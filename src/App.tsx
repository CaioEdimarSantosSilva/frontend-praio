import { BrowserRouter } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

/**
 * Componente raiz da aplicação.
 * AuthProvider envolve todo o app para disponibilizar o contexto de autenticação.
 */
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-fundo">
          <Header />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
