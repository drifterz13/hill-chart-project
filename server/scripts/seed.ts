import { sql } from "bun";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import dayjs from "dayjs";
import { randBool, randNth, randPercent } from "../utils";

const features = [
  {
    name: "Feature A",
    description: "Description for Feature A",
    due_date: dayjs().add(7, "day").toDate(),
  },
  {
    name: "Feature B",
    description: "Description for Feature B",
    due_date: dayjs().subtract(3, "day").toDate(),
  },
  {
    name: "Feature C",
    description: "Description for Feature C",
    due_date: dayjs().endOf("day").toDate(),
  },
];

console.log("Seeding features...");
const insertedFeatures = await sql`
  insert into features ${sql(features)} returning id;
`;

const featureIds = insertedFeatures.map((f: { id: number }) => f.id);
const tasks = featureIds.flatMap((featureId: number) => {
  return [
    {
      feature_id: featureId,
      title: `#1 Task for feature ${featureId}`,
      completed: randBool(),
      position: randPercent(),
    },
    {
      feature_id: featureId,
      title: `#2 Task for feature ${featureId}`,
      completed: randBool(),
      position: randPercent(),
    },
    {
      feature_id: featureId,
      title: `#3 Task for feature ${featureId}`,
      completed: randBool(),
      position: randPercent(),
    },
    {
      feature_id: featureId,
      title: `#4 Task for feature ${featureId}`,
      completed: randBool(),
      position: randPercent(),
    },
  ];
});

console.log("Seeding tasks...");
const insertedTaskIds = await sql`insert into tasks ${sql(tasks)} returning id`;
const taskIds = insertedTaskIds.map((t: { id: number }) => t.id);

const avatarImages = await readdir(resolve("public", "images"));

const assignees = [
  {
    username: "Artid",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "Po",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "Prince",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "Zen",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "Care",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "KT",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
  {
    username: "Fang",
    avatar_url: `http://localhost:${Bun.env.PORT}/${randNth(avatarImages)}`,
  },
];

console.log("Seeding assignees...");
const insertedAssigneeIds =
  await sql`insert into assignees ${sql(assignees)} returning id`;

const assigneeIds = insertedAssigneeIds.map((a: { id: number }) => a.id);

const taskAssignees = taskIds.flatMap((taskId: number) => {
  const numAssignees = Math.random() < 0.5 ? 1 : 2;
  const randomAssigneeIds = randNth(assigneeIds, numAssignees);
  return randomAssigneeIds.map((assigneeId: number) => ({
    task_id: taskId,
    assignee_id: assigneeId,
  }));
});
console.log("Seeding task assignees...");
await sql`insert into task_assignees ${sql(taskAssignees)}`;
