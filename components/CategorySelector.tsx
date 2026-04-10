'use client';

import { CATEGORY_CONFIG } from '../lib/formFlow';
import FormStep from './FormStep';

interface CategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
  onNext: () => void;
  onBack?: () => void;
  progress?: { current: number; total: number };
}

export default function CategorySelector({
  selected,
  onChange,
  onNext,
  onBack,
  progress,
}: CategorySelectorProps) {
  const handleToggle = (category: string) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <FormStep
      title="Qual é a categoria do seu projeto?"
      description="Você pode selecionar uma ou mais opções que se aplicam ao seu projeto."
      progress={progress}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={selected.length === 0}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const isSelected = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleToggle(key)}
              className={`group relative rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? 'border-[#1654FF] bg-[#1654FF]/10'
                  : 'border-[#232329] bg-[#17171b] hover:border-[#3a3a46]'
              }`}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#1654FF] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <span className="text-2xl mb-2 block">{config.icon}</span>
              <p className="font-semibold text-white mb-1">{key}</p>
              <p className="text-xs text-[#9999a8] leading-relaxed">{config.description}</p>
            </button>
          );
        })}
      </div>
    </FormStep>
  );
}
