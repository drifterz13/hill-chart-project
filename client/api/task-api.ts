import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../types/task-types";

export class TaskApi {
  private static headers = new Headers({
    "Content-Type": "application/json",
  });

  static async getTasksByFeatureId(featureId: number) {
    const resp = await fetch(`/api/features/${featureId}/tasks`, {
      method: "GET",
      headers: this.headers,
    });
    if (!resp.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return resp.json() as Promise<Task[]>;
  }

  static async createTask(featureId: number, task: CreateTaskRequest) {
    const resp = await fetch(`/api/features/${featureId}/tasks`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(task),
    });
    if (!resp.ok) {
      throw new Error("Failed to create task");
    }
    return resp.json();
  }

  static async updateTask(taskId: number, updates: UpdateTaskRequest) {
    const resp = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(updates),
    });
    if (!resp.ok) {
      throw new Error("Failed to update task");
    }
    return resp;
  }

  static async updateTaskPosition(taskId: number, position: number) {
    const resp = await fetch(`/api/tasks/${taskId}/position`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ position }),
    });
    if (!resp.ok) {
      throw new Error("Failed to update task position");
    }
    return resp;
  }

  static async deleteTask(taskId: number) {
    const resp = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!resp.ok) {
      throw new Error("Failed to delete task");
    }
    return resp;
  }
}
