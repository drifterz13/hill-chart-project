import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, X, HelpCircle, CheckCircle } from "lucide-react";
import { FeatureApi } from "../api/feature-api";

type FormTask = {
  id: string;
  title: string;
};

export default function CreateFeaturePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [tasks, setTasks] = useState<FormTask[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [createdFeatureId, setCreatedFeatureId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!featureName.trim()) {
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;

    const newTask: FormTask = {
      id: Date.now().toString(),
      title: taskInput,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCreateFeature = async () => {
    setIsCreating(true);

    try {
      const { id } = await FeatureApi.createFeatureWithTasks({
        name: featureName,
        description: featureDescription || undefined,
        tasks: tasks.map((task) => ({ title: task.title })),
      });

      setCreatedFeatureId(id);
      setStep(3);
    } catch (error) {
      console.error("Failed to create feature:", error);
      alert("Failed to create feature. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleBack = () => {
    setStep(1);
  };

  // Step 1: Feature Details
  if (step === 1) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-base-100">
        <div className="w-full max-w-2xl">
          {/* Page Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-base-content">
              Create a new feature
            </h1>
            <p className="mt-2 text-base leading-normal text-base-content/60">
              Give your new feature a name and a brief description to get
              started.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
            {/* Feature Name TextField */}
            <div>
              <label
                htmlFor="feature-name"
                className="block pb-2 text-base font-medium text-base-content"
              >
                Feature Name
              </label>
              <input
                id="feature-name"
                type="text"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                autoFocus
                required
                className="input input-bordered h-12 w-full"
                placeholder="e.g., Q4 Marketing Campaign"
              />
            </div>

            {/* Feature Description TextField */}
            <div>
              <label
                htmlFor="feature-description"
                className="block pb-2 text-base font-medium text-base-content"
              >
                Feature Description (optional)
              </label>
              <textarea
                id="feature-description"
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                className="textarea textarea-bordered min-h-36 w-full"
                placeholder="e.g., A short summary of what this feature is about..."
              />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-base-200" />

            {/* Button Group */}
            <div className="flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline h-12 w-full min-w-[84px] px-5 text-base font-bold sm:w-auto"
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary h-12 w-full min-w-[84px] px-5 text-base font-bold sm:w-auto"
              >
                <span className="truncate">Continue</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Success Screen
  if (step === 3) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-base-100 overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="layout-content-container flex flex-col max-w-2xl flex-1 items-center text-center px-4 py-8">
              {/* Success Icon */}
              <div className="flex items-center justify-center w-24 h-24 bg-success/20 rounded-full mb-8">
                <CheckCircle size={60} className="text-success" />
              </div>

              {/* Page Heading */}
              <div className="flex flex-wrap justify-center gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <h1 className="text-base-content text-4xl font-black leading-tight tracking-[-0.033em]">
                    Feature Created Successfully!
                  </h1>
                  <p className="text-base-content/60 text-base font-normal leading-normal">
                    Your new feature is set up and ready to go.
                  </p>
                </div>
              </div>

              {/* Card */}
              <div className="p-4 w-full max-w-lg mt-4">
                <div className="flex flex-col items-stretch justify-start rounded-xl bg-base-100 border border-base-200 p-6">
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 text-left">
                    <p className="text-base-content text-lg font-bold leading-tight tracking-[-0.015em]">
                      {featureName}
                    </p>
                    <div className="flex items-end gap-3 justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-base-content/60 text-base font-normal leading-normal">
                          {featureDescription ||
                            "A brief summary of the feature you just created."}
                        </p>
                        <p className="text-base-content/60 text-base font-normal leading-normal">
                          Initial Tasks: {tasks.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Group */}
              <div className="flex justify-center w-full mt-8">
                <div className="flex flex-1 gap-4 flex-wrap px-4 py-3 max-w-lg justify-center sm:flex-nowrap">
                  <button
                    onClick={() => navigate(`/features/${createdFeatureId}`)}
                    className="btn btn-primary min-w-[84px] w-full sm:w-auto h-12 px-5 text-base font-bold grow"
                  >
                    <span className="truncate">Go to Feature</span>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-outline min-w-[84px] w-full sm:w-auto h-12 px-5 text-base font-bold grow"
                  >
                    <span className="truncate">Back to Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Step 2: Add Tasks
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-base-100">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="mx-auto flex max-w-2xl flex-col">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 pb-8">
              <button
                onClick={handleBack}
                className="text-base-content/60 text-sm font-medium hover:text-primary transition-colors"
              >
                Create Feature
              </button>
              <span className="text-base-content/60 text-sm font-medium">
                /
              </span>
              <span className="text-base-content text-sm font-medium">
                Add Tasks
              </span>
            </div>

            {/* Feature Title */}
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-3xl font-black tracking-tighter sm:text-4xl text-base-content">
                {featureName}
              </h2>
              <p className="text-base-content/60 text-base">
                What are the first few things that need to get done?
              </p>
            </div>

            {/* Task Form */}
            <div className="flex flex-col gap-6 rounded-lg border border-base-200 bg-base-100 p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-medium pb-2 text-base-content">
                    Task Name
                  </p>
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                    className="input input-bordered w-full h-12"
                    placeholder="e.g., Design the user interface"
                  />
                </label>
                <button
                  onClick={handleAddTask}
                  className="btn btn-primary min-w-[84px] h-12 px-5 gap-2 text-base font-bold"
                >
                  <Plus size={20} />
                  <span className="truncate">Add Task</span>
                </button>
              </div>

              {/* Task List or Empty State */}
              {tasks.length > 0 ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-base-200">
                  <h3 className="text-base font-bold text-base-content">
                    To-Do Items ({tasks.length})
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between rounded-lg bg-base-200 p-3"
                      >
                        <span className="text-sm font-medium text-base-content">
                          {task.title}
                        </span>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-base-content/60 hover:text-error transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border-t border-base-200">
                  <Plus size={40} className="text-base-content/60 mb-2" />
                  <p className="text-sm font-medium text-base-content/60">
                    Add your first task above to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-3 pt-8">
              <button
                onClick={handleCreateFeature}
                disabled={isCreating}
                className="btn btn-primary min-w-[84px] h-12 px-5 flex-1 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {isCreating ? "Creating..." : "Create Feature"}
                </span>
              </button>
              <button
                onClick={handleBack}
                disabled={isCreating}
                className="btn btn-outline min-w-[84px] h-12 px-5 flex-1 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">Back</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
