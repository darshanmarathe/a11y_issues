import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { fetchTodos, createTodo, updateTodo, deleteTodo } from '../../features/todos/todosSlice';
import projectsReducer, { fetchProjects, createProject, updateProject, deleteProject } from '../../features/projects/projectsSlice';
import usersReducer, { fetchUsers, createUser, updateUser, deleteUser } from '../../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    projects: projectsReducer,
    users: usersReducer,
  },
});

// Re-export thunks for use in components
export { fetchTodos, createTodo, updateTodo, deleteTodo };
export { fetchProjects, createProject, updateProject, deleteProject };
export { fetchUsers, createUser, updateUser, deleteUser };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
