// Data models for the todo application

export const TODO_STATUS = {
  BACKLOG: 'Backlog',
  LINEDUP: 'Linedup',
  WIP: 'Wip',
  DONE: 'Done',
  STUCK: 'Stuck',
};

export const TODO_PRIORITY = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const STATUS_COLORS = {
  [TODO_STATUS.BACKLOG]: '#64748b',
  [TODO_STATUS.LINEDUP]: '#8b5cf6',
  [TODO_STATUS.WIP]: '#f59e0b',
  [TODO_STATUS.DONE]: '#22c55e',
  [TODO_STATUS.STUCK]: '#ef4444',
};

export const PRIORITY_COLORS = {
  [TODO_PRIORITY.URGENT]: '#ef4444',
  [TODO_PRIORITY.HIGH]: '#f59e0b',
  [TODO_PRIORITY.MEDIUM]: '#3b82f6',
  [TODO_PRIORITY.LOW]: '#64748b',
};

export const createTodoModel = (data = {}) => ({
  id: data.id || Date.now(),
  title: data.title || '',
  description: data.description || '',
  completionDate: data.completionDate || null,
  status: data.status || TODO_STATUS.BACKLOG,
  target_completion_date: data.target_completion_date || '',
  isCompleted: data.isCompleted || false,
  link: data.link || '',
  projects: data.projects || [],
  priority: data.priority || TODO_PRIORITY.MEDIUM,
  user: data.user || 'Admin',
});

export const createProjectModel = (data = {}) => ({
  id: data.id || Date.now(),
  name: data.name || '',
  description: data.description || '',
  isActive: data.isActive !== undefined ? data.isActive : true,
});

export const formatTodoForDisplay = (todo) => ({
  ...todo,
  statusLabel: todo.status,
  priorityLabel: todo.priority,
  formattedTargetDate: todo.target_completion_date
    ? new Date(todo.target_completion_date).toLocaleDateString()
    : 'Not set',
  formattedCompletionDate: todo.completionDate
    ? new Date(todo.completionDate).toLocaleDateString()
    : 'Not completed',
});

export const getTodosByStatus = (todos, status) =>
  todos.filter((todo) => todo.status === status);

export const getTodosByProject = (todos, projectId) =>
  todos.filter((todo) => todo.projects.includes(projectId));

export const getTodosByPriority = (todos, priority) =>
  todos.filter((todo) => todo.priority === priority);

export const getCompletedTodos = (todos) =>
  todos.filter((todo) => todo.isCompleted);

export const getActiveProjects = (projects) =>
  projects.filter((project) => project.isActive);
