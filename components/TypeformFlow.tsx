'use client';

import { useState } from 'react';
import FormStep from './FormStep';
import CategorySelector from './CategorySelector';
import ImpactSelector from './ImpactSelector';
import { getDynamicQuestions } from '../lib/formFlow';

interface FormData {
  categories: string[];
  impactFinancial?: string;
  impactTime?: string;
  title: string;
  description: string;
  owner: string;
  additionalAnswers: Record<string, string>;
}

type StepType = 'categories' | 'financial' | 'time' | 'title' | 'description' | 'owner' | 'dynamic' | 'review' | 'success';

interface TypeformFlowProps {
  onSuccess?: () => void;
}

export default function TypeformFlow({ onSuccess }: TypeformFlowProps) {
  const [currentStep, setCurrentStep] = useState<StepType>('categories');
  const [formData, setFormData] = useState<FormData>({
    categories: [],
    title: '',
    description: '',
    owner: '',
    additionalAnswers: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dynamicQuestionIndex, setDynamicQuestionIndex] = useState(0);
  const [stepHistory, setStepHistory] = useState<StepType[]>(['categories']);

  const dynamicQuestions = getDynamicQuestions(formData.categories).filter(q => {
    if (q.conditional) {
      return formData.additionalAnswers[q.conditional] === q.conditionalValue;
    }
    return true;
  });

  const totalSteps = 7 + dynamicQuestions.length;

  const getStepNumber = (): number => {
    const stepOrder: StepType[] = ['categories', 'financial', 'time', 'title', 'description', 'owner', ...dynamicQuestions.map((_, i) => `dynamic_${i}` as any), 'review'];
    return stepOrder.indexOf(currentStep) + 1;
  };

  const handleCategoriesNext = () => {
    if (formData.categories.length > 0) {
      setStepHistory([...stepHistory, 'financial']);
      setCurrentStep('financial');
      setDynamicQuestionIndex(0);
    }
  };

  const handleFinancialNext = () => {
    setStepHistory([...stepHistory, 'time']);
    setCurrentStep('time');
  };

  const handleTimeNext = () => {
    setStepHistory([...stepHistory, 'title']);
    setCurrentStep('title');
  };

  const handleTitleNext = () => {
    if (formData.title.trim()) {
      setStepHistory([...stepHistory, 'description']);
      setCurrentStep('description');
    }
  };

  const handleDescriptionNext = () => {
    if (formData.description.trim()) {
      setStepHistory([...stepHistory, 'owner']);
      setCurrentStep('owner');
    }
  };

  const handleOwnerNext = () => {
    if (formData.owner.trim()) {
      if (dynamicQuestions.length > 0) {
        setStepHistory([...stepHistory, 'dynamic']);
        setCurrentStep('dynamic');
        setDynamicQuestionIndex(0);
      } else {
        setStepHistory([...stepHistory, 'review']);
        setCurrentStep('review');
      }
    }
  };

  const handleDynamicQuestionNext = () => {
    if (dynamicQuestionIndex < dynamicQuestions.length - 1) {
      setDynamicQuestionIndex(dynamicQuestionIndex + 1);
    } else {
      setStepHistory([...stepHistory, 'review']);
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'dynamic' && dynamicQuestionIndex > 0) {
      setDynamicQuestionIndex(dynamicQuestionIndex - 1);
      return;
    }

    if (stepHistory.length > 1) {
      const newHistory = stepHistory.slice(0, -1);
      const previousStep = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      setCurrentStep(previousStep);
      if (previousStep === 'dynamic') {
        setDynamicQuestionIndex(dynamicQuestions.length - 1);
      }
    }
  };

  const handleEditStep = (step: StepType) => {
    setCurrentStep(step);
    const newHistory = stepHistory.slice(0, stepHistory.indexOf(step) + 1);
    setStepHistory(newHistory);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/projects/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar projeto.');
        setLoading(false);
        return;
      }

      setCurrentStep('success');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  const progress = { current: getStepNumber(), total: totalSteps };

  // Renderizar steps
  if (currentStep === 'categories') {
    return (
      <CategorySelector
        selected={formData.categories}
        onChange={(categories) => setFormData({ ...formData, categories })}
        onNext={handleCategoriesNext}
        progress={progress}
      />
    );
  }

  if (currentStep === 'financial') {
    return (
      <ImpactSelector
        step="financial"
        financialImpact={formData.impactFinancial}
        timeImpact={formData.impactTime}
        onFinancialChange={(value) => setFormData({ ...formData, impactFinancial: value })}
        onTimeChange={(value) => setFormData({ ...formData, impactTime: value })}
        onNext={handleFinancialNext}
        onBack={handleBack}
        progress={progress}
      />
    );
  }

  if (currentStep === 'time') {
    return (
      <ImpactSelector
        step="time"
        financialImpact={formData.impactFinancial}
        timeImpact={formData.impactTime}
        onFinancialChange={(value) => setFormData({ ...formData, impactFinancial: value })}
        onTimeChange={(value) => setFormData({ ...formData, impactTime: value })}
        onNext={handleTimeNext}
        onBack={handleBack}
        progress={progress}
      />
    );
  }

  if (currentStep === 'title') {
    return (
      <FormStep
        title="Qual é o nome do projeto?"
        description="Use um título claro e descritivo."
        progress={progress}
        onNext={handleTitleNext}
        onBack={handleBack}
        nextDisabled={!formData.title.trim()}
      >
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Expansão de frota Sul"
          className="iveco-input text-lg py-3"
          autoFocus
        />
      </FormStep>
    );
  }

  if (currentStep === 'description') {
    return (
      <FormStep
        title="Descreva o projeto em detalhes."
        description="Inclua objetivos, escopo e entregas esperadas."
        progress={progress}
        onNext={handleDescriptionNext}
        onBack={handleBack}
        nextDisabled={!formData.description.trim()}
      >
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Objetivos, escopo, entregas esperadas..."
          className="iveco-input resize-none py-3"
          rows={5}
          autoFocus
        />
      </FormStep>
    );
  }

  if (currentStep === 'owner') {
    return (
      <FormStep
        title="Quem é o responsável?"
        description="O nome da pessoa que liderará este projeto."
        progress={progress}
        onNext={handleOwnerNext}
        onBack={handleBack}
        nextDisabled={!formData.owner.trim()}
      >
        <input
          type="text"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          placeholder="Nome do responsável"
          className="iveco-input text-lg py-3"
          autoFocus
        />
      </FormStep>
    );
  }

  if (currentStep === 'dynamic' && dynamicQuestions.length > 0) {
    const question = dynamicQuestions[dynamicQuestionIndex];
    const isLastDynamic = dynamicQuestionIndex === dynamicQuestions.length - 1;

    return (
      <FormStep
        title={question.text}
        description={question.description}
        progress={progress}
        onNext={handleDynamicQuestionNext}
        onBack={handleBack}
        nextDisabled={!formData.additionalAnswers[question.key]}
        isLast={isLastDynamic}
      >
        {question.type === 'text' && (
          <input
            type="text"
            value={formData.additionalAnswers[question.key] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                additionalAnswers: { ...formData.additionalAnswers, [question.key]: e.target.value },
              })
            }
            placeholder={question.placeholder || 'Sua resposta...'}
            className="iveco-input text-lg py-3"
            autoFocus
          />
        )}

        {question.type === 'select' && question.options && (
          <div className="grid gap-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    additionalAnswers: { ...formData.additionalAnswers, [question.key]: option },
                  })
                }
                className={`py-3 px-4 rounded-lg border text-left font-medium transition-all ${
                  formData.additionalAnswers[question.key] === option
                    ? 'border-[#1654FF] bg-[#1654FF]/10 text-white'
                    : 'border-[#232329] bg-[#17171b] text-[#9999a8] hover:border-[#3a3a46]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </FormStep>
    );
  }

  if (currentStep === 'review') {
    return (
      <FormStep
        title="Revise seu projeto"
        description="Verifique se todos os dados estão corretos antes de enviar."
        progress={progress}
        onNext={handleSubmit}
        onBack={handleBack}
        nextDisabled={loading}
        isLast
      >
        <div className="space-y-4 mb-6">
          <div className="iveco-card p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="iveco-label mb-1">Categorias</p>
                <p className="text-white font-medium">{formData.categories.join(', ')}</p>
              </div>
              <button
                onClick={() => handleEditStep('categories')}
                className="text-xs text-[#7B9FFF] hover:text-white transition-colors"
              >
                Editar
              </button>
            </div>
          </div>

          {formData.impactFinancial && (
            <div className="iveco-card p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="iveco-label mb-1">Impacto Financeiro</p>
                  <p className="text-white font-medium">
                    {{ LOW: 'Baixo', MEDIUM: 'Médio', HIGH: 'Alto' }[formData.impactFinancial]}
                  </p>
                </div>
                <button
                  onClick={() => handleEditStep('financial')}
                  className="text-xs text-[#7B9FFF] hover:text-white transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          )}

          {formData.impactTime && (
            <div className="iveco-card p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="iveco-label mb-1">Prazo</p>
                  <p className="text-white font-medium">
                    {{ SHORT: 'Curto (< 3 meses)', MEDIUM: 'Médio (3-6 meses)', LONG: 'Longo (> 6 meses)' }[formData.impactTime]}
                  </p>
                </div>
                <button
                  onClick={() => handleEditStep('time')}
                  className="text-xs text-[#7B9FFF] hover:text-white transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          )}

          <div className="iveco-card p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="iveco-label mb-1">Projeto</p>
                <p className="text-white font-medium">{formData.title}</p>
              </div>
              <button
                onClick={() => handleEditStep('title')}
                className="text-xs text-[#7B9FFF] hover:text-white transition-colors"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="iveco-card p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="iveco-label mb-1">Descrição</p>
                <p className="text-white text-sm leading-relaxed">{formData.description}</p>
              </div>
              <button
                onClick={() => handleEditStep('description')}
                className="text-xs text-[#7B9FFF] hover:text-white transition-colors flex-shrink-0"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="iveco-card p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="iveco-label mb-1">Responsável</p>
                <p className="text-white font-medium">{formData.owner}</p>
              </div>
              <button
                onClick={() => handleEditStep('owner')}
                className="text-xs text-[#7B9FFF] hover:text-white transition-colors"
              >
                Editar
              </button>
            </div>
          </div>

          {Object.keys(formData.additionalAnswers).length > 0 && (
            <div className="iveco-card p-4">
              <p className="iveco-label mb-3">Informações Adicionais</p>
              <ul className="space-y-2">
                {Object.entries(formData.additionalAnswers).map(([key, value]) => (
                  <li key={key} className="text-sm text-[#d4d4d8]">
                    <span className="text-white font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 mb-4">
            {error}
          </div>
        )}
      </FormStep>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-[#080808] via-[#0f0f11] to-[#080808] px-6 py-12 animate-fade-in">
        <div className="text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg className="h-8 w-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-3">Projeto enviado com sucesso!</h1>
          <p className="text-lg text-[#d4d4d8] mb-8">
            Obrigado por submeter seu projeto. Nossa equipe analisará todos os detalhes e entrará em contato em breve para os próximos passos.
          </p>

          <button
            onClick={() => {
              setCurrentStep('categories');
              setFormData({
                categories: [],
                title: '',
                description: '',
                owner: '',
                additionalAnswers: {},
              });
              setDynamicQuestionIndex(0);
              setStepHistory(['categories']);
            }}
            className="iveco-btn-primary py-3 px-8"
          >
            Submeter outro projeto
          </button>
        </div>
      </div>
    );
  }

  return null;
}
