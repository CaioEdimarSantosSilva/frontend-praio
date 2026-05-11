import { Routes, Route, Navigate } from 'react-router-dom'
import { Home }         from '../pages/Home'
import { BeachDetail }  from '../pages/BeachDetail'
import { Sobre }        from '../pages/Sobre'
import { Login }        from '../pages/Login'
import { Cadastro }     from '../pages/Cadastro'
import { PerfilUsuario } from '../pages/PerfilUsuario'
import { Admin }        from '../pages/Admin'
import { PrivateRoute } from '../components/PrivateRoute'

/**
 * Mapeamento central de rotas da aplicação.
 *
 * | Rota          | Componente      | Acesso                      |
 * |---------------|-----------------|-----------------------------|
 * | /             | Home            | Público                     |
 * | /praias/:id   | BeachDetail     | Público                     |
 * | /sobre        | Sobre           | Público                     |
 * | /login        | Login           | Público (redireciona se logado) |
 * | /cadastro     | Cadastro        | Público                     |
 * | /usuario      | PerfilUsuario   | Autenticado                 |
 * | /admin        | Admin           | ROLE_ADMIN                  |
 * | /*            | Navigate        | → /                         |
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"          element={<Home />} />
      <Route path="/praias/:id" element={<BeachDetail />} />
      <Route path="/sobre"     element={<Sobre />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/cadastro"  element={<Cadastro />} />

      {/* Protegidas — requer autenticação */}
      <Route
        path="/usuario"
        element={
          <PrivateRoute>
            <PerfilUsuario />
          </PrivateRoute>
        }
      />

      {/* Protegida — requer ROLE_ADMIN */}
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly>
            <Admin />
          </PrivateRoute>
        }
      />

      {/* Curinga */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
