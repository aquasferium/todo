export type TaskCategory =
  | 'Escrituração'
  | 'Apuração de Impostos'
  | 'Envio de Declarações'
  | 'Rotinas Administrativas';

export type TaxRegime = 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';

export type TaskStatus = 'Pendente' | 'Em Andamento' | 'Concluído';

export type TaskPriority = 'Alta' | 'Média' | 'Baixa';

export type Recurrence = 'Sem recorrência' | 'Diária' | 'Semanal' | 'Mensal';

export interface FiscalTask {
  id: string;
  title: string;
  category: TaskCategory;
  taxRegime: TaxRegime;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  recurrence: Recurrence;
  status: TaskStatus;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFiscalTaskInput = Omit<FiscalTask, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateFiscalTaskInput = Partial<CreateFiscalTaskInput>;

export interface DashboardMetrics {
  totalDueToday: number;
  completed: number;
  overdue: number;
  inProgress: number;
}

export interface TaskFilters {
  category: TaskCategory | 'Todas';
  status: TaskStatus | 'Todos';
  priority: TaskPriority | 'Todas';
  search: string;
}

export const TASK_CATEGORIES: TaskCategory[] = [
  'Escrituração',
  'Apuração de Impostos',
  'Envio de Declarações',
  'Rotinas Administrativas',
];

export const TAX_REGIMES: TaxRegime[] = ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'];

export const TASK_STATUSES: TaskStatus[] = ['Pendente', 'Em Andamento', 'Concluído'];

export const TASK_PRIORITIES: TaskPriority[] = ['Alta', 'Média', 'Baixa'];

export const RECURRENCE_OPTIONS: Recurrence[] = ['Sem recorrência', 'Diária', 'Semanal', 'Mensal'];
