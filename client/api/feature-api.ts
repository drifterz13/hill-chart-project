import type { Feature } from "../types/feature-types";
import type { CreateTaskRequest } from "../types/task-types";

export type CreateFeatureWithTasksRequest = {
  name: string;
  description?: string;
  dueDate?: string;
  tasks?: CreateTaskRequest[];
};

export class FeatureApi {
  private static headers = new Headers({
    "Content-Type": "application/json",
  });

  static async getFeatures() {
    const resp = await fetch("/api/features", {
      method: "GET",
      headers: this.headers,
    });
    return resp.json() as Promise<Feature[]>;
  }

  static async getFeature(featureId: number) {
    const resp = await fetch(`/api/features/${featureId}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!resp.ok) {
      throw new Error("Failed to fetch feature");
    }
    return resp.json() as Promise<Feature>;
  }

  static async addFeature(title: string) {
    const resp = await fetch("/api/features", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ title }),
    });
    if (!resp.ok) {
      throw new Error("Failed to add feature");
    }
    return resp;
  }

  static async createFeatureWithTasks(feature: CreateFeatureWithTasksRequest) {
    const resp = await fetch("/api/features", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(feature),
    });
    if (!resp.ok) {
      throw new Error("Failed to create feature");
    }
    return resp.json() as Promise<{ id: number }>;
  }
}
