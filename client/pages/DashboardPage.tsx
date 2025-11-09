import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Plus, ChevronDown } from "lucide-react";
import { FeatureApi } from "../api/feature-api";
import type { Feature } from "../types/feature-types";
import FeatureCard from "../components/FeatureCard";
import useSWR from "swr";

const SWR_KEY = {
  GET_FEATURES: "GET_FEATURES",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: features = [] } = useSWR<Feature[]>(SWR_KEY.GET_FEATURES, () =>
    FeatureApi.getFeatures(),
  );

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
    <div className="flex h-screen w-full bg-base-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-base-200">
        {/* Top Bar */}
        <TopBar onSearchChange={setSearchQuery} />

        {/* Page Content */}
        <div className="flex-1 p-10">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-base-content text-3xl font-bold tracking-tight">
              All Features
            </h2>
            <button
              onClick={handleAddFeature}
              className="btn btn-primary min-w-[84px] h-10 px-4 text-sm font-bold"
            >
              <Plus size={20} />
              <span className="truncate">Add New Feature</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button className="btn btn-outline h-8 px-3">
              <p className="text-sm font-medium">Sort: Last Updated</p>
              <ChevronDown size={16} />
            </button>
            <button className="btn btn-primary btn-outline h-8 px-3">
              <p className="text-sm font-medium">Status: Active</p>
              <ChevronDown size={16} />
            </button>
            <button className="btn btn-outline h-8 px-3">
              <p className="text-sm font-medium">Filter: Archived</p>
              <ChevronDown size={16} />
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
                progress={feature.percentage}
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
