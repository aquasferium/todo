import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fiscalTasksApi } from '../services/fiscalTasksApi';
import type { CreateFiscalTaskInput, DashboardMetrics, FiscalTask, TaskFilters, UpdateFiscalTaskInput } from '../types';
import { isOverdue, isToday } from '../utils/date';

interface FiscalTasksContextValue {
  tasks: FiscalTask[];
  filteredTasks: FiscalTask[];
  filters: TaskFilters;
  metrics: DashboardMetrics;
  isLoading: boolean;
  setFilters: (filters: TaskFilters) => void;
  createTask: (input: CreateFiscalTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateFiscalTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const FiscalTasksContext = createContext<FiscalTasksContextValue | undefined>(undefined);

export function FiscalTasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<FiscalTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    category: 'Todas',
    status: 'Todos',
    priority: 'Todas',
    search: '',
  });

  useEffect(() => {
    fiscalTasksApi.list().then((storedTasks) => {
      setTasks(storedTasks);
      setIsLoading(false);
    });
  }, []);

  const createTask = useCallback(async (input: CreateFiscalTaskInput) => {
    const task = await fiscalTasksApi.create(input);
    setTasks((current) => [task, ...current]);
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateFiscalTaskInput) => {
    const updated = await fiscalTasksApi.update(id, input);
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await fiscalTasksApi.remove(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLocaleLowerCase('pt-BR');

    return tasks.filter((task) => {
      const matchesCategory = filters.category === 'Todas' || task.category === filters.category;
      const matchesStatus = filters.status === 'Todos' || task.status === filters.status;
      const matchesPriority = filters.priority === 'Todas' || task.priority === filters.priority;
      const matchesSearch =
        !normalizedSearch ||
        [task.title, task.clientName, task.description, task.taxRegime].some((field) =>
          field.toLocaleLowerCase('pt-BR').includes(normalizedSearch),
        );

      return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [filters, tasks]);

  const metrics = useMemo<DashboardMetrics>(() => {
    return tasks.reduce(
      (acc, task) => {
        if (isToday(task.dueDate)) acc.totalDueToday += 1;
        if (task.status === 'Concluído') acc.completed += 1;
        if (task.status === 'Em Andamento') acc.inProgress += 1;
        if (task.status !== 'Concluído' && isOverdue(task.dueDate)) acc.overdue += 1;
        return acc;
      },
      { totalDueToday: 0, completed: 0, overdue: 0, inProgress: 0 },
    );
  }, [tasks]);

  const value = useMemo(
    () => ({ tasks, filteredTasks, filters, metrics, isLoading, setFilters, createTask, updateTask, deleteTask }),
    [createTask, deleteTask, filteredTasks, filters, isLoading, metrics, tasks, updateTask],
  );

  return <FiscalTasksContext.Provider value={value}>{children}</FiscalTasksContext.Provider>;
}

export function useFiscalTasks() {
  const context = useContext(FiscalTasksContext);
  if (!context) throw new Error('useFiscalTasks deve ser usado dentro de FiscalTasksProvider.');
  return context;
}
