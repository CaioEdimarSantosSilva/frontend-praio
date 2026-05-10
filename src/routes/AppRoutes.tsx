import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { BeachDetail } from '../pages/BeachDetail'
import { Sobre } from '../pages/Sobre'

/**
 * Mapeamento central de rotas da aplicação.
 *
 * | Rota               | Componente    | Descrição                         |
 * |--------------------|---------------|-----------------------------------|
 * | /                  | Home          | Listagem das 12 praias            |
 * | /praias/:id        | BeachDetail   | Detalhes de uma praia específica  |
 * | /sobre             | Sobre         | Página sobre o projeto            |
 * | /*                 | Navigate      | Redireciona para /                |
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/praias/:id" element={<BeachDetail />} />
      <Route path="/sobre" element={<Sobre />} />
      {/* Rota curinga: redireciona qualquer URL desconhecida para a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
