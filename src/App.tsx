import { BrowserRouter } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AppRoutes } from './routes/AppRoutes'

/**
 * Componente raiz da aplicação.
 * Configura o roteador e monta a estrutura de layout com header e footer fixos.
 */
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-fundo">
        <Header />
        <div className="flex-1">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
