import { useEffect, useState } from "react";
import { TodoApi } from "../api/todo-api";
import { useNavigate } from "react-router";
import TopNavBar from "../components/TopNavBar";
import HillChart from "../components/HillChart";
import TodoList, { type Todo } from "../components/TodoList";
import AddTodoModal from "../components/AddTodoModal";

type TodoResource = {
  id: number;
  title: string;
  completed: boolean;
  creating?: boolean;
  position?: number; // 0-100 position on the hill chart
  dueDate?: string;
  assignees?: Array<{
    id: string | number;
    src: string;
    alt: string;
  }>;
};

export default function TodoProgressPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<TodoResource[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    setTodos([]);
    TodoApi.getTodos()
      .then((data) => {
        if (!ignore) {
          // Add default position to existing todos
          const todosWithPosition = data.map((todo: TodoResource) => ({
            ...todo,
            position: todo.position ?? 0,
          }));
          setTodos(todosWithPosition);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, []);

  const handlePositionChange = (id: number, position: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, position } : todo)),
    );
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
    );
    // TODO: Call API to update todo
  };

  const handleClickTodo = (id: number) => {
    navigate(`/todos/${id}`);
  };

  const handleAddTodo = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitTodo = async (newTodo: {
    title: string;
    assignee: string;
    dueDate: string;
  }) => {
    try {
      // TODO: Call API to create todo with all fields
      await TodoApi.addTodo(newTodo.title);

      // Refresh todos list
      const data = await TodoApi.getTodos();
      const todosWithPosition = data.map((todo: TodoResource) => ({
        ...todo,
        position: todo.position ?? 0,
      }));
      setTodos(todosWithPosition);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
        <div className="layout-container flex h-full grow flex-col items-center">
          <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="layout-content-container flex flex-col w-full bg-white dark:bg-[#1C2A38] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <TopNavBar
                title="Q3 Website Redesign"
                onAddClick={handleAddTodo}
                addButtonText="Add To-Do"
              />

              <main className="flex flex-col p-6 space-y-8">
                {/* Hill Chart Section */}
                <section>
                  <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-2">
                    Progress Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-4">
                    The left side of the hill is for 'Figuring things out,' and
                    the right side is for 'Making it happen.' Drag dots to update
                    task progress.
                  </p>
                  <HillChart
                    items={todos.map((todo) => ({
                      id: todo.id,
                      title: todo.title,
                      position: todo.position ?? 0,
                    }))}
                    onPositionChange={handlePositionChange}
                  />
                </section>

                {/* To-Do List Section */}
                <TodoList
                  todos={todos as Todo[]}
                  onToggleTodo={handleToggleTodo}
                  onClickTodo={handleClickTodo}
                  showFilters={true}
                />
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo Modal */}
      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitTodo}
      />
    </>
  );
}
