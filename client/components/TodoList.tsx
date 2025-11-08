import { useState } from "react";
import TodoItem from "./TodoItem";
import FilterDropdown from "./FilterDropdown";

type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignees?: Avatar[];
};

type TodoListProps = {
  todos: Todo[];
  onToggleTodo?: (id: number, completed: boolean) => void;
  onClickTodo?: (id: number) => void;
  showFilters?: boolean;
};

export default function TodoList({
  todos,
  onToggleTodo,
  onClickTodo,
  showFilters = true,
}: TodoListProps) {
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Extract unique assignees for filter
  const allAssignees = Array.from(
    new Set(
      todos.flatMap((todo) =>
        (todo.assignees || []).map((a) => a.alt || `User ${a.id}`)
      )
    )
  );

  // Filter and sort todos
  let filteredTodos = [...todos];

  if (assigneeFilter) {
    filteredTodos = filteredTodos.filter((todo) =>
      (todo.assignees || []).some((a) => a.alt === assigneeFilter)
    );
  }

  if (sortBy === "Sort by Due Date") {
    filteredTodos.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (sortBy === "Sort by Name") {
    filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
          To-Do List
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
      <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {filteredTodos.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No todos found
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onToggle={onToggleTodo}
              onClick={onClickTodo}
            />
          ))
        )}
      </div>
    </section>
  );
}
