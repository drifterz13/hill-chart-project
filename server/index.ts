import homepage from "../public/index.html";
import { sql } from "bun";

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  routes: {
    "/": homepage,
    "/api/health": () => new Response("OK"),
    "/api/todos": {
      GET: async () => {
        const values = await sql`
            SELECT id, title, completed, created_at, updated_at 
            FROM todos
            ORDER BY created_at DESC;
          `.values();

        const todos = values.map((row: any[]) => ({
          id: row[0],
          title: row[1],
          completed: row[2],
          created_at: row[3],
          updated_at: row[4],
        }));

        return Response.json(todos);
      },
      POST: async (req) => {
        const todo = await req.json();
        await sql`
          INSERT INTO todos ${sql(todo, "title")}
        `;
        return new Response("Todo Created", { status: 201 });
      },
    },
  },
  development: {
    hmr: Bun.env.NODE_ENV !== "production",
    console: Bun.env.NODE_ENV !== "production",
  },
});

console.log(`Listening on ${server.url}`);
