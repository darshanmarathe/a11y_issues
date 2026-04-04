import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../types';
import { todoApi } from '../../services/api';

interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await todoApi.getAll();
  return response.data;
});

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await todoApi.create(todo);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todo }: { id: number; todo: Partial<Todo> }) => {
    const response = await todoApi.update(id, todo);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await todoApi.delete(id);
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      // Create todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setTodos } = todosSlice.actions;
export default todosSlice.reducer;
