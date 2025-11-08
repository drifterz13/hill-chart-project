import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, X, HelpCircle, CheckCircle } from "lucide-react";

type Task = {
  id: string;
  title: string;
};

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskInput,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCreateProject = () => {
    // TODO: Call API to create project with tasks
    console.log("Creating project:", {
      name: projectName,
      description: projectDescription,
      tasks,
    });

    // Move to step 3 (success screen)
    setStep(3);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleBack = () => {
    setStep(1);
  };

  // Step 1: Project Details
  if (step === 1) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-2xl">
          {/* Page Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              Create a new project
            </h1>
            <p className="mt-2 text-base leading-normal text-slate-600 dark:text-slate-400">
              Give your new project a name and a brief description to get
              started.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
            {/* Project Name TextField */}
            <div>
              <label
                htmlFor="project-name"
                className="block pb-2 text-base font-medium text-slate-900 dark:text-slate-100"
              >
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                required
                className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white p-3 text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-0 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="e.g., Q4 Marketing Campaign"
              />
            </div>

            {/* Project Description TextField */}
            <div>
              <label
                htmlFor="project-description"
                className="block pb-2 text-base font-medium text-slate-900 dark:text-slate-100"
              >
                Project Description (optional)
              </label>
              <textarea
                id="project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="form-input flex min-h-36 w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg border border-slate-300 bg-white p-3 text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-0 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="e.g., A short summary of what this project is about..."
              />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

            {/* Button Group */}
            <div className="flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800 sm:w-auto transition-colors"
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                type="submit"
                className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-blue-500 px-5 text-base font-bold leading-normal tracking-[0.015em] text-white hover:bg-blue-600 sm:w-auto transition-colors"
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
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="layout-content-container flex flex-col max-w-2xl flex-1 items-center text-center px-4 py-8">
              {/* Success Icon */}
              <div className="flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-8">
                <CheckCircle size={60} className="text-green-500" />
              </div>

              {/* Page Heading */}
              <div className="flex flex-wrap justify-center gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <h1 className="text-slate-900 dark:text-slate-50 text-4xl font-black leading-tight tracking-[-0.033em]">
                    Project Created Successfully!
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                    Your new project is set up and ready to go.
                  </p>
                </div>
              </div>

              {/* Card */}
              <div className="p-4 w-full max-w-lg mt-4">
                <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 text-left">
                    <p className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em]">
                      {projectName}
                    </p>
                    <div className="flex items-end gap-3 justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                          {projectDescription ||
                            "A brief summary of the project you just created."}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
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
                    onClick={() => navigate("/projects/1")}
                    className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-500 text-white text-base font-bold leading-normal tracking-[0.015em] grow transition-colors hover:bg-blue-600"
                  >
                    <span className="truncate">Go to Project</span>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 text-base font-bold leading-normal tracking-[0.015em] grow transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
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
    <div className="relative flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between whitespace-nowrap px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 text-blue-500">
                <HelpCircle size={32} />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Project Creation
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-white text-sm font-bold hover:bg-blue-500/20 transition-colors">
                <span>Help</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="mx-auto flex max-w-2xl flex-col">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 pb-8">
              <button
                onClick={handleBack}
                className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                Create Project
              </button>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                /
              </span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Add Tasks
              </span>
            </div>

            {/* Project Title */}
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-3xl font-black tracking-tighter sm:text-4xl text-gray-900 dark:text-white">
                {projectName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                What are the first few things that need to get done?
              </p>
            </div>

            {/* Task Form */}
            <div className="flex flex-col gap-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-medium pb-2 text-gray-900 dark:text-gray-100">
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
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-500 h-12 placeholder:text-gray-600 dark:placeholder:text-gray-400 px-4 text-base"
                    placeholder="e.g., Design the user interface"
                  />
                </label>
                <button
                  onClick={handleAddTask}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-500 text-white gap-2 text-base font-bold transition-opacity hover:opacity-90"
                >
                  <Plus size={20} />
                  <span className="truncate">Add Task</span>
                </button>
              </div>

              {/* Task List or Empty State */}
              {tasks.length > 0 ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    To-Do Items ({tasks.length})
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900 p-3"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {task.title}
                        </span>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border-t border-gray-200 dark:border-gray-700">
                  <Plus size={40} className="text-gray-600 dark:text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Add your first task above to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-3 pt-8">
              <button
                onClick={handleCreateProject}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-blue-500 text-white text-base font-bold transition-opacity hover:opacity-90"
              >
                <span className="truncate">Create Project</span>
              </button>
              <button
                onClick={handleBack}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 text-base font-bold transition-colors"
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
