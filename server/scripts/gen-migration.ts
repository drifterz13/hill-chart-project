import { parseArgs } from "util";
import { $ } from "bun";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    name: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (!values.name) {
  console.error("Please provide a name for the migration using --name");
  process.exit(1);
}

await $`touch server/migrations/${Date.now()}_${values.name.split(" ").join("_")}.sql`;
