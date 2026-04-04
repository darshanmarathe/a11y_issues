import axios from 'axios';
import type { Todo, Project, User } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  getAll: () => api.get<Todo[]>('/todos'),
  getById: (id: number) => api.get<Todo>(`/todos/${id}`),
  create: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => api.post<Todo>('/todos', todo),
  update: (id: number, todo: Partial<Todo>) => api.patch<Todo>(`/todos/${id}`, todo),
  delete: (id: number) => api.delete(`/todos/${id}`),
};

export const projectApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (project: Omit<Project, 'id' | 'created_at'>) => api.post<Project>('/projects', project),
  update: (id: number, project: Partial<Project>) => api.patch<Project>(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
  update: (id: number, user: Partial<User>) => api.patch<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};
