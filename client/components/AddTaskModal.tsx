import { useState, useEffect } from "react";
import Modal from "./Modal";
import { ChevronDown } from "lucide-react";
import { AssigneeApi } from "../api/assignee-api";
import type { Assignee } from "../types/task-types";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    assigneeIds: number[];
    dueDate?: string;
  }) => void;
};

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [assignees, setAssignees] = useState<Assignee[]>([]);

  useEffect(() => {
    if (isOpen) {
      AssigneeApi.getAssignees()
        .then(setAssignees)
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    onSubmit({
      title: taskName,
      assigneeIds: selectedAssigneeIds,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTaskName("");
    setSelectedAssigneeIds([]);
    setDueDate("");
  };

  const handleCancel = () => {
    // Reset form
    setTaskName("");
    setSelectedAssigneeIds([]);
    setDueDate("");
    onClose();
  };

  const handleAssigneeChange = (assigneeId: number) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId],
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Task">
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
        <div className="flex flex-col min-w-40 flex-1">
          <p className="text-slate-800 dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Assign to
          </p>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3">
            {assignees.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Loading assignees...
              </p>
            ) : (
              assignees.map((assignee) => (
                <label
                  key={assignee.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssigneeIds.includes(assignee.id)}
                    onChange={() => handleAssigneeChange(assignee.id)}
                    className="w-4 h-4 text-blue-500 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-slate-900 dark:text-slate-200 text-sm">
                    {assignee.username}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

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
