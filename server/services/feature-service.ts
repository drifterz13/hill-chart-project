import { sql } from "bun";

export class FeatureService {
  static async getFeatures() {
    const values = await sql`
            select 
              f.id, f.name, f.description, f.status, f.due_date, f.created_at, 
              fp.stage, fp.percentage, a.username, a.avatar_url
            from features f
            left join feature_assignees fa on f.id = fa.feature_id
            left join assignees a on fa.assignee_id = a.id
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
      SELECT
        f.id, f.name, f.description, f.status, f.due_date, f.created_at,
        fp.stage, fp.percentage, a.id as assignee_id, a.username, a.avatar_url
      FROM features f
      LEFT JOIN feature_assignees fa ON f.id = fa.feature_id
      LEFT JOIN assignees a ON fa.assignee_id = a.id
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
        .filter((row) => row[8] !== null)
        .map((row) => ({
          id: row[8],
          username: row[9],
          avatarUrl: row[10],
        })),
    };

    return feature;
  }

  static async createFeature(feature: any) {
    await sql`
          INSERT INTO features ${sql(feature, "name", "description", "due_date")}
        `;
  }

  static async createFeatureWithTasks(feature: {
    name: string;
    description?: string;
    dueDate?: string;
    tasks?: Array<{
      title: string;
      dueDate?: string;
      assigneeIds?: number[];
    }>;
  }) {
    return await sql.begin(async (sql) => {
      // Insert feature
      const [featureResult] = await sql`
        INSERT INTO features ${sql(feature, "name", "description", "due_date")}
        RETURNING id
      `.values();

      const featureId = featureResult[0];

      // Insert tasks if provided
      if (feature.tasks && feature.tasks.length > 0) {
        for (const task of feature.tasks) {
          const [taskResult] = await sql`
            INSERT INTO tasks (title, feature_id, due_date)
            VALUES (${task.title}, ${featureId}, ${task.dueDate || null})
            RETURNING id
          `.values();

          const taskId = taskResult[0];

          // Insert task assignees if provided
          if (task.assigneeIds && task.assigneeIds.length > 0) {
            for (const assigneeId of task.assigneeIds) {
              await sql`
                INSERT INTO task_assignees (task_id, assignee_id)
                VALUES (${taskId}, ${assigneeId})
              `;
            }
          }
        }
      }

      return featureId;
    });
  }
}
