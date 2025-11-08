import { Plus } from "lucide-react";

type TopNavBarProps = {
  title: string;
  onAddClick?: () => void;
  addButtonText?: string;
};

export default function TopNavBar({
  title,
  onAddClick,
  addButtonText = "Add To-Do",
}: TopNavBarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center gap-4 text-gray-900 dark:text-white">
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em]">
          {title}
        </h1>
      </div>
      <button
        onClick={onAddClick}
        className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
      >
        <Plus size={16} />
        <span className="truncate">{addButtonText}</span>
      </button>
    </header>
  );
}
