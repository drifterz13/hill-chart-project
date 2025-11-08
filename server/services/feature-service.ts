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
          assignees: [
            {
              username: row[8],
              avatarUrl: row[9],
            },
          ],
        };

        return acc;
      }

      acc[featureId].assignees.push({
        username: row[8],
        avatarUrl: row[9],
      });

      return acc;
    }, {});

    return Object.values(data);
  }

  static async createFeature(feature: any) {
    await sql`
          INSERT INTO features ${sql(feature, "name", "description", "due_date")}
        `;
  }
}
