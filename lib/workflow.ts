import { projectStatuses } from './validators';

export type ProjectStatusKey = keyof typeof projectStatuses;

/**
 * Fluxo de trabalho do projeto (mesma ordem das colunas do Kanban):
 * REVIEW → APPROVED → IN_PROGRESS → VALIDATION → COMPLETED
 *
 * Cada status permite avançar uma etapa e retornar uma etapa, para que a
 * equipe possa corrigir movimentos sem abrir exceções no fluxo.
 * OUT_OF_SCOPE só é alcançável antes da execução começar e pode ser
 * reconsiderado voltando para análise.
 */
export const STATUS_TRANSITIONS: Record<ProjectStatusKey, ProjectStatusKey[]> = {
  REVIEW: ['APPROVED', 'OUT_OF_SCOPE'],
  APPROVED: ['IN_PROGRESS', 'REVIEW', 'OUT_OF_SCOPE'],
  IN_PROGRESS: ['VALIDATION', 'APPROVED'],
  VALIDATION: ['COMPLETED', 'IN_PROGRESS'],
  COMPLETED: ['VALIDATION'],
  OUT_OF_SCOPE: ['REVIEW'],
};

export function canTransition(from: string, to: string): boolean {
  if (from === to) return true;
  const allowed = STATUS_TRANSITIONS[from as ProjectStatusKey];
  return Array.isArray(allowed) && allowed.includes(to as ProjectStatusKey);
}

export function allowedNextStatuses(from: string): ProjectStatusKey[] {
  return STATUS_TRANSITIONS[from as ProjectStatusKey] ?? [];
}

export function transitionErrorMessage(from: string, to: string): string {
  const fromLabel = projectStatuses[from as ProjectStatusKey] ?? from;
  const toLabel = projectStatuses[to as ProjectStatusKey] ?? to;
  const nextLabels = allowedNextStatuses(from).map((s) => projectStatuses[s]);
  return `Transição de "${fromLabel}" para "${toLabel}" não é permitida. Próximos status possíveis: ${nextLabels.join(', ')}.`;
}

const FINANCIAL_SCORE: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const TIME_SCORE: Record<string, number> = { SHORT: 3, MEDIUM: 2, LONG: 1 };

/**
 * Prioridade inicial derivada dos impactos informados no formulário público:
 * impacto financeiro alto e prazo curto puxam a prioridade para cima.
 * Sem informação, o resultado é MEDIUM (comportamento anterior).
 */
export function computePriorityFromImpacts(
  impactFinancial?: string | null,
  impactTime?: string | null
): 'LOW' | 'MEDIUM' | 'HIGH' {
  const financial = FINANCIAL_SCORE[impactFinancial ?? ''] ?? 2;
  const time = TIME_SCORE[impactTime ?? ''] ?? 2;
  const score = financial + time;
  if (score >= 5) return 'HIGH';
  if (score === 4) return 'MEDIUM';
  return 'LOW';
}
