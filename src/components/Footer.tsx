import { Link } from 'react-router-dom'

/** Links de navegação — espelha exatamente o Header */
const NAV_LINKS = [
  { label: 'Início',                  to: '/'              },
  { label: 'Recomendação Inteligente', to: '/recomendacao'  },
  { label: 'Praias',                  to: '/praias'         },
  { label: 'Sobre',                   to: '/sobre'          },
]

const SOCIAL = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

/**
 * Rodapé do Praiô.
 * Esquerda: logo + tagline + redes sociais + navegação do header.
 * Direita: card decorativo estático da Praia Real.
 */
export function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-marinho text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10 items-center">

          {/* ── Coluna 1: identidade + redes sociais ── */}
          <div className="flex flex-col items-center justify-center text-center gap-5 h-full">

            {/* Logo empilhada */}
            <div className="flex flex-col items-center gap-2">
              <img src="/logos/logo_azul.png" alt="Logo Praiô PG" className="h-16 w-auto" />
              <span className="font-bold text-2xl tracking-widest text-white">PRAIÔ</span>
            </div>

            <p className="text-white/55 text-sm leading-relaxed">
              Monitoramento em tempo real da qualidade das praias de Praia Grande SP —
              clima, mar e balneabilidade numa só plataforma.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                             text-white/60 hover:border-azul hover:text-azul transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Coluna 2: navegação (centro) ── */}
          <div className="flex flex-col items-center justify-center text-center h-full">
            <p className="text-xs font-semibold tracking-widest text-white/35 uppercase mb-5">
              Navegação
            </p>
            <nav aria-label="Navegação do rodapé">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Coluna 3: card Praia Real ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-white/5">

              {/* Imagem */}
              <div className="relative h-44 bg-gray-800 overflow-hidden">
                <img
                  src="/images/praias/real.jpg"
                  alt="Praia Real"
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
                {/* Gradiente apenas na base para legibilidade do badge */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Badge de destaque */}
                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white
                                text-xs font-semibold px-2.5 py-1 rounded-full">
                  Em destaque
                </div>
              </div>

              {/* Corpo do card */}
              <div className="px-5 py-5">

                {/* Nome + localização */}
                <h3 className="font-bold text-white text-lg leading-tight">Praia Real</h3>
                <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5 mb-4">
                  <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  Real · Praia Grande, SP · ~1.8 km
                </p>

                {/* Dados rápidos */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10
                                rounded-xl overflow-hidden mb-4">
                  {[
                    { label: 'Extensão', valor: '1.8 km'   },
                    { label: 'Bairro',   valor: 'Real'      },
                    { label: 'Cidade',   valor: 'Praia Grande' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center py-3 px-2 text-center">
                      <span className="text-white/40 text-xs mb-0.5">{item.label}</span>
                      <span className="text-white font-semibold text-xs leading-tight">{item.valor}</span>
                    </div>
                  ))}
                </div>

                {/* Descrição */}
                <p className="text-white/50 text-xs leading-relaxed mb-4">
                  Praia nobre com orla bem conservada e boa infraestrutura. Uma das mais tranquilas
                  do litoral de Praia Grande.
                </p>

                {/* Botão ver praia */}
                <Link
                  to="/praias"
                  className="block w-full text-center bg-azul/20 hover:bg-azul/40 border border-azul/30
                             text-azul hover:text-white text-xs font-semibold py-2.5 rounded-xl
                             transition-colors duration-200"
                >
                  Ver todas as praias →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Barra inferior de copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/35 text-xs">
            © {ano} PRAIÔ — Todos os direitos reservados
          </p>
          <p className="text-white/35 text-xs flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Dados: Open-Meteo · Open-Meteo Marine · CETESB
          </p>
        </div>
      </div>
    </footer>
  )
}
