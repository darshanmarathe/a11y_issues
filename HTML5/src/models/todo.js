/**
 * Todo Status Enum
 */
export const Status = {
  BACKLOG: 'Backlog',
  LINEDUP: 'LinedUp',
  WIP: 'Wip',
  DONE: 'Done',
  STUCK: 'Stuck'
};

/**
 * Priority Enum
 */
export const Priority = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string|null} completionDate
 * @property {string} status - Backlog/LinedUp/Wip/Done/Stuck
 * @property {string} targetCompletionDate
 * @property {boolean} isCompleted
 * @property {string} link
 * @property {string} projectId
 * @property {string} priority - Urgent/High/Medium/Low
 * @property {string} user
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Create a new Todo object
 * @param {Partial<Todo>} data
 * @returns {Todo}
 */
export function createTodo(data = {}) {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    completionDate: data.completionDate || null,
    status: data.status || Status.BACKLOG,
    targetCompletionDate: data.targetCompletionDate || '',
    isCompleted: data.isCompleted || false,
    link: data.link || '',
    projectId: data.projectId || '',
    priority: data.priority || Priority.MEDIUM,
    user: data.user || '',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

/**
 * Create a new Project object
 * @param {Partial<Project>} data
 * @returns {Project}
 */
export function createProject(data = {}) {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || '',
    description: data.description || '',
    createdAt: data.createdAt || now
  };
}
