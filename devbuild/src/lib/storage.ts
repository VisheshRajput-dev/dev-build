export function loadLocalTask(taskId: string) {
  try {
    const raw = localStorage.getItem(`realdesk.task.${taskId}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}

export function saveLocalTask(taskId: string, files: Record<string, string>) {
  try {
    localStorage.setItem(`realdesk.task.${taskId}`, JSON.stringify(files));
  } catch {
    // ignore
  }
}


