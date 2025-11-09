import { sql } from "bun";
import { ProgressionService } from "./progression-service";

export class FeatureService {
  static async getFeatures() {
    const featureRows = await sql`
        select distinct
          f.id, f.name, f.description, f.due_date, f.created_at,
          a.username, a.avatar_url
        from features f
        left join tasks t on f.id = t.feature_id
        left join task_assignees ta on t.id = ta.task_id
        left join assignees a on ta.assignee_id = a.id
        order by f.created_at desc;
      `;

    const statsRows = await ProgressionService.getAllFeatureStats();
    const statsMap = statsRows.reduce(
      (acc, stat) => ({ ...acc, [stat.featureId]: stat }),
      {} as Record<number, (typeof statsRows)[number]>,
    );

    const data = featureRows.reduce((acc: any, row: any) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          dueDate: row.due_date,
          cretedAt: row.created_at,
          stage: statsMap[row.id as number]?.stage,
          percentage: statsMap[row.id as number]?.percentage,
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
      select distinct
        f.id, f.name, f.description, f.due_date, f.created_at,
        a.id as assignee_id, a.username, a.avatar_url
      from features f
      left join tasks t ON f.id = t.feature_id
      left join task_assignees ta ON t.id = ta.task_id
      left join assignees a ON ta.assignee_id = a.id
      where f.id = ${featureId}
    `;

    if (rows.length === 0) {
      return null;
    }

    const statsRows = await ProgressionService.getAllFeatureStats();
    const statsMap = statsRows.reduce(
      (acc, stat) => ({ ...acc, [stat.featureId]: stat }),
      {} as Record<number, (typeof statsRows)[number]>,
    );

    const feature = {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      dueDate: rows[0].due_date,
      createdAt: rows[0].created_at,
      stage: statsMap[rows[0].id as number]?.stage,
      percentage: statsMap[rows[0].id as number]?.percentage,
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
    await sql`insert into features ${sql(feature, "name", "description", "due_date")}`;
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
      const [result] =
        await sql`insert into features ${sql(featureValue, "name", "description")} returning id
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

        const taskAssignees = taskIdRows.flatMap(
          (taskIdRow: any, index: number) => {
            const taskId = taskIdRow.id;
            const assigneeIds = taskAssigneeIds[index] || [];

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

      return featureId;
    });
  }
}
