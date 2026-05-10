import { Link, useLocation } from 'react-router-dom'

/**
 * Cabeçalho principal — fundo branco, idêntico ao design do projeto original Praiô.
 * Logo azul + "PRAIÔ" à esquerda, nav central com pill no link ativo,
 * ícone Entrar e botão Cadastrar à direita.
 */
export function Header() {
  const { pathname } = useLocation()

  /** Pill com borda arredondada no link ativo; texto cinza com hover azul nos demais */
  const navLink = (rota: string) =>
    pathname === rota
      ? 'text-primary font-medium border border-primary/60 rounded-full px-4 py-1.5 text-md'
      : 'text-gray-600 hover:text-primary text-md transition-colors px-2 py-1.5'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm p-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">

          {/* Logo azul + texto PRAIÔ */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/logos/logo_branca.png"
              alt="Logo Praiô PG"
              className="h-12 w-auto"
            />
            <span className="font-bold text-xl tracking-tight text-marinho">
              PRAIÔ
            </span>
          </Link>

          {/* Navegação central */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLink('/')}>Início</Link>
            <Link to="/recomendacao" className={navLink('/recomendacao')}>Recomendação Inteligente</Link>
            <Link to="/praias" className={navLink('/praias')}>Praias</Link>
            <Link to="/sobre" className={navLink('/sobre')}>Sobre</Link>
          </nav>

          {/* Botões de acesso */}
          <div className="hidden md:flex items-center gap-3">
            {/* Entrar — ghost com ícone de pessoa */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary
                         text-md font-medium transition-colors"
              aria-label="Entrar na conta"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Entrar
            </button>

            {/* Cadastrar — botão sólido azul-marinho escuro */}
            <button
              type="button"
              className="bg-marinho hover:bg-primary text-white text-md font-semibold
                         px-5 py-2 rounded-full transition-colors duration-200"
            >
              Cadastrar
            </button>
          </div>

          {/* Hamburger mobile */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            aria-label="Abrir menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  )
}
