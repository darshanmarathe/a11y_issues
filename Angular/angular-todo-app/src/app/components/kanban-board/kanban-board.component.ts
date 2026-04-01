import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { Todo } from '../../models/todo';
import { TodoFormModalComponent } from '../todo-form-modal/todo-form-modal.component';

type TodoStatus = 'Backlog' | 'Linedup' | 'Wip' | 'Done' | 'Stuck';

const STATUS_CONFIG: Record<TodoStatus, { label: string; color: string }> = {
  Backlog: { label: 'Backlog', color: '#6c757d' },
  Linedup: { label: 'Lined Up', color: '#17a2b8' },
  Wip: { label: 'In Progress', color: '#ffc107' },
  Done: { label: 'Done', color: '#28a745' },
  Stuck: { label: 'Stuck', color: '#dc3545' }
};

const PRIORITY_COLORS: Record<Todo['priority'], string> = {
  Urgent: '#dc3545',
  High: '#fd7e14',
  Medium: '#ffc107',
  Low: '#28a745'
};

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoFormModalComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent {
  private todoService = inject(TodoService);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);

  readonly statuses: TodoStatus[] = ['Backlog', 'Linedup', 'Wip', 'Done', 'Stuck'];
  readonly statusConfig = STATUS_CONFIG;
  readonly priorityColors = PRIORITY_COLORS;

  readonly todos = this.todoService.todos;
  readonly projects = this.projectService.projects;
  readonly users = this.userService.users;

  readonly showAddModal = signal(false);
  readonly editingTodo = signal<Todo | null>(null);
  readonly draggedTodo = signal<Todo | null>(null);

  getTodosByStatus(status: TodoStatus): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }

  getProjectNames(projectIds: string[]): string {
    if (!projectIds || projectIds.length === 0) return '';
    return projectIds
      .map(id => this.projectService.getProjectById(id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  getUserName(userId: string): string {
    return this.userService.getUserById(userId)?.name || 'Unassigned';
  }

  openAddModal(): void {
    this.editingTodo.set(null);
    this.showAddModal.set(true);
  }

  openEditModal(todo: Todo): void {
    this.editingTodo.set(todo);
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.editingTodo.set(null);
  }

  saveTodo(todoData: Partial<Todo>): void {
    if (this.editingTodo()) {
      this.todoService.updateTodo(this.editingTodo()!.id, todoData as Partial<Todo>);
    } else {
      this.todoService.addTodo(todoData as Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>);
    }
    this.closeAddModal();
  }

  deleteTodo(todo: Todo): void {
    if (confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      this.todoService.deleteTodo(todo.id);
    }
  }

  onDragStart(todo: Todo): void {
    this.draggedTodo.set(todo);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, status: TodoStatus): void {
    event.preventDefault();
    const todo = this.draggedTodo();
    if (todo && todo.status !== status) {
      const isCompleted = status === 'Done';
      this.todoService.updateTodo(todo.id, {
        status,
        isCompleted,
        completionDate: isCompleted ? new Date() : undefined
      });
    }
    this.draggedTodo.set(null);
  }

  toggleComplete(todo: Todo): void {
    const isCompleted = !todo.isCompleted;
    this.todoService.updateTodo(todo.id, {
      isCompleted,
      status: isCompleted ? 'Done' : todo.status,
      completionDate: isCompleted ? new Date() : undefined
    });
  }
}
