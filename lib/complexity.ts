/**
 * Avaliador automático de complexidade de projetos.
 * Usado exclusivamente no fluxo server-side (formulário público → banco).
 * Não é exposto ao público.
 */

type Complexity = 'LOW' | 'MEDIUM' | 'HIGH';

const CATEGORY_SCORES: Record<string, number> = {
  'Solução Completa': 3,
  'Plataforma e Programas': 3,
  'Ferramentas de IA': 2,
  'Automação': 2,
  'Dashboards': 1,
  'Chatbot': 1,
};

const HIGH_COMPLEXITY_KEYWORDS = [
  'integração', 'integrar', 'múltiplos', 'múltiplas', 'migração', 'migrar',
  'sistemas', 'segurança', 'compliance', 'api', 'banco de dados', 'real-time',
  'tempo real', 'escala', 'escalável', 'arquitetura', 'microserviço', 'pipeline',
  'orquestração', 'multi', 'enterprise', 'ERP', 'SAP', 'legado',
];

const LOW_COMPLEXITY_KEYWORDS = [
  'simples', 'básico', 'básica', 'relatório', 'visualizar', 'exibir',
  'listar', 'consulta', 'consultar', 'planilha', 'exportar',
];

export function assessComplexity(params: {
  title: string;
  description: string;
  category: string;
}): Complexity {
  const { title, description, category } = params;
  const text = `${title} ${description}`.toLowerCase();

  // Pontuação de categoria (1–3)
  const categoryScore = CATEGORY_SCORES[category] ?? 2;

  // Pontuação pelo comprimento da descrição (1–3)
  const descLength = description.trim().length;
  const lengthScore = descLength > 500 ? 3 : descLength > 200 ? 2 : 1;

  // Bônus / penalidade por palavras-chave
  const highMatches = HIGH_COMPLEXITY_KEYWORDS.filter((kw) => text.includes(kw)).length;
  const lowMatches = LOW_COMPLEXITY_KEYWORDS.filter((kw) => text.includes(kw)).length;
  const keywordBonus = Math.min(highMatches, 2) - Math.min(lowMatches, 1);

  const total = categoryScore + lengthScore + keywordBonus;

  if (total <= 3) return 'LOW';
  if (total <= 5) return 'MEDIUM';
  return 'HIGH';
}
