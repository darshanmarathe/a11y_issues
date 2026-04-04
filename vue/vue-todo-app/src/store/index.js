import { createStore } from 'vuex';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default createStore({
  state: {
    todos: [],
    projects: [],
    currentView: 'dashboard',
    sidebarOpen: true
  },
  
  mutations: {
    SET_TODOS(state, todos) {
      state.todos = todos;
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },
    UPDATE_TODO(state, updatedTodo) {
      const index = state.todos.findIndex(t => t.id === updatedTodo.id);
      if (index !== -1) {
        state.todos[index] = updatedTodo;
      }
    },
    DELETE_TODO(state, todoId) {
      state.todos = state.todos.filter(t => t.id !== todoId);
    },
    ADD_PROJECT(state, project) {
      state.projects.push(project);
    },
    UPDATE_PROJECT(state, updatedProject) {
      const index = state.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        state.projects[index] = updatedProject;
      }
    },
    DELETE_PROJECT(state, projectId) {
      state.projects = state.projects.filter(p => p.id !== projectId);
    },
    SET_CURRENT_VIEW(state, view) {
      state.currentView = view;
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen;
    }
  },
  
  actions: {
    async fetchTodos({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/todos`);
        commit('SET_TODOS', response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    
    async fetchProjects({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/projects`);
        commit('SET_PROJECTS', response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    
    async addTodo({ commit }, todo) {
      try {
        const response = await axios.post(`${API_URL}/todos`, todo);
        commit('ADD_TODO', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
      }
    },
    
    async updateTodo({ commit }, todo) {
      try {
        const response = await axios.put(`${API_URL}/todos/${todo.id}`, todo);
        commit('UPDATE_TODO', response.data);
      } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
      }
    },
    
    async deleteTodo({ commit }, todoId) {
      try {
        await axios.delete(`${API_URL}/todos/${todoId}`);
        commit('DELETE_TODO', todoId);
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
    },
    
    async addProject({ commit }, project) {
      try {
        const response = await axios.post(`${API_URL}/projects`, project);
        commit('ADD_PROJECT', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding project:', error);
        throw error;
      }
    },
    
    async updateProject({ commit }, project) {
      try {
        const response = await axios.put(`${API_URL}/projects/${project.id}`, project);
        commit('UPDATE_PROJECT', response.data);
      } catch (error) {
        console.error('Error updating project:', error);
        throw error;
      }
    },
    
    async deleteProject({ commit }, projectId) {
      try {
        await axios.delete(`${API_URL}/projects/${projectId}`);
        commit('DELETE_PROJECT', projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    }
  },
  
  getters: {
    getTodosByStatus: (state) => (status) => {
      return state.todos.filter(todo => todo.status === status);
    },
    getTodosByProject: (state) => (projectId) => {
      return state.todos.filter(todo => todo.projectId === projectId);
    },
    getTodosByPriority: (state) => (priority) => {
      return state.todos.filter(todo => todo.priority === priority);
    },
    getProjectById: (state) => (id) => {
      return state.projects.find(p => p.id === id);
    },
    getCompletedTodos: (state) => {
      return state.todos.filter(todo => todo.isCompleted);
    },
    getPendingTodos: (state) => {
      return state.todos.filter(todo => !todo.isCompleted);
    }
  }
});
