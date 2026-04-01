import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { ProjectsMasterComponent } from './components/projects-master/projects-master.component';

export const routes: Routes = [
  { path: '', redirectTo: 'kanban', pathMatch: 'full' },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'projects', component: ProjectsMasterComponent }
];
