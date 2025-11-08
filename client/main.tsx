import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import FeatureProgressPage from "./pages/FeatureProgressPage";
import DashboardPage from "./pages/DashboardPage";
import CreateFeaturePage from "./pages/CreateFeaturePage";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/features/new" element={<CreateFeaturePage />} />
      <Route path="/features/:featureId" element={<FeatureProgressPage />} />
    </Routes>
  </BrowserRouter>,
);
