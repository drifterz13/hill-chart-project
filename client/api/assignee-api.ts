import type { Assignee } from "../types/task-types";

export class AssigneeApi {
  private static headers = new Headers({
    "Content-Type": "application/json",
  });

  static async getAssignees() {
    const resp = await fetch("/api/assignees", {
      method: "GET",
      headers: this.headers,
    });
    if (!resp.ok) {
      throw new Error("Failed to fetch assignees");
    }
    return resp.json() as Promise<Assignee[]>;
  }
}
