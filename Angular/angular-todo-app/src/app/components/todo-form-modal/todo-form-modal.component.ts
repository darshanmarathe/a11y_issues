import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-todo-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form-modal.component.html',
  styleUrls: ['./todo-form-modal.component.scss']
})
export class TodoFormModalComponent implements OnInit {
  private projectService = inject(ProjectService);
  private userService = inject(UserService);

  readonly todo = input<Todo | null>(null);
  readonly save = output<Partial<Todo>>();
  readonly cancel = output<void>();

  readonly statuses: Todo['status'][] = ['Backlog', 'Linedup', 'Wip', 'Done', 'Stuck'];
  readonly priorities: Todo['priority'][] = ['Urgent', 'High', 'Medium', 'Low'];
  
  readonly projects = this.projectService.projects;
  readonly users = this.userService.users;

  readonly formData = signal({
    title: '',
    description: '',
    status: 'Backlog' as Todo['status'],
    priority: 'Medium' as Todo['priority'],
    targetCompletionDate: '',
    link: '',
    projects: [] as string[],
    userId: ''
  });

  ngOnInit(): void {
    const existingTodo = this.todo();
    if (existingTodo) {
      this.formData.set({
        title: existingTodo.title,
        description: existingTodo.description,
        status: existingTodo.status,
        priority: existingTodo.priority,
        targetCompletionDate: existingTodo.targetCompletionDate 
          ? this.formatDate(existingTodo.targetCompletionDate) 
          : '',
        link: existingTodo.link || '',
        projects: [...existingTodo.projects],
        userId: existingTodo.userId
      });
    } else if (this.users().length > 0) {
      this.formData.update(d => ({ ...d, userId: this.users()[0].id }));
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSave(): void {
    const data = this.formData();
    if (!data.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!data.userId) {
      alert('Please assign a user');
      return;
    }

    const todoData: Partial<Todo> = {
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      targetCompletionDate: data.targetCompletionDate ? new Date(data.targetCompletionDate) : undefined,
      link: data.link.trim() || undefined,
      projects: data.projects,
      userId: data.userId,
      isCompleted: data.status === 'Done'
    };

    if (todoData.isCompleted) {
      todoData.completionDate = new Date();
    }

    this.save.emit(todoData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onProjectChange(projectId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentProjects = this.formData().projects;
    
    if (checkbox.checked) {
      this.formData.update(d => ({
        ...d,
        projects: [...currentProjects, projectId]
      }));
    } else {
      this.formData.update(d => ({
        ...d,
        projects: currentProjects.filter(id => id !== projectId)
      }));
    }
  }

  isProjectSelected(projectId: string): boolean {
    return this.formData().projects.includes(projectId);
  }
}
