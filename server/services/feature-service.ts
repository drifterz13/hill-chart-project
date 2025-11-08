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
      `.values();

    const data = values.reduce((acc: any, row: any[]) => {
      const featureId = row[0];

      if (!acc[featureId]) {
        acc[featureId] = {
          id: row[0],
          name: row[1],
          description: row[2],
          status: row[3],
          dueDate: row[4],
          cretedAt: row[5],
          stage: row[6],
          percentage: row[7],
          assignees: row[8]
            ? [
                {
                  username: row[8],
                  avatarUrl: row[9],
                },
              ]
            : [],
        };

        return acc;
      }

      if (row[8]) {
        acc[featureId].assignees.push({
          username: row[8],
          avatarUrl: row[9],
        });
      }

      return acc;
    }, {});

    return Object.values(data);
  }

  static async getFeature(featureId: number) {
    const values = await sql`
      SELECT DISTINCT
        f.id, f.name, f.description, f.status, f.due_date, f.created_at,
        fp.stage, fp.percentage, a.id as assignee_id, a.username, a.avatar_url
      FROM features f
      LEFT JOIN tasks t ON f.id = t.feature_id
      LEFT JOIN task_assignees ta ON t.id = ta.task_id
      LEFT JOIN assignees a ON ta.assignee_id = a.id
      LEFT JOIN feature_progression fp ON f.id = fp.feature_id
      WHERE f.id = ${featureId}
    `.values();

    if (values.length === 0) {
      return null;
    }

    // Aggregate rows into a single feature with assignees array
    const feature = {
      id: values[0][0],
      name: values[0][1],
      description: values[0][2],
      status: values[0][3],
      dueDate: values[0][4],
      createdAt: values[0][5],
      stage: values[0][6],
      percentage: values[0][7],
      assignees: values
        .filter((row: any[]) => row[8] !== null)
        .map((row: any[]) => ({
          id: row[8],
          username: row[9],
          avatarUrl: row[10],
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
      const [featureResult] = await sql`
        INSERT INTO features ${sql(featureValue, "name", "description")}
        RETURNING id
      `.values();

      const featureId = featureResult[0];

      if (feature.tasks && feature.tasks.length > 0) {
        const tasksValue = (feature.tasks || []).map((task) => ({
          title: task.title,
          feature_id: featureId,
          due_date: task.dueDate || null,
        }));

        const [tasksResult] =
          await sql`insert into tasks ${sql(tasksValue)} returning id`.values();

        const taskAssigneeIds = feature.tasks.map(
          (task) => task.assigneeIds || [],
        );

        if (tasksResult.length > 0) {
          const taskAssignees = tasksResult.flatMap(
            (taskRow: any[], index: number) => {
              const taskId = taskRow[0];
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
