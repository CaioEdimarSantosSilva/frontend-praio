import { useState, useEffect } from 'react'
import { listarPraias } from '../services/api'
import type { BeachSummary } from '../types/Beach'

/**
 * Hook customizado para buscar e gerenciar a lista de praias.
 * Encapsula os estados de loading e erro, mantendo o JSX limpo.
 */
export function useBeaches() {
  const [praias, setPraias] = useState<BeachSummary[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        setCarregando(true)
        setErro(null)
        const dados = await listarPraias()
        if (!cancelado) {
          setPraias(dados)
        }
      } catch {
        if (!cancelado) {
          setErro('Não foi possível carregar as praias. Tente novamente.')
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    void carregar()

    // Cancela a atualização de estado se o componente desmontar
    return () => {
      cancelado = true
    }
  }, [])

  return { praias, carregando, erro }
}
