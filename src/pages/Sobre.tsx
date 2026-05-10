/**
 * Página Sobre — apresenta o projeto Praiô PG, sua missão e fontes de dados.
 * Textos de exemplo (lorem ipsum) — substitua pelo conteúdo real.
 */
export function Sobre() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Cabeçalho da página */}
      <div className="mb-12 text-center">
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold
                         px-4 py-1.5 rounded-full mb-4">
          Sobre o Projeto
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-marinho leading-tight mb-4">
          Praiô PG
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Monitoramento em tempo real das 12 praias de Praia Grande SP —
          balneabilidade, clima, mar e qualidade do ar numa só plataforma.
        </p>
      </div>

      {/* Imagem de capa */}
      <div className="rounded-3xl overflow-hidden mb-14 h-64 bg-gradient-to-br from-azul/30 to-marinho/50">
        <img
          src="/images/bg_hero.avif"
          alt="Panorama das praias de Praia Grande SP"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* Seções de conteúdo */}
      <div className="space-y-12 text-gray-700 leading-relaxed">

        {/* O Projeto */}
        <section>
          <h2 className="text-2xl font-bold text-marinho mb-4">O Projeto</h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae
            ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </section>

        {/* Nossa Missão */}
        <section>
          <h2 className="text-2xl font-bold text-marinho mb-4">Nossa Missão</h2>
          <p className="mb-4">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
            quisquam est, qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.
          </p>
          <p>
            Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi
            consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
            nihil molestiae consequatur.
          </p>
        </section>

        {/* Fontes de Dados */}
        <section>
          <h2 className="text-2xl font-bold text-marinho mb-6">Fontes de Dados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                titulo: 'Open-Meteo',
                descricao: 'Dados climáticos em tempo real: temperatura, vento, UV e precipitação.',
                icon: '🌤',
              },
              {
                titulo: 'Open-Meteo Marine',
                descricao: 'Condições marítimas: altura de ondas, período, direção e temperatura da água.',
                icon: '🌊',
              },
              {
                titulo: 'CETESB QUALAR',
                descricao: 'Índice de balneabilidade e qualidade do ar monitorados oficialmente.',
                icon: '💧',
              },
            ].map(({ titulo, descricao, icon }) => (
              <div
                key={titulo}
                className="bg-fundo rounded-2xl p-6 border border-azul/10 hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-marinho mb-2">{titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* As 12 Praias */}
        <section>
          <h2 className="text-2xl font-bold text-marinho mb-4">As 12 Praias Monitoradas</h2>
          <p className="mb-6">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident.
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'Canto do Forte', 'Boqueirão', 'Guilhermina',
              'Aviação', 'Tupi', 'Ocian',
              'Mirim', 'Maracanã', 'Caiçara',
              'Real', 'Flórida', 'Solemar',
            ].map((nome, i) => (
              <li
                key={nome}
                className="flex items-center gap-2 bg-white rounded-xl px-4 py-3
                           border border-gray-100 shadow-sm text-sm font-medium text-marinho"
              >
                <span className="text-xs text-gray-400 font-normal w-5">{i + 1}.</span>
                {nome}
              </li>
            ))}
          </ul>
        </section>

        {/* Tecnologia */}
        <section>
          <h2 className="text-2xl font-bold text-marinho mb-4">Tecnologia</h2>
          <p className="mb-4">
            Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
            fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
            soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'TypeScript 5', 'Vite', 'TailwindCSS', 'Spring Boot 3', 'Java 21', 'MongoDB'].map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
