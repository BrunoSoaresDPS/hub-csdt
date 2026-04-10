/**
 * Configuração de categorias, descrições e perguntas dinâmicas.
 * Define os metadados para cada categoria de projeto.
 */

export interface DynamicQuestion {
  key: string;
  text: string;
  description?: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  placeholder?: string;
  conditional?: string;
  conditionalValue?: string;
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
    description: 'Um robô de conversa que responde perguntas e atende usuários automaticamente. Ex: assistente no site, WhatsApp ou app interno da empresa.',
    complexityWeight: 1,
    dynamicQuestions: [
      {
        key: 'chatbot_languages',
        text: 'Qual(is) idioma(s) o chatbot precisará suportar?',
        description: 'Selecione os idiomas em que o assistente virtual precisará se comunicar com os usuários.',
        type: 'select',
        options: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Múltiplos idiomas'],
      },
      {
        key: 'chatbot_integrations',
        text: 'Necessita integração com sistemas ou bases de dados?',
        description: 'Informe se o chatbot precisará se conectar a outros sistemas da empresa para buscar ou registrar informações.',
        type: 'select',
        options: ['Sim', 'Não', 'Talvez'],
      },
      {
        key: 'chatbot_integrations_details',
        text: 'Qual sistema ou base de dados precisa integrar?',
        description: 'Descreva quais sistemas existentes na empresa o chatbot precisará acessar ou atualizar.',
        type: 'text',
        placeholder: 'Ex: CRM, banco de dados interno, API específica',
        conditional: 'chatbot_integrations',
        conditionalValue: 'Sim',
      },
      {
        key: 'chatbot_volume',
        text: 'Qual é o volume esperado de conversas por dia?',
        description: 'Estime a quantidade de interações diárias esperadas. Isso ajuda a dimensionar a capacidade do sistema.',
        type: 'text',
        placeholder: 'Ex: 100, 1000, 10000+',
      },
    ],
  },
  'Ferramentas de IA': {
    icon: '🤖',
    description: 'Sistemas que aprendem com dados para resolver problemas complexos. Ex: prever falhas em máquinas, detectar erros em produtos ou analisar grandes volumes de informação.',
    complexityWeight: 3,
    dynamicQuestions: [
      {
        key: 'ai_datasource',
        text: 'Necessita integração com sistemas ou bases de dados?',
        description: 'Informe se a solução precisará buscar ou processar dados de outros sistemas existentes na empresa.',
        type: 'select',
        options: ['Sim', 'Não', 'Talvez'],
      },
      {
        key: 'ai_datasource_details',
        text: 'Qual sistema ou base de dados precisa integrar?',
        description: 'Identifique as fontes de dados que a ferramenta de IA precisará acessar para funcionar corretamente.',
        type: 'text',
        placeholder: 'Ex: Data warehouse, banco de dados, APIs antigas',
        conditional: 'ai_datasource',
        conditionalValue: 'Sim',
      },
      {
        key: 'ai_training',
        text: 'Necessita treinar o modelo com dados próprios?',
        description: 'Alguns projetos de IA precisam aprender com dados específicos da empresa para ter resultados melhores. Informe se esse é o caso.',
        type: 'select',
        options: ['Sim', 'Não', 'Não sei ainda'],
      },
      {
        key: 'ai_usecase',
        text: 'Qual é o caso de uso principal?',
        description: 'Descreva o problema que a ferramenta de IA irá resolver. Quanto mais detalhes, melhor conseguimos avaliar a solução ideal.',
        type: 'text',
        placeholder: 'Ex: Classificação, Previsão, Processamento de linguagem',
      },
    ],
  },
  Dashboards: {
    icon: '📊',
    description: 'Telas com gráficos e indicadores que mostram o desempenho do negócio em tempo real. Ex: painel de vendas, metas do mês ou acompanhamento de produção.',
    complexityWeight: 1,
    dynamicQuestions: [
      {
        key: 'dashboard_datasize',
        text: 'Qual é o tamanho esperado dos dados?',
        description: 'Estime o volume total de dados que o painel precisará processar. Isso afeta a escolha da tecnologia e o custo do projeto.',
        type: 'select',
        options: ['Pequeno (< 1 GB)', 'Médio (1-100 GB)', 'Grande (> 100 GB)'],
      },
      {
        key: 'dashboard_frequency',
        text: 'Qual é a frequência de atualização esperada?',
        description: 'Com qual frequência os dados do painel precisam ser atualizados? Atualizações em tempo real exigem mais infraestrutura.',
        type: 'select',
        options: ['Tempo real', 'Hora', 'Diária', 'Semanal', 'Mensal'],
      },
      {
        key: 'dashboard_kpis',
        text: 'Quais são os KPIs ou métricas principais?',
        description: 'Liste os indicadores mais importantes que o painel deve exibir. Ex: faturamento, inadimplência, volume de pedidos.',
        type: 'text',
        placeholder: 'Ex: Receita, Churn, Satisfação do cliente',
      },
    ],
  },
  Automação: {
    icon: '⚙️',
    description: 'Substituir tarefas repetitivas feitas manualmente por processos automáticos. Ex: gerar relatórios, mover dados entre sistemas ou enviar notificações sem intervenção humana.',
    complexityWeight: 2,
    dynamicQuestions: [
      {
        key: 'automation_process',
        text: 'Qual é o processo que será automatizado?',
        description: 'Descreva como o processo funciona hoje, passo a passo. Quanto mais detalhes, mais fácil identificar onde a automação pode ajudar.',
        type: 'text',
        placeholder: 'Descreva brevemente o fluxo atual',
      },
      {
        key: 'automation_legacy',
        text: 'Há sistemas legados ou antigos envolvidos?',
        description: 'Informe se o processo depende de sistemas antigos ou não modernizados. Isso pode impactar na complexidade da automação.',
        type: 'select',
        options: ['Sim', 'Não', 'Parcialmente'],
      },
      {
        key: 'automation_savings',
        text: 'Qual é a economia em tempo esperada?',
        description: 'Estime quanto tempo a equipe gasta hoje realizando esse processo manualmente. Isso ajuda a calcular o retorno do projeto.',
        type: 'text',
        placeholder: 'Ex: 40 horas/mês, 20 horas por semana',
      },
    ],
  },
  'Plataforma e Programas': {
    icon: '🖥️',
    description: 'Criação de sistemas, aplicativos ou sites personalizados para a empresa. Ex: portal do cliente, ferramenta de gestão interna ou aplicativo para a equipe de campo.',
    complexityWeight: 3,
    dynamicQuestions: [
      {
        key: 'plataforma_tecnologias',
        text: 'Há preferência por tecnologias ou stack específicas?',
        description: 'Caso a empresa já utilize alguma tecnologia padrão ou haja restrições de TI, informe aqui. Se não souber, pode deixar em branco.',
        type: 'text',
        placeholder: 'Ex: React, Node.js, Python, etc.',
      },
      {
        key: 'plataforma_usuarios',
        text: 'Qual é o número de usuários esperado?',
        description: 'Estime quantas pessoas irão utilizar o sistema. Isso define a escala da infraestrutura necessária.',
        type: 'text',
        placeholder: 'Ex: 100, 10.000, 1.000.000+',
      },
      {
        key: 'plataforma_integracao',
        text: 'Necessita integração com sistemas ou bases de dados?',
        description: 'Informe se a plataforma precisará se comunicar com outros sistemas já existentes na empresa.',
        type: 'select',
        options: ['Sim', 'Não', 'Talvez'],
      },
      {
        key: 'plataforma_integracao_details',
        text: 'Qual sistema ou base de dados precisa integrar?',
        description: 'Liste os sistemas com os quais a plataforma precisará trocar informações. Ex: ERP, CRM, portais internos.',
        type: 'text',
        placeholder: 'Ex: SAP, CRM, banco de dados legado',
        conditional: 'plataforma_integracao',
        conditionalValue: 'Sim',
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
