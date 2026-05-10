/**
 * Dados estáticos das 12 praias de Praia Grande SP.
 * Complementam os dados dinâmicos do backend (clima, mar, balneabilidade).
 */
export interface PraiaInfo {
  bairro: string
  extensaoKm: number   // extensão aproximada em km
  descricao: string
}

export const PRAIAS_INFO: Record<string, PraiaInfo> = {
  'Canto do Forte': {
    bairro: 'Canto do Forte',
    extensaoKm: 1.2,
    descricao: 'Praia tranquila próxima ao forte histórico, com águas calmas e boa infraestrutura.',
  },
  'Boqueirão': {
    bairro: 'Boqueirão',
    extensaoKm: 2.5,
    descricao: 'Uma das mais movimentadas, com ampla orla, comércio e fácil acesso ao centro.',
  },
  'Guilhermina': {
    bairro: 'Guilhermina',
    extensaoKm: 1.8,
    descricao: 'Praia residencial com ambiente familiar e areia fina.',
  },
  'Aviação': {
    bairro: 'Aviação',
    extensaoKm: 1.5,
    descricao: 'Tradicional e bem estruturada, frequentada por moradores locais.',
  },
  'Tupi': {
    bairro: 'Tupi',
    extensaoKm: 2.0,
    descricao: 'Ótima infraestrutura de lazer, com quiosques e área de esporte.',
  },
  'Ocian': {
    bairro: 'Ocian',
    extensaoKm: 2.2,
    descricao: 'Ampla e com ondas moderadas, popular entre jovens e surfistas.',
  },
  'Mirim': {
    bairro: 'Mirim',
    extensaoKm: 1.6,
    descricao: 'Praia com águas mais agitadas, indicada para esportes aquáticos.',
  },
  'Maracanã': {
    bairro: 'Maracanã',
    extensaoKm: 1.4,
    descricao: 'Ambiente tranquilo e menos movimentado, ideal para relaxar.',
  },
  'Caiçara': {
    bairro: 'Caiçara',
    extensaoKm: 1.3,
    descricao: 'Bairro de pescadores com charme local e boa gastronomia.',
  },
  'Real': {
    bairro: 'Real',
    extensaoKm: 1.8,
    descricao: 'Praia nobre com orla bem conservada e boa infraestrutura.',
  },
  'Flórida': {
    bairro: 'Flórida',
    extensaoKm: 1.5,
    descricao: 'Tranquila e familiar, com águas geralmente calmas.',
  },
  'Solemar': {
    bairro: 'Solemar',
    extensaoKm: 2.0,
    descricao: 'Extremo sul da cidade, mais isolada e com natureza preservada.',
  },
}
