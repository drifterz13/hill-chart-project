import { sql } from "bun";

export class TaskService {
  static async getTasksByFeatureId(featureId: number) {
    const values = await sql`
      SELECT
        t.id, t.title, t.completed, t.position, t.due_date,
        t.created_at, t.updated_at,
        a.id as assignee_id, a.username, a.avatar_url
      FROM tasks t
      LEFT JOIN task_assignees ta ON t.id = ta.task_id
      LEFT JOIN assignees a ON ta.assignee_id = a.id
      WHERE t.feature_id = ${featureId}
      ORDER BY t.created_at DESC
    `;

    const data = values.reduce((acc: any, row: any) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          title: row.title,
          completed: row.completed,
          position: row.position,
          dueDate: row.due_date,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          assignees: row.assignee_id
            ? [
                {
                  id: row.assignee_id,
                  username: row.username,
                  avatarUrl: row.avatar_url,
                },
              ]
            : [],
        };
        return acc;
      }

      if (row.assignee_id) {
        acc[row.id].assignees.push({
          id: row.assignee_id,
          username: row.username,
          avatarUrl: row.avatar_url,
        });
        return acc;
      }
    }, {});

    return Object.values(data);
  }

  static async createTask(task: {
    title: string;
    featureId: number;
    dueDate?: string;
    assigneeIds?: number[];
  }) {
    const taskValue = {
      title: task.title,
      feature_id: task.featureId,
      due_date: task.dueDate || null,
    };
    return await sql.begin(async (sql) => {
      const values = await sql`
        INSERT INTO tasks ${sql(taskValue, "title", "feature_id", "due_date")}
        RETURNING id
      `;
      const taskId = values[0].id;

      if (task.assigneeIds && task.assigneeIds.length > 0) {
        const taskAssignees = task.assigneeIds.map((assigneeId) => ({
          task_id: taskId,
          assignee_id: assigneeId,
        }));

        await sql`insert into task_assignees ${sql(taskAssignees)}`;
      }

      return taskId;
    });
  }

  static async updateTask(
    taskId: number,
    updates: {
      title?: string;
      completed?: boolean;
      position?: number;
      dueDate?: string;
    },
  ) {
    const updateValue = Object.entries({
      title: updates.title,
      completed: updates.completed,
      position: updates.position,
      due_date: updates.dueDate,
    }).reduce(
      (acc, [k, v]) => {
        if (v === undefined) return acc;
        return { ...acc, [k]: v };
      },
      { updated_at: new Date() },
    );

    await sql`
      UPDATE tasks
      SET ${sql(updateValue)}
      WHERE id = ${taskId}
    `;
  }

  static async updateTaskPosition(taskId: number, position: number) {
    await sql`
      UPDATE tasks
      SET position = ${position}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
    `;
  }

  static async deleteTask(taskId: number) {
    await sql`
      DELETE FROM tasks WHERE id = ${taskId}
    `;
  }

  static async getAssignees() {
    const values = await sql`
      SELECT id, username, avatar_url, created_at
      FROM assignees
      ORDER BY username ASC
    `;

    return values.map((row: any) => ({
      id: row.id,
      username: row.username,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    }));
  }
}
