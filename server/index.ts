import homepage from "../public/index.html";
import { FeatureService } from "./services/feature-service";

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  routes: {
    "/": homepage,
    "/api/health": () => new Response("OK"),
    "/api/features": {
      GET: async () => {
        const features = await FeatureService.getFeatures();
        return Response.json(features);
      },
      POST: async (req) => {
        const feature = await req.json();
        await FeatureService.createFeature(feature);
        return new Response("Feature Created", { status: 201 });
      },
    },
  },
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

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
