import { useState } from "react";
import TaskItem from "./TaskItem";
import FilterDropdown from "./FilterDropdown";

type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignees?: Avatar[];
};

type TaskListProps = {
  tasks: Task[];
  onToggleTask?: (id: number, completed: boolean) => void;
  onClickTask?: (id: number) => void;
  showFilters?: boolean;
};

export default function TaskList({
  tasks,
  onToggleTask,
  onClickTask,
  showFilters = true,
}: TaskListProps) {
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Extract unique assignees for filter
  const allAssignees = Array.from(
    new Set(
      tasks.flatMap((task) =>
        (task.assignees || []).map((a) => a.alt || `User ${a.id}`),
      ),
    ),
  );

  // Filter and sort tasks
  let filteredTasks = [...tasks];

  if (assigneeFilter) {
    filteredTasks = filteredTasks.filter((task) =>
      (task.assignees || []).some((a) => a.alt === assigneeFilter),
    );
  }

  if (sortBy === "Sort by Due Date") {
    filteredTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (sortBy === "Sort by Name") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <h2 className="text-base-content text-[22px] font-bold leading-tight tracking-[-0.015em]">
          Task List
        </h2>
        {showFilters && (
          <div className="flex items-center gap-2">
            <FilterDropdown
              options={allAssignees}
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              placeholder="All Assignees"
            />
            <FilterDropdown
              options={["Sort by Due Date", "Sort by Name"]}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by..."
            />
          </div>
        )}
      </div>
      <div className="flex flex-col border border-base-200 rounded-lg overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="px-4 py-8 text-center text-base-content/60">
            No tasks found
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              dueDate={task.dueDate}
              assignees={(task.assignees || []).map((assignee) => ({
                id: assignee.id,
                src: assignee.src,
                alt: assignee.alt,
              }))}
              onToggle={onToggleTask}
              onClick={onClickTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
