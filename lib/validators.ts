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

export const impactFinancialLabels = {
  LOW: 'Baixo',
  MEDIUM: 'Médio',
  HIGH: 'Alto',
} as const;

export const impactTimeLabels = {
  SHORT: 'Curto (< 3 meses)',
  MEDIUM: 'Médio (3-6 meses)',
  LONG: 'Longo (> 6 meses)',
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

export function validatePublicFormPayload(data: any) {
  const errors: string[] = [];

  // Validação de categorias
  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    errors.push('Selecione pelo menos uma categoria.');
  }

  // Validação de campos básicos
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Título do projeto é obrigatório.');
  }
  if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
    errors.push('Descrição é obrigatória.');
  }
  if (!data.owner || typeof data.owner !== 'string' || !data.owner.trim()) {
    errors.push('Responsável é obrigatório.');
  }

  // Validação de impactos (opcionais, mas se fornecidos devem ser válidos)
  const validImpactFinancial = ['LOW', 'MEDIUM', 'HIGH'];
  const validImpactTime = ['SHORT', 'MEDIUM', 'LONG'];

  if (data.impactFinancial && !validImpactFinancial.includes(data.impactFinancial)) {
    errors.push('Impacto financeiro inválido.');
  }
  if (data.impactTime && !validImpactTime.includes(data.impactTime)) {
    errors.push('Impacto temporal inválido.');
  }

  return errors;
}
