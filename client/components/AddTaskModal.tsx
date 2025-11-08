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
          <p className="text-base-content text-base font-medium leading-normal pb-2">
            Task Name
          </p>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="input input-bordered w-full h-12"
            placeholder="e.g., Design the new dashboard"
            required
          />
        </label>

        {/* Assign to */}
        <div className="flex flex-col min-w-40 flex-1">
          <p className="text-base-content text-base font-medium leading-normal pb-2">
            Assign to
          </p>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto rounded-lg border border-base-200 bg-base-100 p-3">
            {assignees.length === 0 ? (
              <p className="text-base-content/60 text-sm">
                Loading assignees...
              </p>
            ) : (
              assignees.map((assignee) => (
                <label
                  key={assignee.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssigneeIds.includes(assignee.id)}
                    onChange={() => handleAssigneeChange(assignee.id)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-base-content text-sm">
                    {assignee.username}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Due Date */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-base-content text-base font-medium leading-normal pb-2">
            Due Date
          </p>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input input-bordered w-full h-12"
            placeholder="Select a date"
          />
        </label>

        {/* Action Buttons */}
        <div className="flex flex-1 gap-3 flex-wrap pt-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-outline min-w-[84px] h-11 px-5 text-base font-bold"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button
            type="submit"
            className="btn btn-primary min-w-[84px] h-11 px-5 text-base font-bold"
          >
            <span className="truncate">Add Task</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
