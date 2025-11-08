import { useEffect, useOptimistic, useRef, useState } from "react";
import HillChart from "./components/HillChart";
import { TodoApi } from "./api/todo-api";

type TodoResource = {
  id: number;
  title: string;
  completed: boolean;
  creating?: boolean;
  position?: number; // 0-100 position on the hill chart
};

export default function App() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [todos, setTodos] = useState<TodoResource[]>([]);

  const [optimisticTodos, addOptimisticTodos] = useOptimistic(
    todos,
    (state, newTodo: TodoResource) => {
      return [newTodo, ...state];
    },
  );

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

  const addTodo = async (formData: FormData) => {
    const title = formData.get("title");
    const nextTodo = {
      id: Date.now(),
      title: title as string,
      completed: false,
      creating: true,
      position: 0, // Start at the beginning of the hill
    };

    addOptimisticTodos(nextTodo);
    formRef.current?.reset();

    await TodoApi.addTodo(nextTodo.title);
    setTodos((prevState) => [{ ...nextTodo, creating: false }, ...prevState]);
  };

  const handlePositionChange = (id: number, position: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, position } : todo)),
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-center text-3xl font-bold mb-8">
        Todo Hill Chart
      </h1>

      <form
        action={addTodo}
        ref={formRef}
        className="flex gap-2 mb-8 justify-center"
      >
        <input
          type="text"
          name="title"
          placeholder="Todo title"
          required
          className="px-4 py-2 text-base border-2 border-gray-200 rounded-md min-w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-2 text-base bg-blue-500 text-white rounded-md cursor-pointer font-medium hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </form>

      <HillChart
        items={optimisticTodos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          position: todo.position ?? 0,
        }))}
        onPositionChange={handlePositionChange}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          All Todos
        </h2>
        <ul className="list-none p-0">
          {optimisticTodos.map((todo) => (
            <li
              key={todo.id}
              className="px-4 py-3 mb-2 bg-gray-50 rounded-md flex justify-between items-center hover:bg-gray-100 transition-colors"
            >
              <span>
                {todo.title} {todo.creating ? "(Creating...)" : ""}
              </span>
              <span className="text-sm text-gray-500">
                Position: {Math.round(todo.position ?? 0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
