# CLAUDE.md — Frontend PRAIÔ

## Visão geral

Frontend do app **PRAIÔ** — plataforma de monitoramento de qualidade de praias brasileiras.
React 19 + Vite 8 + Material UI v9, conectado ao backend Spring Boot em `http://localhost:8080`.

## Como rodar

```bash
npm install       # instalar dependências
npm run dev       # dev server em http://localhost:5173
npm run build     # build de produção
```

O backend precisa estar rodando em `http://localhost:8080` para as chamadas de autenticação funcionarem.

## Stack e dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| React | 19.2 | UI |
| Vite | 8.0 | Build/dev server |
| @mui/material | 9.0 | Componentes de UI |
| @mui/icons-material | 9.0 | Ícones |
| react-router-dom | 7.x | Navegação |
| axios | 1.x | Chamadas HTTP |
| @emotion/react + styled | 11.x | CSS-in-JS (usado pelo MUI) |

## Estrutura de arquivos

```
frontend-praio/
├── public/
│   ├── logos/
│   │   ├── logo_azul.png      ← logo azul (reservada, não usada atualmente)
│   │   └── logo_branca.png    ← logo branca (usada no header e no modal de auth)
│   └── referencias/
│       ├── referencia_home.png
│       ├── referencia_login.png
│       └── referencia_cadastro.png
└── src/
    ├── index.css              ← reset global + fonte San Francisco (system stack)
    ├── main.jsx               ← entry point; importa index.css e App
    ├── App.jsx                ← BrowserRouter + ThemeProvider + CssBaseline + AppRoutes
    ├── theme/
    │   └── theme.js           ← MUI theme com paleta e tipografia do projeto
    ├── services/
    │   ├── api.js             ← instância Axios configurada para o backend
    │   └── authService.js     ← funções de auth + leitura/escrita no localStorage
    ├── routes/
    │   └── AppRoutes.jsx      ← mapeamento de rotas
    ├── components/
    │   ├── Header.jsx         ← AppBar responsiva com logo, nav e botões de auth
    │   ├── Footer.jsx         ← rodapé simples com copyright e links
    │   └── AuthDialog.jsx     ← modal MUI de login/cadastro com abas
    └── pages/
        └── Home.jsx           ← página principal com hero, busca e controle do AuthDialog
```

## Rotas

| Rota | Comportamento |
|---|---|
| `/` | Home — dialog de auth fechado |
| `/login` | Home — dialog aberto na aba "Entrar" |
| `/cadastro` | Home — dialog aberto na aba "Cadastrar" |
| `/*` | Redireciona para `/` |

O dialog de autenticação é sobreposto à Home (não é uma página separada). A rota muda conforme o dialog abre/fecha via `useNavigate`.

## Paleta de cores

```js
base:    '#042c53'   // azul-marinho escuro (header, topo do dialog)
primary: '#185FA5'   // azul principal (botões, tabs ativas)
azul:    '#378ADD'   // azul claro (gradientes, hovers)
teal:    '#0F6E56'   // verde (cor secundária, reservada)
fundo:   '#E6F1FB'   // azul muito claro (background padrão)
```

Definidas em `src/theme/theme.js` e exportadas como `colors`.

## Tipografia

Fonte San Francisco via system font stack — usa SF Pro automaticamente em dispositivos Apple, Segoe UI no Windows. Não é necessário baixar nenhum arquivo de fonte.

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

## Autenticação

Fluxo implementado em `authService.js`:

1. **Cadastro** — `POST /api/auth/cadastro` com `{ nome, email, senha }`
2. **Login** — `POST /api/auth/login` com `{ email, senha }`
3. Resposta de sucesso é salva em `localStorage` sob a chave `praio_user`
4. O `Header` lê `localStorage` para exibir o nome do usuário logado e o botão "Sair"
5. **Logout** — remove a chave do `localStorage` e redireciona para `/`

Não há JWT implementado ainda — o backend retorna `{ id, nome, email, success, message }`.

## AuthDialog — comportamento

- Abre via rota: navegar para `/login` ou `/cadastro`
- Fecha via botão X ou após login bem-sucedido → navega de volta para `/`
- Após cadastro bem-sucedido, preenche o campo de email na aba "Entrar" automaticamente
- Validações client-side:
  - Email: formato válido
  - Senha: obrigatória no login; mínimo 6 caracteres no cadastro
  - Confirmar senha: deve coincidir
  - Aceitar termos: obrigatório no cadastro
- Feedback via `Alert` do MUI (erro em vermelho, sucesso em verde)
- Estado de loading com `CircularProgress` nos botões

## AuthDialog — estilo da logo

- Usa `logo_branca.png` (mesma do header) dentro de um container 84×84px
- Container tem `bgcolor: '#042c53'` (igual ao fundo do cabeçalho do dialog) + borda `rgba(255,255,255,0.15)` → efeito de fundo transparente
- **Não usar** container com `bgcolor: '#fff'` (cria caixa branca visível sobre o fundo escuro)

## AuthDialog — botões sociais (Google / Facebook)

- Layout: dois botões lado a lado com `gap: 1.5`
- Padding vertical: `py: 1.25` para altura respirável
- `fontWeight: 600` nos labels
- Divider acima com `my: 2`; link de troca de aba abaixo com `mt: 2`

## Convenções

- Componentes em PascalCase, arquivos `.jsx`
- Services em camelCase, arquivos `.js`
- Sem comentários de "o que faz" — nomes dos identificadores são autoexplicativos
- `sx` prop do MUI para estilos inline; sem arquivos CSS separados por componente
- Sem estado global (Redux/Zustand) por enquanto — estado local + localStorage

## O que ainda não está implementado

- Páginas de Praias, Recomendação Inteligente e Sobre (só links no header, sem rota)
- Recuperação de senha ("Esqueci a senha")
- Login social (Google/Facebook) — botões existem como placeholder
- Proteção de rotas autenticadas (PrivateRoute)
- Paginação / listagem de praias
- Integração com dados ambientais e avaliações
