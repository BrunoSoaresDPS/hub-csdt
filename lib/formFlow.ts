/**
 * Configuração de categorias, descrições e perguntas dinâmicas.
 * Define os metadados para cada categoria de projeto.
 */

export interface DynamicQuestion {
  key: string;
  text: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  placeholder?: string;
}

export interface CategoryConfig {
  icon: string;
  description: string;
  complexityWeight: number;
  dynamicQuestions: DynamicQuestion[];
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Chatbot: {
    icon: '💬',
    description: 'Assistentes virtuais inteligentes para interação com usuários',
    complexityWeight: 2,
    dynamicQuestions: [
      {
        key: 'chatbot_languages',
        text: 'Qual(is) idioma(s) o chatbot precisará suportar?',
        type: 'text',
        placeholder: 'Ex: Português, Inglês, Espanhol',
      },
      {
        key: 'chatbot_integrations',
        text: 'Necessita integração com sistemas existentes?',
        type: 'select',
        options: ['Sim', 'Não', 'Talvez'],
      },
      {
        key: 'chatbot_volume',
        text: 'Qual é o volume esperado de conversas por dia?',
        type: 'text',
        placeholder: 'Ex: 100, 1000, 10000+',
      },
    ],
  },
  'Ferramentas de IA': {
    icon: '🤖',
    description: 'Soluções baseadas em IA e Machine Learning para automação',
    complexityWeight: 3,
    dynamicQuestions: [
      {
        key: 'ai_datasource',
        text: 'Qual é a principal fonte de dados?',
        type: 'text',
        placeholder: 'Ex: Base de dados, API, arquivos CSV',
      },
      {
        key: 'ai_training',
        text: 'Necessita treinar o modelo com dados próprios?',
        type: 'select',
        options: ['Sim', 'Não', 'Não sei ainda'],
      },
      {
        key: 'ai_usecase',
        text: 'Qual é o caso de uso principal?',
        type: 'text',
        placeholder: 'Ex: Classificação, Previsão, Processamento de linguagem',
      },
    ],
  },
  Dashboards: {
    icon: '📊',
    description: 'Painéis de visualização de dados em tempo real',
    complexityWeight: 2,
    dynamicQuestions: [
      {
        key: 'dashboard_datasize',
        text: 'Qual é o tamanho esperado dos dados?',
        type: 'select',
        options: ['Pequeno (< 1 GB)', 'Médio (1-100 GB)', 'Grande (> 100 GB)'],
      },
      {
        key: 'dashboard_frequency',
        text: 'Qual é a frequência de atualização esperada?',
        type: 'select',
        options: ['Tempo real', 'Hora', 'Diária', 'Semanal', 'Mensal'],
      },
      {
        key: 'dashboard_kpis',
        text: 'Quais são os KPIs ou métricas principais?',
        type: 'text',
        placeholder: 'Ex: Receita, Churn, Satisfação do cliente',
      },
    ],
  },
  Automação: {
    icon: '⚙️',
    description: 'Processos automatizados para reduzir trabalho manual',
    complexityWeight: 2,
    dynamicQuestions: [
      {
        key: 'automation_process',
        text: 'Qual é o processo que será automatizado?',
        type: 'text',
        placeholder: 'Descreva brevemente o fluxo atual',
      },
      {
        key: 'automation_legacy',
        text: 'Há sistemas legados ou antigos envolvidos?',
        type: 'select',
        options: ['Sim', 'Não', 'Parcialmente'],
      },
      {
        key: 'automation_savings',
        text: 'Qual é a economia esperada (tempo ou custo)?',
        type: 'text',
        placeholder: 'Ex: 40 horas/mês, 50% de redução de custo',
      },
    ],
  },
  'Plataforma e Programas': {
    icon: '🖥️',
    description: 'Plataformas web, mobile ou software customizado',
    complexityWeight: 3,
    dynamicQuestions: [
      {
        key: 'plataforma_tecnologias',
        text: 'Há preferência por tecnologias ou stack específicas?',
        type: 'text',
        placeholder: 'Ex: React, Node.js, Python, etc.',
      },
      {
        key: 'plataforma_usuarios',
        text: 'Qual é o número de usuários esperado?',
        type: 'text',
        placeholder: 'Ex: 100, 10.000, 1.000.000+',
      },
      {
        key: 'plataforma_integracao',
        text: 'Necessita integrar com sistemas externos?',
        type: 'select',
        options: ['Sim', 'Não', 'Talvez'],
      },
    ],
  },
  'Solução Completa': {
    icon: '🚀',
    description: 'Projeto completo abrangendo múltiplas competências',
    complexityWeight: 3,
    dynamicQuestions: [
      {
        key: 'solucao_escopo',
        text: 'Qual é o escopo principal do projeto?',
        type: 'text',
        placeholder: 'Descreva os componentes principais',
      },
      {
        key: 'solucao_timing',
        text: 'Qual é a data de go-live esperada?',
        type: 'text',
        placeholder: 'Ex: Dezembro 2024, Q1 2025',
      },
      {
        key: 'solucao_stakeholders',
        text: 'Quantas áreas/stakeholders estão envolvidas?',
        type: 'text',
        placeholder: 'Ex: TI, RH, Financeiro, etc.',
      },
    ],
  },
};

/**
 * Retorna todas as perguntas dinâmicas das categorias selecionadas.
 * Remove duplicatas por key, mantém ordem de aparição.
 */
export function getDynamicQuestions(selectedCategories: string[]): DynamicQuestion[] {
  const questionMap = new Map<string, DynamicQuestion>();

  for (const category of selectedCategories) {
    const config = CATEGORY_CONFIG[category];
    if (config) {
      for (const question of config.dynamicQuestions) {
        if (!questionMap.has(question.key)) {
          questionMap.set(question.key, question);
        }
      }
    }
  }

  return Array.from(questionMap.values());
}

/**
 * Calcula a complexidade baseada na categoria MAIS complexa selecionada.
 * Usa complexityWeight para essa decisão.
 */
export function assessComplexityForCategories(categories: string[]): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (!categories.length) return 'MEDIUM';

  const maxWeight = Math.max(
    ...categories.map((cat) => CATEGORY_CONFIG[cat]?.complexityWeight ?? 1)
  );

  // Mapeamento de peso para complexidade
  // Weight 1 = LOW, Weight 2 = MEDIUM, Weight 3 = HIGH
  if (maxWeight >= 3) return 'HIGH';
  if (maxWeight >= 2) return 'MEDIUM';
  return 'LOW';
}
