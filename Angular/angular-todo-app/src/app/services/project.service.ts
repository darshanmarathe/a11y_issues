import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = '/api/projects';
  private projectsSignal = signal<Project[]>([]);
  readonly projects = computed(() => this.projectsSignal());

  constructor(private http: HttpClient) {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<Project[]>(this.apiUrl).subscribe({
      next: (data) => this.projectsSignal.set(data),
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } = {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.http.post<Project>(this.apiUrl, newProject).subscribe({
      next: (createdProject) => {
        this.projectsSignal.update(projects => [...projects, createdProject]);
      },
      error: (error) => console.error('Error adding project:', error)
    });
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.http.patch<Project>(`${this.apiUrl}/${id}`, updatedData).subscribe({
      next: (updatedProject) => {
        this.projectsSignal.update(projects =>
          projects.map(project => (project.id === id ? updatedProject : project))
        );
      },
      error: (error) => console.error('Error updating project:', error)
    });
  }

  deleteProject(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.projectsSignal.update(projects => projects.filter(project => project.id !== id));
      },
      error: (error) => console.error('Error deleting project:', error)
    });
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(project => project.id === id);
  }
}
