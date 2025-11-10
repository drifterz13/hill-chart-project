import tailwind from "bun-plugin-tailwind";

await Bun.build({
  entrypoints: ["./server/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  plugins: [tailwind],
});

console.log("Build completed successfully!");
