/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Paleta de cores migrada da identidade visual do projeto original
      colors: {
        marinho: '#042c53',    // azul-marinho escuro (header, fundos principais)
        primary: '#185FA5',    // azul principal (botões, links, destaques)
        azul:    '#378ADD',    // azul claro (gradientes, hovers)
        teal:    '#0F6E56',    // verde-teal (balneabilidade própria, sucesso)
        fundo:   '#E6F1FB',    // azul muito claro (background padrão das páginas)
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
      },
      animation: {
        // Usada no FeaturedBeachCard da Home
        'fadeSlideUp': 'fadeSlideUp 0.4s ease-out both',
      },
      fontFamily: {
        // Stack idêntico ao projeto original — SF Pro em Apple, Segoe UI no Windows
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
