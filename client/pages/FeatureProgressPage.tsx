import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TaskApi } from "../api/task-api";
import { FeatureApi } from "../api/feature-api";
import type { Task } from "../types/task-types";
import type { Feature } from "../types/feature-types";
import TopNavBar from "../components/TopNavBar";
import HillChart from "../components/HillChart";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";

export default function FeatureProgressPage() {
  const navigate = useNavigate();
  const { featureId } = useParams<{ featureId: string }>();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!featureId) return;

    let ignore = false;
    const id = +featureId;

    Promise.all([FeatureApi.getFeature(id), TaskApi.getTasksByFeatureId(id)])
      .then(([featureData, tasksData]) => {
        if (!ignore) {
          setFeature(featureData);
          setTasks(tasksData);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [featureId]);

  const handlePositionChange = async (id: number, position: number) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, position } : task)),
    );

    try {
      await TaskApi.updateTaskPosition(id, position);
    } catch (error) {
      console.error("Failed to update task position:", error);
      // Revert on error
      if (featureId) {
        const tasksData = await TaskApi.getTasksByFeatureId(+featureId);
        setTasks(tasksData);
      }
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task)),
    );

    try {
      await TaskApi.updateTask(id, { completed });
    } catch (error) {
      console.error("Failed to update task:", error);
      // Revert on error
      if (featureId) {
        const tasksData = await TaskApi.getTasksByFeatureId(+featureId);
        setTasks(tasksData);
      }
    }
  };

  const handleClickTask = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitTask = async (newTask: {
    title: string;
    assigneeIds: number[];
    dueDate?: string;
  }) => {
    if (!featureId) return;

    try {
      await TaskApi.createTask(+featureId, {
        title: newTask.title,
        assigneeIds: newTask.assigneeIds,
        dueDate: newTask.dueDate,
      });

      // Refresh tasks list
      const tasksData = await TaskApi.getTasksByFeatureId(+featureId);
      setTasks(tasksData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col bg-base-100">
        <div className="layout-container flex h-full grow flex-col items-center">
          <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="layout-content-container flex flex-col w-full bg-base-100 rounded-xl border border-base-200 shadow-sm">
              <TopNavBar
                title={feature?.name ?? "Loading..."}
                onAddClick={handleAddTask}
                addButtonText="Add Task"
              />

              <main className="flex flex-col p-6 space-y-8">
                {/* Hill Chart Section */}
                <section>
                  <h2 className="text-base-content text-[22px] font-bold leading-tight tracking-[-0.015em] pb-2">
                    Progress Overview
                  </h2>
                  <p className="text-base-content/60 text-base font-normal leading-normal pb-4">
                    The left side of the hill is for 'Figuring things out,' and
                    the right side is for 'Making it happen.' Drag dots to
                    update task progress.
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
                    assignees: task.assignees.map((a) => ({
                      id: a.id,
                      src: a.avatarUrl,
                      alt: a.username,
                    })),
                  }))}
                  onToggleTask={handleToggleTask}
                  onClickTask={handleClickTask}
                  showFilters={true}
                />
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
    </>
  );
}
