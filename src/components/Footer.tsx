import { Link } from 'react-router-dom'

/**
 * Rodapé da aplicação — design espelhado do projeto original Praiô.
 * Fundo azul-marinho escuro, logo + descrição à esquerda, colunas de nav ao centro,
 * e barra inferior com copyright e fontes de dados.
 */
export function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-marinho text-white">

      {/* Corpo principal do footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Coluna 1: Logo + descrição + redes sociais */}
          <div className="md:col-span-1 flex flex-col items-start gap-5">
            <div className="flex flex-col items-center gap-3 w-full">
              <img
                src="/logos/logo_azul.png"
                alt="Logo Praiô PG"
                className="h-20 w-auto"
              />
              <span className="font-bold text-xl tracking-widest text-white">PRAIÔ</span>
            </div>
            <p className="text-white/60 text-sm text-center leading-relaxed">
              Monitoramento em tempo real da qualidade das praias de Praia Grande SP —
              clima, ar e mar numa só plataforma.
            </p>

            {/* Ícones de redes sociais */}
            <div className="flex items-center gap-3 mx-auto">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram do Praiô PG"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           hover:border-azul hover:text-azul transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook do Praiô PG"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           hover:border-azul hover:text-azul transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter do Praiô PG"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           hover:border-azul hover:text-azul transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">
              Navegação
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Início', to: '/' },
                { label: 'Praias', to: '/praias' },
                { label: 'Mapa interativo', to: '/mapa' },
                { label: 'Melhores praias', to: '/melhores' },
                { label: 'Alertas', to: '/alertas' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Informações */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">
              Informações
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Como funciona', to: '/como-funciona' },
                { label: 'Sobre o projeto', to: '/sobre' },
                { label: 'Dados e fontes', to: '/dados' },
                { label: 'Balneabilidade CETESB', to: '/cetesb' },
                { label: 'Contato', to: '/contato' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: As 12 Praias */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">
              As 12 Praias
            </h3>
            <ul className="space-y-2">
              {[
                'Canto do Forte', 'Boqueirão', 'Guilhermina', 'Aviação',
                'Tupi', 'Ocian', 'Mirim', 'Maracanã',
                'Caiçara', 'Real', 'Flórida', 'Solemar',
              ].map((nome) => (
                <li key={nome}>
                  <span className="text-white/50 text-sm">{nome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior de copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/40 text-xs">
            © {ano} PRAIÔ — Todos os direitos reservados
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Dados: Open-Meteo · Open-Meteo Marine · CETESB QUALAR
          </p>
        </div>
      </div>
    </footer>
  )
}
