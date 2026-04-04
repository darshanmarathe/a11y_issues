export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color?: string;
  created_at: string;
}

export type Status = 'Backlog' | 'Linedup' | 'Wip' | 'Done' | 'Stuck';
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completion_date?: string;
  status: Status;
  target_completion_date?: string;
  isCompleted: boolean;
  link?: string;
  project_id?: number;
  priority: Priority;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface AppState {
  todos: Todo[];
  projects: Project[];
  users: User[];
}
