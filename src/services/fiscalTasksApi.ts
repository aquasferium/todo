import type { CreateFiscalTaskInput, FiscalTask, UpdateFiscalTaskInput } from '../types';

const STORAGE_KEY = 'fiscal-flow-tasks-v1';
const SIMULATED_LATENCY_MS = 120;

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, SIMULATED_LATENCY_MS));
}

function readStorage(): FiscalTask[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const tasks = JSON.parse(raw) as FiscalTask[];
    const userTasks = tasks.filter((task) => !task.id.startsWith('seed-'));

    if (userTasks.length !== tasks.length) {
      writeStorage(userTasks);
    }

    return userTasks;
    return JSON.parse(raw) as FiscalTask[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeStorage(tasks: FiscalTask[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const fiscalTasksApi = {
  async list(): Promise<FiscalTask[]> {
    await wait();
    return readStorage();
  },

  async create(input: CreateFiscalTaskInput): Promise<FiscalTask> {
    await wait();
    const now = new Date().toISOString();
    const task: FiscalTask = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    writeStorage([task, ...readStorage()]);
    return task;
  },

  async update(id: string, input: UpdateFiscalTaskInput): Promise<FiscalTask> {
    await wait();
    const tasks = readStorage();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...input, updatedAt: new Date().toISOString() } : task,
    );
    writeStorage(updatedTasks);
    const updated = updatedTasks.find((task) => task.id === id);
    if (!updated) throw new Error('Obrigação fiscal não encontrada.');
    return updated;
  },

  async remove(id: string): Promise<void> {
    await wait();
    writeStorage(readStorage().filter((task) => task.id !== id));
  },
};
