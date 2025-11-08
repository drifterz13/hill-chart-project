import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import TodoProgressPage from "./pages/TodoProgressPage";
import DashboardPage from "./pages/DashboardPage";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/todos/:id" element={<TodoProgressPage />} />
    </Routes>
  </BrowserRouter>,
);
