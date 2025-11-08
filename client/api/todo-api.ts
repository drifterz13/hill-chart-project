export class TodoApi {
  private static headers = new Headers({
    "Content-Type": "application/json",
  });

  static async getTodos() {
    const resp = await fetch("/api/todos", {
      method: "GET",
      headers: this.headers,
    });
    return resp.json();
  }

  static async addTodo(title: string) {
    const resp = await fetch("/api/todos", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ title }),
    });
    if (!resp.ok) {
      throw new Error("Failed to add todo");
    }
    return resp;
  }
}
