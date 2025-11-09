import { sql } from "bun";

export class FeatureService {
  static async getFeatures() {
    const values = await sql`
        select distinct
          f.id, f.name, f.description, f.status, f.due_date, f.created_at,
          fp.stage, fp.percentage, a.username, a.avatar_url
        from features f
        left join tasks t on f.id = t.feature_id
        left join task_assignees ta on t.id = ta.task_id
        left join assignees a on ta.assignee_id = a.id
        left join feature_progression fp on f.id = fp.feature_id
        order by f.created_at desc;
      `;

    const data = values.reduce((acc: any, row: any) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          status: row.status,
          dueDate: row.due_date,
          cretedAt: row.created_at,
          stage: row.stage,
          percentage: row.percentage,
          assignees: row.username
            ? [
                {
                  username: row.username,
                  avatarUrl: row.avatar_url,
                },
              ]
            : [],
        };

        return acc;
      }

      if (row.username) {
        acc[row.id].assignees.push({
          username: row.username,
          avatarUrl: row.avatar_url,
        });
      }

      return acc;
    }, {});

    return Object.values(data);
  }

  static async getFeature(featureId: number) {
    const rows = await sql`
      SELECT DISTINCT
        f.id, f.name, f.description, f.status, f.due_date, f.created_at,
        fp.stage, fp.percentage, a.id as assignee_id, a.username, a.avatar_url
      FROM features f
      LEFT JOIN tasks t ON f.id = t.feature_id
      LEFT JOIN task_assignees ta ON t.id = ta.task_id
      LEFT JOIN assignees a ON ta.assignee_id = a.id
      LEFT JOIN feature_progression fp ON f.id = fp.feature_id
      WHERE f.id = ${featureId}
    `;

    if (rows.length === 0) {
      return null;
    }

    const feature = {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      status: rows[0].status,
      dueDate: rows[0].due_date,
      createdAt: rows[0].created_at,
      stage: rows[0].stage,
      percentage: rows[0].percentage,
      assignees: rows
        .filter((row: any) => row.assignee_id)
        .map((row: any) => ({
          id: row.assignee_id,
          username: row.username,
          avatarUrl: row.avatar_url,
        })),
    };

    return feature;
  }

  static async createFeature(feature: any) {
    await sql`INSERT INTO features ${sql(feature, "name", "description", "due_date")}`;
  }

  static async createFeatureWithTasks(feature: {
    name: string;
    description?: string;
    tasks?: Array<{
      title: string;
      dueDate?: string;
      assigneeIds?: number[];
    }>;
  }) {
    const featureValue = {
      name: feature.name,
      description: feature.description || null,
    };
    return await sql.begin(async (sql) => {
      const [result] = await sql`
        INSERT INTO features ${sql(featureValue, "name", "description")}
        RETURNING id
      `;

      const featureId = result.id;

      if (feature.tasks && feature.tasks.length > 0) {
        const tasksValue = (feature.tasks || []).map((task) => ({
          title: task.title,
          feature_id: featureId,
          due_date: task.dueDate || null,
        }));

        const [taskIdRows] =
          await sql`insert into tasks ${sql(tasksValue)} returning id`;

        const taskAssigneeIds = feature.tasks.map(
          (task) => task.assigneeIds || [],
        );

        if (taskIdRows.length > 0) {
          const taskAssignees = taskIdRows.flatMap(
            (taskIdRow: any, index: number) => {
              const taskId = taskIdRow.id;
              const assigneeIds = taskAssigneeIds[index] || [];

              if (assigneeIds.length === 0) {
                return [];
              }

              return assigneeIds.map((assigneeId) => ({
                task_id: taskId,
                assignee_id: assigneeId,
              }));
            },
          );

          if (taskAssignees.length > 0) {
            await sql`insert into task_assignees ${sql(taskAssignees)}`;
          }
        }
      }

      return featureId;
    });
  }
}
