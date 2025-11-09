import { sql } from "bun";

export class ProgressionService {
  static async getAllFeatureStats(): Promise<
    Array<{
      featureId: number;
      percentage: number;
      stage: string;
    }>
  > {
    const rows = await sql`
      select 
        f.id as feature_id, 
        count(t.id) as total_tasks,
        sum(case when t.completed is true then 1 else 0 end) as total_completed_tasks,
        case
          when avg(t.position) < 45 then 'uphill'
          when avg(t.position) >= 45 and avg(t.position) <= 55 then 'at-peak'
          when avg(t.position) > 55 then 'downhill'
        end as stage
      from features f
      join tasks t on f.id = t.feature_id
      group by f.id
    `;

    return rows.map((result: any) => ({
      featureId: result.feature_id,
      percentage: (result.total_completed_tasks / result.total_tasks) * 100,
      stage: result.stage,
    }));
  }

  static async getStatsByFeatureId(featureId: number): Promise<{
    featureId: number;
    percentage: number;
    stage: string;
  }> {
    const [result] = await sql`
      select 
        f.id as feature_id, 
        count(t.id) as total_tasks,
        sum(case when t.completed is true then 1 else 0 end) as total_completed_tasks,
        case
          when avg(t.position) < 45 then 'uphill'
          when avg(t.position) >= 45 and avg(t.position) <= 55 then 'at-peak'
          when avg(t.position) > 55 then 'downhill'
        end as stage
      from features f
      join tasks t on f.id = t.feature_id
      where f.id = ${featureId}
      group by f.id
    `;
    return {
      featureId: result.feature_id,
      percentage: (result.total_completed_tasks / result.total_tasks) * 100,
      stage: result.stage,
    };
  }
}
