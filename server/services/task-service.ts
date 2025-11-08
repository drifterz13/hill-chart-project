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
    `.values();

    // Aggregate rows into tasks with assignees array
    const data = values.reduce((acc: any, row: any[]) => {
      const taskId = row[0];

      if (!acc[taskId]) {
        acc[taskId] = {
          id: row[0],
          title: row[1],
          completed: row[2],
          position: row[3],
          dueDate: row[4],
          createdAt: row[5],
          updatedAt: row[6],
          assignees: row[7]
            ? [
                {
                  id: row[7],
                  username: row[8],
                  avatarUrl: row[9],
                },
              ]
            : [],
        };
        return acc;
      }

      if (row[7]) {
        acc[taskId].assignees.push({
          id: row[7],
          username: row[8],
          avatarUrl: row[9],
        });
      }

      return acc;
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
      const [result] = await sql`
        INSERT INTO tasks ${sql(taskValue, "title", "feature_id", "due_date")}
        RETURNING id
      `.values();

      const taskId = result[0];

      // Insert task assignees if provided
      if (task.assigneeIds && task.assigneeIds.length > 0) {
        for (const assigneeId of task.assigneeIds) {
          await sql`
            INSERT INTO task_assignees (task_id, assignee_id)
            VALUES (${taskId}, ${assigneeId})
          `;
        }
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
    `.values();

    return values.map((row: any) => ({
      id: row[0],
      username: row[1],
      avatarUrl: row[2],
      createdAt: row[3],
    }));
  }
}
