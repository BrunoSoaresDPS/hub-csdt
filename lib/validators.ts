export const projectStatuses = {
  REVIEW: 'Em análise',
  APPROVED: 'Aprovado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
} as const;

export const priorityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
} as const;

export const complexityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
} as const;

export function sanitizeInput(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>"'`]/g, '');
}

export function validateProjectPayload(data: any) {
  const errors: string[] = [];
  if (!data.title || typeof data.title !== 'string') errors.push('Título do projeto é obrigatório.');
  if (!data.description || typeof data.description !== 'string') errors.push('Descrição é obrigatória.');
  if (!data.owner || typeof data.owner !== 'string') errors.push('Responsável é obrigatório.');
  if (!data.startDate || isNaN(Date.parse(data.startDate))) errors.push('Data de início inválida.');
  if (!data.endDate || isNaN(Date.parse(data.endDate))) errors.push('Data prevista inválida.');
  if (!data.status || !Object.keys(projectStatuses).includes(data.status)) errors.push('Status inválido.');
  if (!data.priority || !Object.keys(priorityLabels).includes(data.priority)) errors.push('Prioridade inválida.');
  return errors;
}
