'use client';

import FormStep from './FormStep';

interface ImpactSelectorProps {
  financialImpact?: string;
  timeImpact?: string;
  onFinancialChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  progress?: { current: number; total: number };
  step: 'financial' | 'time';
}

const financialOptions = [
  { value: 'LOW', label: 'Baixo', description: 'O projeto resolve uma necessidade pontual, sem grande impacto no faturamento ou nos custos da empresa.' },
  { value: 'MEDIUM', label: 'Médio', description: 'O projeto traz uma melhoria relevante, com economia de custo ou aumento de receita perceptível.' },
  { value: 'HIGH', label: 'Alto', description: 'O projeto tem potencial de transformar resultados: grande redução de custos, nova receita ou ganho estratégico significativo.' },
];

const timeOptions = [
  { value: 'SHORT', label: 'Curto', description: 'Menos de 3 meses. Projetos menores e bem definidos, com entrega rápida.' },
  { value: 'MEDIUM', label: 'Médio', description: 'Entre 3 e 6 meses. Projetos de porte médio que precisam de mais planejamento.' },
  { value: 'LONG', label: 'Longo', description: 'Mais de 6 meses. Projetos complexos ou de grande escala, com várias etapas.' },
];

export default function ImpactSelector({
  financialImpact,
  timeImpact,
  onFinancialChange,
  onTimeChange,
  onNext,
  onBack,
  progress,
  step,
}: ImpactSelectorProps) {
  const isFinalStep = step === 'time';
  const isFinancialStep = step === 'financial';

  const currentValue = isFinancialStep ? financialImpact : timeImpact;
  const onChange = isFinancialStep ? onFinancialChange : onTimeChange;
  const options = isFinancialStep ? financialOptions : timeOptions;
  const title = isFinancialStep
    ? 'Qual é o impacto financeiro esperado?'
    : 'Qual é o prazo esperado?';
  const description = isFinancialStep
    ? 'Selecione o nível de impacto financeiro do projeto.'
    : 'Selecione o tempo esperado para conclusão.';

  const buttonColorMap: Record<string, string> = {
    LOW: 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-500/20',
    MEDIUM: 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 data-[selected=true]:border-amber-500 data-[selected=true]:bg-amber-500/20',
    HIGH: 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 data-[selected=true]:border-rose-500 data-[selected=true]:bg-rose-500/20',
  };

  return (
    <FormStep
      title={title}
      description={description}
      progress={progress}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!currentValue}
      isLast={isFinalStep}
    >
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-selected={currentValue === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border-2 p-4 text-left transition-all ${buttonColorMap[option.value]}`}
          >
            <p className="font-semibold text-base mb-1">{option.label}</p>
            <p className="text-xs text-current/80 leading-relaxed">{option.description}</p>
          </button>
        ))}
      </div>
    </FormStep>
  );
}
