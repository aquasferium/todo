import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { FiscalTasksProvider, useFiscalTasks } from './context/FiscalTasksContext';
import {
  RECURRENCE_OPTIONS,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TAX_REGIMES,
  type CreateFiscalTaskInput,
  type FiscalTask,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from './types';
import { formatDate, getTodayIso, isOverdue, isToday } from './utils/date';

const emptyForm: CreateFiscalTaskInput = {
  title: '',
  category: 'Apuração de Impostos',
  taxRegime: 'Simples Nacional',
  clientName: '',
  description: '',
  dueDate: getTodayIso(),
  priority: 'Média',
  recurrence: 'Mensal',
  status: 'Pendente',
};

function AppContent() {
  const { filteredTasks, isLoading, metrics, createTask, updateTask, deleteTask } = useFiscalTasks();
  const [form, setForm] = useState<CreateFiscalTaskInput>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTask(form);
    setForm({ ...emptyForm, dueDate: getTodayIso() });
    setIsFormOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_32rem),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28rem)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8">
        <Hero onToggleForm={() => setIsFormOpen((current) => !current)} />
        <Dashboard metrics={metrics} totalVisible={filteredTasks.length} />

        <section className={`grid gap-6 ${isFormOpen ? 'xl:grid-cols-[410px_minmax(0,1fr)]' : 'grid-cols-1'}`}>
          <TaskForm form={form} isOpen={isFormOpen} setForm={setForm} onSubmit={handleSubmit} />

          <div className="min-w-0 space-y-5">
            <Filters />
            {isLoading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-400">
                Carregando obrigações fiscais...
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onDelete={deleteTask} onUpdate={updateTask} />
                ))}
                {!filteredTasks.length && (
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
                    <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                    <h3 className="text-lg font-semibold">Nenhuma obrigação encontrada</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Ajuste os filtros ou cadastre uma nova rotina fiscal para manter o fluxo do escritório em dia.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Hero({ onToggleForm }: { onToggleForm: () => void }) {
  return (
    <header className="flex flex-col gap-5 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
          <ShieldCheck className="h-4 w-4" /> Escritório fiscal organizado e auditável
        </div>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          To-Do List para obrigações fiscais diárias
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
          Centralize escrituração, apurações, declarações e rotinas administrativas com prioridade, vencimento,
          recorrência e alertas visuais para atrasos.
        </p>
      </div>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-300"
        onClick={onToggleForm}
      >
        <Plus className="h-5 w-5" /> Nova obrigação
      </button>
    </header>
  );
}

function Dashboard({ metrics, totalVisible }: { metrics: ReturnType<typeof useFiscalTasks>['metrics']; totalVisible: number }) {
  const cards = [
    { label: 'Vencem hoje', value: metrics.totalDueToday, icon: CalendarClock, tone: 'text-cyan-200 bg-cyan-400/10 border-cyan-400/20' },
    { label: 'Concluídas', value: metrics.completed, icon: CheckCircle2, tone: 'text-emerald-200 bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Atrasadas', value: metrics.overdue, icon: AlertTriangle, tone: 'text-rose-200 bg-rose-400/10 border-rose-400/20' },
    { label: 'Em andamento', value: metrics.inProgress, icon: Clock3, tone: 'text-amber-200 bg-amber-400/10 border-amber-400/20' },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`rounded-3xl border p-5 ${card.tone}`}>
            <Icon className="mb-4 h-6 w-6" />
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm opacity-80">{card.label}</p>
          </div>
        );
      })}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-slate-200">
        <BarChart3 className="mb-4 h-6 w-6 text-slate-400" />
        <p className="text-3xl font-bold">{totalVisible}</p>
        <p className="mt-1 text-sm text-slate-400">Itens na visão filtrada</p>
      </div>
    </section>
  );
}

function TaskForm({
  form,
  isOpen,
  setForm,
  onSubmit,
}: {
  form: CreateFiscalTaskInput;
  isOpen: boolean;
  setForm: (form: CreateFiscalTaskInput) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!isOpen) return null;

  return (
    <form onSubmit={onSubmit} className="h-fit rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Cadastrar obrigação</h2>
          <p className="text-sm text-slate-400">Campos prontos para futura API fiscal.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Input label="Título da obrigação" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="Apuração de ICMS - Cliente X" required />
        <Input label="Cliente" value={form.clientName} onChange={(clientName) => setForm({ ...form, clientName })} placeholder="Cliente X" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Categoria" value={form.category} onChange={(category) => setForm({ ...form, category: category as TaskCategory })} options={TASK_CATEGORIES} />
          <Select label="Regime tributário" value={form.taxRegime} onChange={(taxRegime) => setForm({ ...form, taxRegime: taxRegime as CreateFiscalTaskInput['taxRegime'] })} options={TAX_REGIMES} />
          <Select label="Prioridade" value={form.priority} onChange={(priority) => setForm({ ...form, priority: priority as TaskPriority })} options={TASK_PRIORITIES} />
          <Select label="Recorrência" value={form.recurrence} onChange={(recurrence) => setForm({ ...form, recurrence: recurrence as CreateFiscalTaskInput['recurrence'] })} options={RECURRENCE_OPTIONS} />
          <Select label="Status" value={form.status} onChange={(status) => setForm({ ...form, status: status as TaskStatus })} options={TASK_STATUSES} />
          <Input label="Vencimento" type="date" value={form.dueDate} onChange={(dueDate) => setForm({ ...form, dueDate })} required />
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Descrição / passo a passo
          <textarea
            className="min-h-28 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Detalhe conferências, sistemas, documentos e responsáveis."
            required
          />
        </label>
        <button className="mt-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
          Salvar obrigação fiscal
        </button>
      </div>
    </form>
  );
}

function Filters() {
  const { filters, setFilters } = useFiscalTasks();

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-200">
        <Filter className="h-5 w-5 text-cyan-200" />
        <h2 className="font-semibold">Filtros avançados</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_150px]">
        <label className="grid gap-2 text-sm font-semibold text-slate-300">
          Busca
          <span className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 py-3 pl-10 pr-4 text-sm font-medium text-slate-100 shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-600 hover:border-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
              placeholder="Buscar por obrigação, cliente, regime..."
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            />
          </span>
        </label>
        <Select label="Categoria" value={filters.category} onChange={(category) => setFilters({ ...filters, category: category as typeof filters.category })} options={['Todas', ...TASK_CATEGORIES]} />
        <Select label="Status" value={filters.status} onChange={(status) => setFilters({ ...filters, status: status as typeof filters.status })} options={['Todos', ...TASK_STATUSES]} />
        <Select label="Prioridade" value={filters.priority} onChange={(priority) => setFilters({ ...filters, priority: priority as typeof filters.priority })} options={['Todas', ...TASK_PRIORITIES]} />
      </div>
    </section>
  );
}

function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: FiscalTask;
  onUpdate: (id: string, input: Partial<CreateFiscalTaskInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const overdue = task.status !== 'Concluído' && isOverdue(task.dueDate);
  const dueToday = task.status !== 'Concluído' && isToday(task.dueDate);
  const statusTone = task.status === 'Concluído' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : task.status === 'Em Andamento' ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-slate-600 bg-slate-800 text-slate-200';
  const priorityTone = task.priority === 'Alta' ? 'text-rose-200' : task.priority === 'Média' ? 'text-amber-200' : 'text-emerald-200';

  return (
    <article className={`rounded-[1.75rem] border p-5 shadow-lg shadow-slate-950/20 ${overdue ? 'border-rose-500/50 bg-rose-950/30' : dueToday ? 'border-cyan-400/40 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/75'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{task.category}</Badge>
            <Badge>{task.taxRegime}</Badge>
            <Badge>{task.recurrence}</Badge>
            {overdue && <Badge className="border-rose-400/40 bg-rose-400/10 text-rose-200">Atrasada</Badge>}
            {dueToday && <Badge className="border-cyan-400/40 bg-cyan-400/10 text-cyan-200">Vence hoje</Badge>}
          </div>
          <h3 className="text-xl font-semibold text-slate-50">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-400">Cliente: {task.clientName}</p>
          <p className="mt-3 leading-7 text-slate-300">{task.description}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm lg:w-56">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Vencimento</span>
            <strong>{formatDate(task.dueDate)}</strong>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Prioridade</span>
            <strong className={priorityTone}>{task.priority}</strong>
          </div>
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
            <Select
              value={task.status}
              onChange={(status) => onUpdate(task.id, { status: status as TaskStatus })}
              options={TASK_STATUSES}
              size="compact"
              className={statusTone}
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 px-3 py-2 text-rose-200 transition hover:bg-rose-400/10" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      </div>
    </article>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      <input
        className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  size?: 'default' | 'compact';
  className?: string;
}

function Select({ label, ...controlProps }: SelectProps) {
  if (!label) {
    return <SelectControl {...controlProps} />;
  }

  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-300">
      <span>{label}</span>
      <SelectControl {...controlProps} />
    </label>
  );
}

function SelectControl({
  value,
  onChange,
  options,
  size = 'default',
  className = '',
}: Omit<SelectProps, 'label'>) {
  const sizeClasses = size === 'compact' ? 'rounded-xl py-2 pl-3 pr-10' : 'rounded-2xl py-3 pl-4 pr-11';
  const stateClasses = 'hover:border-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10';
  const baseClasses = 'w-full appearance-none border border-slate-700/80 bg-slate-950/90 text-sm font-medium text-slate-100 shadow-inner shadow-black/20 outline-none transition';

  return (
    <div className="relative">
      <select
        className={[baseClasses, stateClasses, sizeClasses, className].filter(Boolean).join(' ')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option className="bg-slate-950 text-slate-100" key={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200/80" />
    </div>
  );
}

interface BadgeProps {
  children: string;
  className?: string;
}

function Badge({ children, className = 'border-slate-700 bg-slate-800 text-slate-300' }: BadgeProps) {
  const badgeClasses = ['rounded-full border px-3 py-1 text-xs font-medium', className].join(' ');

  return <span className={badgeClasses}>{children}</span>;
}

export default function App() {
  return (
    <FiscalTasksProvider>
      <AppContent />
    </FiscalTasksProvider>
  );
}
