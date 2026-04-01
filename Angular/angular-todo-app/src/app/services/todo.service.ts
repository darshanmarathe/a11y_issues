import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = '/api/todos';
  private todosSignal = signal<Todo[]>([]);
  readonly todos = computed(() => this.todosSignal());

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  loadTodos(): void {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todosSignal.set(data),
      error: (error) => console.error('Error loading todos:', error)
    });
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } = {
      ...todo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.http.post<Todo>(this.apiUrl, newTodo).subscribe({
      next: (createdTodo) => {
        this.todosSignal.update(todos => [...todos, createdTodo]);
      },
      error: (error) => console.error('Error adding todo:', error)
    });
  }

  updateTodo(id: string, updates: Partial<Todo>): void {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.http.patch<Todo>(`${this.apiUrl}/${id}`, updatedData).subscribe({
      next: (updatedTodo) => {
        this.todosSignal.update(todos =>
          todos.map(todo => (todo.id === id ? updatedTodo : todo))
        );
      },
      error: (error) => console.error('Error updating todo:', error)
    });
  }

  deleteTodo(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
      },
      error: (error) => console.error('Error deleting todo:', error)
    });
  }

  getTodoById(id: string): Todo | undefined {
    return this.todosSignal().find(todo => todo.id === id);
  }

  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todosSignal().filter(todo => todo.status === status);
  }

  getTodosByProject(projectId: string): Todo[] {
    return this.todosSignal().filter(todo => todo.projects.includes(projectId));
  }

  getTodosByUser(userId: string): Todo[] {
    return this.todosSignal().filter(todo => todo.userId === userId);
  }
}
