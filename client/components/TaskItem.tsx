import AvatarGroup from "./AvatarGroup";

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
      return "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/50";
    }

    if (!dueDate) {
      return "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }

    // Check if overdue (simple date comparison)
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today && !completed) {
      return "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50 font-medium";
    }

    return "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        completed
          ? "bg-gray-50 dark:bg-gray-800/30"
          : "bg-white dark:bg-gray-800/50"
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onToggle?.(id, e.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
      />
      <span
        onClick={() => onClick?.(id)}
        className={`flex-1 font-medium cursor-pointer ${
          completed
            ? "text-gray-500 dark:text-gray-500 line-through"
            : "text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
        }`}
      >
        {title}
      </span>
      {assignees.length > 0 && <AvatarGroup avatars={assignees} />}
      {dueDate && (
        <span className={`text-sm px-2.5 py-1 rounded-full ${getDueDateStyle()}`}>
          {dueDate}
        </span>
      )}
    </div>
  );
}
