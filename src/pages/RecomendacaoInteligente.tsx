/**
 * Página de Recomendação Inteligente — em desenvolvimento.
 */
export function RecomendacaoInteligente() {
  return (
    <main className="min-h-screen bg-fundo flex flex-col">

      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(4, 44, 83, 0.55) 0%,
              rgba(24, 95, 165, 0.40) 50%,
              rgba(4, 44, 83, 0.70) 100%
            ),
            url('/images/bg_hero.avif') center center / cover no-repeat
          `,
          backgroundColor: '#185FA5',
        }}
      >
        {/* Ícone de IA */}
        <div className="mb-6 w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Recomendação Inteligente
        </h1>
        <p className="text-white/75 text-lg max-w-xl leading-relaxed mb-10">
          Em breve você vai poder descrever o que está buscando — sol, tranquilidade, ondas fortes,
          família — e a IA recomenda a praia ideal para o seu momento.
        </p>

        {/* Card "em breve" */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20
                        rounded-3xl px-8 py-8 text-left">

          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-azul animate-pulse" />
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">
              Em desenvolvimento
            </span>
          </div>

          <p className="text-white font-semibold text-base mb-6 leading-snug">
            O que você vai poder fazer:
          </p>

          <ul className="space-y-4">
            {[
              { icone: '🤖', texto: 'Descreva o dia ideal: "quero uma praia calma para família"' },
              { icone: '📊', texto: 'A IA analisa condições em tempo real de todas as 12 praias' },
              { icone: '📍', texto: 'Receba a recomendação perfeita com justificativa detalhada' },
              { icone: '🔔', texto: 'Configure alertas para quando sua praia favorita estiver ótima' },
            ].map(({ icone, texto }) => (
              <li key={texto} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                <span className="text-base flex-shrink-0 mt-0.5">{icone}</span>
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </section>

    </main>
  )
}
