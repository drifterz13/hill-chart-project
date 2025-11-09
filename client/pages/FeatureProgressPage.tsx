import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TaskApi } from "../api/task-api";
import { FeatureApi } from "../api/feature-api";
import TopBar from "../components/TopBar";
import HillChart from "../components/HillChart";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import Sidebar from "../components/Sidebar";
import useSWR from "swr";

const SWR_KEY = {
  GET_FEATURE: "GET_FEATURE",
  GET_FEATURE_TASKS: "GET_FEATURE_TASKS",
};

export default function FeatureProgressPage() {
  const navigate = useNavigate();
  const { featureId } = useParams<{ featureId: string }>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: feature } = useSWR(
    [SWR_KEY.GET_FEATURE, featureId],
    ([_, id]) => FeatureApi.getFeature(+id!),
  );
  const { data: tasks = [], mutate: mutateTasks } = useSWR(
    [SWR_KEY.GET_FEATURE_TASKS, featureId],
    ([_, id]) => TaskApi.getTasksByFeatureId(+id!),
  );

  const handlePositionChange = async (id: number, position: number) => {
    await mutateTasks(
      async () => {
        await TaskApi.updateTaskPosition(id, position);
        return tasks.map((task) =>
          task.id === id ? { ...task, position } : task,
        );
      },
      {
        optimisticData: tasks.map((task) =>
          task.id === id ? { ...task, position } : task,
        ),
        rollbackOnError: true,
      },
    );
  };
  const handleToggleTask = async (id: number, completed: boolean) => {
    await mutateTasks(
      async () => {
        await TaskApi.updateTask(id, { completed });
        return tasks.map((task) =>
          task.id === id ? { ...task, completed } : task,
        );
      },
      {
        optimisticData: tasks.map((task) =>
          task.id === id ? { ...task, completed } : task,
        ),
        rollbackOnError: true,
      },
    );
  };

  const handleSubmitTask = async (newTask: {
    title: string;
    assigneeIds: number[];
    dueDate?: string;
  }) => {
    if (!featureId) return;

    await mutateTasks(
      async (currentTasks) => {
        const createdTask = await TaskApi.createTask(+featureId, {
          title: newTask.title,
          assigneeIds: newTask.assigneeIds,
          dueDate: newTask.dueDate,
        });

        return [...(currentTasks || []), createdTask];
      },
      { rollbackOnError: true },
    );
    setIsAddModalOpen(false);
  };

  const handleClickTask = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-base-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-base-200">
        <TopBar
          title={feature?.name ?? "Loading..."}
          onAddClick={handleAddTask}
          addButtonText="Add Task"
        />
        <div className="flex-1 p-10">
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col space-y-6">
              {/* Breadcrumb */}
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <a onClick={() => navigate("/")}>Dashboard</a>
                  </li>
                  <li>{feature?.name ?? "Loading..."}</li>
                </ul>
              </div>

              {/* Hill Chart Section */}
              <section>
                <h2 className="text-base-content text-[22px] font-bold leading-tight tracking-[-0.015em] pb-2">
                  Progress Overview
                </h2>
                <p className="text-base-content/60 text-base font-normal leading-normal pb-4">
                  The left side of the hill is for 'Figuring things out,' and
                  the right side is for 'Making it happen.' Drag dots to update
                  task progress.
                </p>
                <HillChart
                  items={tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    position: task.position ?? 0,
                  }))}
                  onPositionChange={handlePositionChange}
                />
              </section>

              {/* Task List Section */}
              <TaskList
                tasks={tasks.map((task) => ({
                  id: task.id,
                  title: task.title,
                  completed: task.completed,
                  dueDate: task.dueDate,
                  assignees: (task.assignees || []).map((a) => ({
                    id: a.id,
                    src: a.avatarUrl,
                    alt: a.username,
                  })),
                }))}
                onToggleTask={handleToggleTask}
                onClickTask={handleClickTask}
                showFilters={true}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}
