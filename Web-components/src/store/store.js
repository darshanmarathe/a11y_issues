import { createStore } from 'zustand/vanilla';

const API_BASE = 'http://localhost:3001';

export const store = createStore((set, get) => ({
  // State
  todos: [],
  projects: [],
  currentTodo: null,
  loading: false,
  error: null,

  // Todo actions
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/todos`);
      const data = await response.json();
      set({ todos: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createTodo: async (todo) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      const data = await response.json();
      set((state) => ({
        todos: [...state.todos, data],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTodo: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, ...data } : todo
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTodo: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setCurrentTodo: (todo) => {
    set({ currentTodo: todo });
  },

  // Project actions
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      set({ projects: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createProject: async (project) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const data = await response.json();
      set((state) => ({
        projects: [...state.projects, data],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...data } : project
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
