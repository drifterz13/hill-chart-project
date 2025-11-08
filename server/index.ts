import homepage from "../public/index.html";

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  routes: {
    "/": homepage,
    "/api/health": () => new Response("OK"),
  },
  development: {
    hmr: Bun.env.NODE_ENV !== "production",
    console: Bun.env.NODE_ENV !== "production",
  },
});

console.log(`Listening on ${server.url}`);
