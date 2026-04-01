export interface Todo {
  id: string;
  title: string;
  description: string;
  completionDate?: Date;
  status: 'Backlog' | 'Linedup' | 'Wip' | 'Done' | 'Stuck';
  targetCompletionDate?: Date;
  isCompleted: boolean;
  link?: string;
  projects: string[]; // Project IDs
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
