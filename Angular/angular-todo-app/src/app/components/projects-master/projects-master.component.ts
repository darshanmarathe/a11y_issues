import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { TodoService } from '../../services/todo.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-master.component.html',
  styleUrls: ['./projects-master.component.scss']
})
export class ProjectsMasterComponent {
  private projectService = inject(ProjectService);
  private todoService = inject(TodoService);

  readonly projects = this.projectService.projects;
  
  readonly showAddModal = signal(false);
  readonly editingProject = signal<Project | null>(null);
  
  readonly formData = signal({
    name: '',
    description: ''
  });

  openAddModal(): void {
    this.editingProject.set(null);
    this.formData.set({ name: '', description: '' });
    this.showAddModal.set(true);
  }

  openEditModal(project: Project): void {
    this.editingProject.set(project);
    this.formData.set({
      name: project.name,
      description: project.description || ''
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.editingProject.set(null);
  }

  onSave(): void {
    const data = this.formData();
    if (!data.name.trim()) {
      alert('Project name is required');
      return;
    }

    const projectData = {
      name: data.name.trim(),
      description: data.description.trim()
    };

    if (this.editingProject()) {
      this.projectService.updateProject(this.editingProject()!.id, projectData);
    } else {
      this.projectService.addProject(projectData);
    }

    this.closeAddModal();
  }

  deleteProject(project: Project): void {
    const todosInProject = this.todoService.getTodosByProject(project.id);
    if (todosInProject.length > 0) {
      const confirmed = confirm(
        `Project "${project.name}" has ${todosInProject.length} todo(s) associated with it. ` +
        `Are you sure you want to delete this project?`
      );
      if (!confirmed) return;
    } else {
      if (!confirm(`Are you sure you want to delete "${project.name}"?`)) return;
    }

    this.projectService.deleteProject(project.id);
  }

  getTodoCount(projectId: string): number {
    return this.todoService.getTodosByProject(projectId).length;
  }
}
