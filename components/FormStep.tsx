'use client';

interface FormStepProps {
  title: string;
  description?: string;
  progress?: { current: number; total: number };
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  children: React.ReactNode;
  isLast?: boolean;
}

export default function FormStep({
  title,
  description,
  progress,
  onNext,
  onBack,
  nextDisabled = false,
  children,
  isLast = false,
}: FormStepProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-[#080808] via-[#0f0f11] to-[#080808] animate-fade-in">
      {/* Progress bar */}
      {progress && (
        <div className="h-1 bg-[#17171b]">
          <div
            className="h-full bg-[#1654FF] transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Step info */}
          <div className="mb-8 text-center">
            {progress && (
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#555562] mb-2">
                Passo {progress.current} de {progress.total}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-base text-[#9999a8] leading-relaxed max-w-xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="mb-10">{children}</div>

          {/* Navigation buttons */}
          <div className="flex gap-3 justify-center sm:justify-end">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="iveco-btn-ghost py-2.5 px-6"
              >
                Anterior
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className="iveco-btn-primary py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLast ? 'Enviar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
