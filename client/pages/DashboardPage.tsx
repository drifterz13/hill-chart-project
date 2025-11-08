import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import { Plus, ChevronDown } from "lucide-react";
import { FeatureApi } from "../api/feature-api";
import type { Feature } from "../types/feature-types";
import FeatureCard from "../components/FeatureCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    let ignore = false;

    setFeatures([]);
    FeatureApi.getFeatures()
      .then((features) => {
        if (!ignore) {
          setFeatures(features);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, []);

  const handleFeatureClick = (id: string | number) => {
    navigate(`/features/${id}`);
  };

  const handleFeatureMenuClick = (id: string | number) => {
    console.log("Menu clicked for feature:", id);
  };

  const handleAddFeature = () => {
    navigate("/features/new");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <DashboardTopBar onSearchChange={setSearchQuery} />

        {/* Page Content */}
        <div className="flex-1 p-10">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold tracking-tight">
              All Features
            </h2>
            <button
              onClick={handleAddFeature}
              className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span className="truncate">Add New Feature</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:border-blue-500/50 transition-colors">
              <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Sort: Last Updated
              </p>
              <ChevronDown
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-blue-500/20 border border-blue-500/50 px-3">
              <p className="text-blue-500 text-sm font-medium">
                Status: Active
              </p>
              <ChevronDown size={16} className="text-blue-500" />
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:border-blue-500/50 transition-colors">
              <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Filter: Archived
              </p>
              <ChevronDown
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                id={feature.id}
                title={feature.name}
                description={feature.description}
                stage={feature.stage}
                avatars={feature.assignees.map((assignee) => ({
                  id: assignee.username,
                  src: assignee.avatarUrl,
                  alt: `Avatar of ${assignee.username}`,
                }))}
                dueDate={feature.dueDate}
                progress={feature.progress}
                onClick={handleFeatureClick}
                onMenuClick={handleFeatureMenuClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
