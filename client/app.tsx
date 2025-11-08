import { useEffect, useOptimistic, useRef, useState } from "react";

type TodoResource = {
  id: number;
  title: string;
  completed: boolean;
  creating?: boolean;
};

const fetchTodos = async () => {
  const resp = await fetch("/api/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp.json();
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
    fetchTodos()
      .then((data) => {
        console.log(data);
        setTodos(data);
      })
      .catch(console.error);
  }, []);

  const addTodo = async (formData: FormData) => {
    const title = formData.get("title");
    const nextTodo = {
      id: Date.now(),
      title: title as string,
      completed: false,
      creating: true,
    };

    addOptimisticTodos(nextTodo);
    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    setTodos((prevState) => [{ ...nextTodo, creating: false }, ...prevState]);
  };

  return (
    <div>
      <h1>Home page.</h1>
      <form action={addTodo} ref={formRef}>
        <input type="text" name="title" placeholder="Todo title" required />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.creating ? "(Creating...)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
