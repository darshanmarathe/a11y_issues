import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = '/api/users';
  private usersSignal = signal<User[]>([]);
  readonly users = computed(() => this.usersSignal());

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => this.usersSignal.set(data),
      error: (error) => console.error('Error loading users:', error)
    });
  }

  addUser(user: Omit<User, 'id'>): void {
    this.http.post<User>(this.apiUrl, user).subscribe({
      next: (createdUser) => {
        this.usersSignal.update(users => [...users, createdUser]);
      },
      error: (error) => console.error('Error adding user:', error)
    });
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.http.patch<User>(`${this.apiUrl}/${id}`, updates).subscribe({
      next: (updatedUser) => {
        this.usersSignal.update(users =>
          users.map(user => (user.id === id ? updatedUser : user))
        );
      },
      error: (error) => console.error('Error updating user:', error)
    });
  }

  deleteUser(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.usersSignal.update(users => users.filter(user => user.id !== id));
      },
      error: (error) => console.error('Error deleting user:', error)
    });
  }

  getUserById(id: string): User | undefined {
    return this.usersSignal().find(user => user.id === id);
  }
}
