# /bugfix — Localiza e corrige bugs automaticamente

Você é um agente de revisão de código. Ao ser invocado, execute as etapas abaixo em sequência e aplique todas as correções encontradas diretamente nos arquivos.

## Etapa 1 — Leia os arquivos críticos do fluxo de envio

Leia os seguintes arquivos antes de qualquer análise:

- `components/TypeformFlow.tsx`
- `components/FormStep.tsx`
- `components/ImpactSelector.tsx`
- `components/DashboardShell.tsx`
- `pages/api/projects/public.ts`
- `lib/validators.ts`
- `lib/formFlow.ts`
- `prisma/schema.prisma`

## Etapa 2 — Verifique cada padrão de bug abaixo

Para cada padrão, verifique se o problema existe nos arquivos lidos. Se existir, corrija imediatamente.

---

### BUG-01 · Botão "Enviar" em etapa que não é a última

**Onde procurar:** qualquer `<FormStep>` que use `isLast={...}` com uma expressão dinâmica em um passo que NÃO seja o passo final de submissão (`handleSubmit`).

**Sintoma:** a prop `isLast` está vinculada a uma variável (ex: `isLastDynamic`) em vez de `false` em steps intermediários. O `FormStep` exibe o rótulo "Enviar" quando deveria exibir "Próximo", enganando o usuário.

**Correção:** force `isLast={false}` em qualquer passo cujo `onNext` NÃO seja `handleSubmit`.

---

### BUG-02 · Respostas condicionais obsoletas no payload

**Onde procurar:** `TypeformFlow.tsx` — handler de clique em opções de perguntas dinâmicas do tipo `select`.

**Sintoma:** ao mudar uma resposta que desativa uma pergunta condicional (ex: trocar "Sim" → "Não" numa pergunta de integração), a resposta da pergunta dependente continua em `formData.additionalAnswers` e é enviada no payload mesmo que o campo não seja mais exibido.

**Correção:** ao atualizar a resposta de uma pergunta `select`, percorra todas as `DynamicQuestion` da categoria e, para cada pergunta com `q.conditional === question.key`, limpe `formData.additionalAnswers[q.key]` se o novo valor não corresponder ao `q.conditionalValue`.

Exemplo de helper a adicionar (se não existir):

```ts
const clearConditionalAnswers = (
  triggerKey: string,
  triggerValue: string,
  currentAnswers: Record<string, string>
): Record<string, string> => {
  const cleaned = { ...currentAnswers };
  for (const q of allDynamicQuestions) {
    if (q.conditional === triggerKey && q.conditionalValue !== triggerValue) {
      delete cleaned[q.key];
    }
  }
  return cleaned;
};
```

---

### BUG-03 · Double-fetch em `onApply` do dashboard

**Onde procurar:** `DashboardShell.tsx` — prop `onApply` passada para `<ProjectFilters>`.

**Sintoma:** `onApply` chama `loadProjects()` explicitamente ao mesmo tempo que um `useEffect([query])` já dispara a mesma chamada quando `query` muda. Resultado: duas requisições simultâneas para a mesma API, com risco de race condition.

**Correção:** remova a chamada explícita a `loadProjects()` dentro de `onApply`. O `useEffect([query])` já garante o recarregamento.

---

### BUG-04 · `useEffect` sem dependência de `query`

**Onde procurar:** `DashboardShell.tsx` — `useEffect` que chama `loadProjects`.

**Sintoma:** o `useEffect` usa array de dependências vazio `[]`, fazendo com que os projetos nunca sejam recarregados quando filtros ou página mudam.

**Correção:** adicione `query` no array de dependências: `useEffect(() => { loadProjects(); }, [query])`.

---

### BUG-05 · Validação de `area` ausente no servidor

**Onde procurar:** `pages/api/projects/public.ts` e `lib/validators.ts` — função `validatePublicFormPayload`.

**Sintoma:** o campo `area` é obrigatório no formulário client-side, mas o servidor não valida sua presença em `additionalAnswers`. Caso alguém chame a API diretamente sem fornecer `area`, o projeto é criado sem a informação de área.

**Correção:** em `validatePublicFormPayload`, adicione verificação:

```ts
if (!data.additionalAnswers?.area || typeof data.additionalAnswers.area !== 'string') {
  errors.push('Área interessada é obrigatória.');
}
```

---

### BUG-06 · Ausência de tratamento quando nenhum usuário admin existe

**Onde procurar:** `pages/api/projects/public.ts` — linha com `prisma.user.findFirst()`.

**Sintoma:** se o banco de dados estiver vazio (nenhum admin criado), a API retorna HTTP 500 genérico. O usuário vê erro sem mensagem clara e a submissão falha silenciosamente.

**Correção:** a lógica já existe; verifique se o retorno está sendo tratado adequadamente no frontend (`TypeformFlow.tsx` — bloco `if (!response.ok)`). O erro `data.error` deve ser exibido ao usuário via `setError(data.error || 'Erro ao enviar projeto.')`.

---

### BUG-07 · Stale closure em `loadProjects` sem `useCallback`

**Onde procurar:** `DashboardShell.tsx` — função `loadProjects` definida dentro do componente.

**Sintoma:** `loadProjects` é redefinida em cada render e captura `query` pelo closure. Se usada em callbacks sem controle adequado, pode usar um valor desatualizado de `query`.

**Correção:** se `loadProjects` for chamada fora do `useEffect([query])` (ex: em `onApply`), remova essa chamada extra. O `useEffect` garante que a função sempre use o `query` mais recente ao disparar.

---

## Etapa 3 — Reporte o resultado

Ao final, apresente uma tabela com:

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| BUG-01 | Botão "Enviar" em etapa intermediária | TypeformFlow.tsx | ✅ Corrigido / ⚠️ Não encontrado |
| ... | ... | ... | ... |

Se algum bug não foi encontrado, indique "⚠️ Não encontrado" — o código já pode estar correto.

Se encontrou bugs adicionais não listados acima, descreva-os e corrija também.

Ao final, pergunte se o usuário deseja commitar as correções.
