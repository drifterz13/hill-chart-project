import { useState } from "react";
import Modal from "./Modal";
import { Calendar, ChevronDown } from "lucide-react";

type AddTodoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: {
    title: string;
    assignee: string;
    dueDate: string;
  }) => void;
};

export default function AddTodoModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTodoModalProps) {
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    onSubmit({
      title: taskName,
      assignee,
      dueDate,
    });

    // Reset form
    setTaskName("");
    setAssignee("");
    setDueDate("");
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setTaskName("");
    setAssignee("");
    setDueDate("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New To-Do">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Task Name */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-slate-800 dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Task Name
          </p>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-base font-normal leading-normal"
            placeholder="e.g., Design the new dashboard"
            required
          />
        </label>

        {/* Assign to */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-slate-800 dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Assign to
          </p>
          <div className="relative">
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-base font-normal leading-normal pr-10"
            >
              <option value="">Select a team member</option>
              <option value="Alex Johnson">Alex Johnson</option>
              <option value="Maria Garcia">Maria Garcia</option>
              <option value="James Smith">James Smith</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
              <ChevronDown size={20} />
            </div>
          </div>
        </label>

        {/* Due Date */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-slate-800 dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Due Date
          </p>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-base font-normal leading-normal"
            placeholder="Select a date"
          />
        </label>

        {/* Action Buttons */}
        <div className="flex flex-1 gap-3 flex-wrap pt-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button
            type="submit"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-blue-500 hover:bg-blue-600 text-slate-50 text-base font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Add Task</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
