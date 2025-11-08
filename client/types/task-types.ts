export type TaskAssignee = {
  id: number;
  username: string;
  avatarUrl: string;
};

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  position: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignees: TaskAssignee[];
};

export type Assignee = {
  id: number;
  username: string;
  avatarUrl: string;
  createdAt: string;
};

export type CreateTaskRequest = {
  title: string;
  dueDate?: string;
  assigneeIds?: number[];
};

export type UpdateTaskRequest = {
  title?: string;
  completed?: boolean;
  position?: number;
  dueDate?: string;
};
