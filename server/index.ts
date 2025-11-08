import homepage from "../public/index.html";
import { FeatureService } from "./services/feature-service";
import { TaskService } from "./services/task-service";

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  routes: {
    "/": homepage,
    "/features/*": homepage,
    "/api/health": () => new Response("OK"),
    "/api/features": {
      GET: async () => {
        const features = await FeatureService.getFeatures();
        return Response.json(features);
      },
      POST: async (req) => {
        const body = await req.json();
        const featureId = await FeatureService.createFeatureWithTasks({
          name: body.name,
          description: body.description,
          dueDate: body.dueDate,
          tasks: body.tasks,
        });
        return Response.json({ id: featureId }, { status: 201 });
      },
    },
    "/api/features/:id": {
      GET: async (req) => {
        const featureId = parseInt(req.params.id);
        const feature = await FeatureService.getFeature(featureId);
        if (!feature) {
          return new Response("Feature not found", { status: 404 });
        }
        return Response.json(feature);
      },
    },
    "/api/features/:id/tasks": {
      GET: async (req) => {
        const featureId = parseInt(req.params.id);
        const tasks = await TaskService.getTasksByFeatureId(featureId);
        return Response.json(tasks);
      },
      POST: async (req) => {
        const featureId = parseInt(req.params.id);
        const body = await req.json();
        const taskId = await TaskService.createTask({
          title: body.title,
          featureId,
          assigneeIds: body.assigneeIds,
          dueDate: body.dueDate,
        });
        return Response.json({ id: taskId }, { status: 201 });
      },
    },

    "/api/tasks/:id": {
      PATCH: async (req) => {
        const taskId = parseInt(req.params.id);
        const body = await req.json();
        await TaskService.updateTask(taskId, body);
        return new Response("Task Updated", { status: 200 });
      },
      DELETE: async (req) => {
        const taskId = parseInt(req.params.id);
        await TaskService.deleteTask(taskId);
        return new Response("Task Deleted", { status: 200 });
      },
    },
    "/api/tasks/:id/position": {
      PATCH: async (req) => {
        const taskId = parseInt(req.params.id);
        const body = await req.json();
        await TaskService.updateTaskPosition(taskId, body.position);
        return new Response("Position Updated", { status: 200 });
      },
    },
    "/api/assignees": {
      GET: async () => {
        const assignees = await TaskService.getAssignees();
        return Response.json(assignees);
      },
    },
  },
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Handle static image files
    const imagePath = `./public/images${path}`;

    try {
      const file = Bun.file(imagePath);
      if (await file.exists()) {
        return new Response(file); // Bun automatically sets Content-Type
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("Error serving file:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  development: {
    hmr: Bun.env.NODE_ENV !== "production",
    console: Bun.env.NODE_ENV !== "production",
  },
});

console.log(`Listening on ${server.url}`);
