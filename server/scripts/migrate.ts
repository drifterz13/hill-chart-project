import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { sql } from "bun";

const migrations = await readdir(resolve("server", "migrations"));

for (const migration of migrations.sort()) {
  // Always run the initial migration
  if (migration === "000_init.sql") {
    await sql.file(resolve("server", "migrations", migration));
    continue;
  }

  await sql.begin(async (sql) => {
    const [applied] =
      await sql`SELECT 1 FROM migrations WHERE name = ${migration}`.values();

    if (applied) {
      console.log(`Migration ${migration} already applied, skipping.`);
    } else {
      console.log(`Applying migration: ${migration}`);
      await sql.file(resolve("server", "migrations", migration));
    }

    await sql`INSERT INTO migrations (name) VALUES (${migration})`;
  });
}
