const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

export function isToday(isoDate: string): boolean {
  return isoDate === getTodayIso();
}

export function isOverdue(isoDate: string): boolean {
  return isoDate < getTodayIso();
}
