# FiscalFlow To-Do

Aplicação single-page para organizar obrigações diárias e rotinas fiscais de um escritório contábil/fiscal.

## Escopo funcional

- Cadastro de obrigações com título, cliente, categoria, regime tributário, descrição/passo a passo, vencimento, prioridade, recorrência e status.
- Categorias fiscais: Escrituração, Apuração de Impostos, Envio de Declarações e Rotinas Administrativas.
- Priorização Alta/Média/Baixa e status Pendente/Em Andamento/Concluído.
- Alertas visuais para obrigações atrasadas e obrigações que vencem no dia.
- Filtros por busca textual, categoria, status e prioridade.
- Mini dashboard com vencimentos do dia, concluídas, atrasadas, em andamento e total filtrado.
- Persistência local em `localStorage`, sem dados mock/pré-carregados, com uma camada `fiscalTasksApi` assíncrona simulando contratos prontos para migração futura para Fetch/Axios.

## Arquitetura

```txt
src/
  App.tsx                         # composição da UI e componentes da SPA
  context/FiscalTasksContext.tsx   # estado global, métricas, filtros e ações
  services/fiscalTasksApi.ts       # gateway de persistência local/API futura
  types.ts                         # contratos fiscais e DTOs
  utils/date.ts                    # regras de vencimento e formatação
  styles.css                       # Tailwind CSS e estilos globais
```

## Stack

- React + TypeScript
- Tailwind CSS
- Lucide React
- Vite
- LocalStorage como armazenamento inicial

## Execução local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
