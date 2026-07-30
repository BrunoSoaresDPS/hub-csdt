export const projectStatuses = {
  REVIEW: 'Em análise',
  VALIDATION: 'Em validação',
  APPROVED: 'Aprovado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  OUT_OF_SCOPE: 'Fora de escopo',
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

export const FIELD_LIMITS = {
  title: 200,
  description: 5000,
  owner: 120,
  changeLog: 500,
} as const;

export function sanitizeInput(value: unknown, maxLength = 5000) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>"'`]/g, '').slice(0, maxLength).trim();
}

export function isValidStatus(value: unknown): value is keyof typeof projectStatuses {
  return typeof value === 'string' && value in projectStatuses;
}

export function isValidPriority(value: unknown): value is keyof typeof priorityLabels {
  return typeof value === 'string' && value in priorityLabels;
}

export function isValidComplexity(value: unknown): value is keyof typeof complexityLabels {
  return typeof value === 'string' && value in complexityLabels;
}

export function isValidImpactFinancial(value: unknown): value is keyof typeof impactFinancialLabels {
  return typeof value === 'string' && value in impactFinancialLabels;
}

export function isValidImpactTime(value: unknown): value is keyof typeof impactTimeLabels {
  return typeof value === 'string' && value in impactTimeLabels;
}

function checkTextField(value: unknown, label: string, maxLength: number, errors: string[], required = true) {
  if (value === undefined || value === null || value === '') {
    if (required) errors.push(`${label} é obrigatório.`);
    return;
  }
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${label} é obrigatório.`);
    return;
  }
  if (value.length > maxLength) {
    errors.push(`${label} deve ter no máximo ${maxLength} caracteres.`);
  }
}

export function validateProjectPayload(data: any) {
  const errors: string[] = [];
  checkTextField(data.title, 'Título do projeto', FIELD_LIMITS.title, errors);
  checkTextField(data.description, 'Descrição', FIELD_LIMITS.description, errors);
  checkTextField(data.owner, 'Responsável', FIELD_LIMITS.owner, errors);
  if (!data.startDate || typeof data.startDate !== 'string' || isNaN(Date.parse(data.startDate))) errors.push('Data de início inválida.');
  if (!data.endDate || typeof data.endDate !== 'string' || isNaN(Date.parse(data.endDate))) errors.push('Data prevista inválida.');
  if (!isValidStatus(data.status)) errors.push('Status inválido.');
  if (!isValidPriority(data.priority)) errors.push('Prioridade inválida.');
  return errors;
}

// Valida atualizações parciais: campos ausentes são mantidos, mas os
// presentes precisam ser válidos (um enum errado derrubaria o Prisma com 500).
export function validateProjectUpdatePayload(data: any) {
  const errors: string[] = [];
  checkTextField(data.title, 'Título do projeto', FIELD_LIMITS.title, errors, false);
  checkTextField(data.description, 'Descrição', FIELD_LIMITS.description, errors, false);
  checkTextField(data.owner, 'Responsável', FIELD_LIMITS.owner, errors, false);
  checkTextField(data.changeLog, 'Mensagem de alteração', FIELD_LIMITS.changeLog, errors, false);
  if (data.status !== undefined && !isValidStatus(data.status)) errors.push('Status inválido.');
  if (data.priority !== undefined && !isValidPriority(data.priority)) errors.push('Prioridade inválida.');
  if (data.startDate !== undefined && (typeof data.startDate !== 'string' || isNaN(Date.parse(data.startDate)))) errors.push('Data de início inválida.');
  if (data.endDate !== undefined && (typeof data.endDate !== 'string' || isNaN(Date.parse(data.endDate)))) errors.push('Data prevista inválida.');
  return errors;
}

const MAX_ADDITIONAL_ANSWERS = 30;
const MAX_ANSWER_KEY_LENGTH = 64;
const MAX_ANSWER_VALUE_LENGTH = 1000;

export function validatePublicFormPayload(data: any, allowedCategories?: string[]) {
  const errors: string[] = [];

  // Validação de categorias
  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    errors.push('Selecione pelo menos uma categoria.');
  } else if (data.categories.some((c: unknown) => typeof c !== 'string')) {
    errors.push('Categorias inválidas.');
  } else if (allowedCategories && data.categories.some((c: string) => !allowedCategories.includes(c))) {
    errors.push('Categoria não reconhecida.');
  }

  // Validação de campos básicos
  checkTextField(data.title, 'Título do projeto', FIELD_LIMITS.title, errors);
  checkTextField(data.description, 'Descrição', FIELD_LIMITS.description, errors);
  checkTextField(data.owner, 'Responsável', FIELD_LIMITS.owner, errors);

  // Validação de área (obrigatória)
  if (!data.additionalAnswers?.area || typeof data.additionalAnswers.area !== 'string' || !data.additionalAnswers.area.trim()) {
    errors.push('Área interessada é obrigatória.');
  }

  // Respostas adicionais: objeto plano com valores string de tamanho limitado
  if (data.additionalAnswers !== undefined && data.additionalAnswers !== null) {
    const answers = data.additionalAnswers;
    if (typeof answers !== 'object' || Array.isArray(answers)) {
      errors.push('Respostas adicionais inválidas.');
    } else {
      const entries = Object.entries(answers);
      if (entries.length > MAX_ADDITIONAL_ANSWERS) {
        errors.push('Número de respostas adicionais excede o limite.');
      } else if (
        entries.some(
          ([key, value]) =>
            key.length > MAX_ANSWER_KEY_LENGTH ||
            typeof value !== 'string' ||
            value.length > MAX_ANSWER_VALUE_LENGTH
        )
      ) {
        errors.push('Respostas adicionais contêm valores inválidos.');
      }
    }
  }

  // Validação de impactos (opcionais, mas se fornecidos devem ser válidos)
  if (data.impactFinancial && !isValidImpactFinancial(data.impactFinancial)) {
    errors.push('Impacto financeiro inválido.');
  }
  if (data.impactTime && !isValidImpactTime(data.impactTime)) {
    errors.push('Impacto temporal inválido.');
  }

  return errors;
}
