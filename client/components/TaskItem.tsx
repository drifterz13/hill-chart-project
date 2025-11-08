import AvatarGroup from "./AvatarGroup";
import dayjs from "dayjs";

type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

type TaskItemProps = {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignees?: Avatar[];
  onToggle?: (id: number, completed: boolean) => void;
  onClick?: (id: number) => void;
};

export default function TaskItem({
  id,
  title,
  completed,
  dueDate,
  assignees = [],
  onToggle,
  onClick,
}: TaskItemProps) {
  const getDueDateStyle = () => {
    if (completed) {
      return "text-success bg-success/10";
    }

    if (!dueDate) {
      return "text-base-content/60 bg-base-200";
    }

    // Check if overdue (simple date comparison)
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today && !completed) {
      return "text-warning bg-warning/10 font-medium";
    }

    return "text-base-content/60 bg-base-200";
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-base-200 hover:bg-base-200 transition-colors ${
        completed
          ? "bg-base-200/50"
          : "bg-base-100"
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onToggle?.(id, e.target.checked)}
        className="checkbox checkbox-primary"
      />
      <span
        onClick={() => onClick?.(id)}
        className={`flex-1 font-medium cursor-pointer ${
          completed
            ? "text-base-content/50 line-through"
            : "text-base-content hover:text-primary"
        }`}
      >
        {title}
      </span>
      {assignees.length > 0 && <AvatarGroup avatars={assignees} />}
      {dueDate && (
        <span
          className={`text-sm px-2.5 py-1 rounded-full ${getDueDateStyle()}`}
        >
          {dayjs(dueDate).format("MMM D")}
        </span>
      )}
    </div>
  );
}
