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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-base-200 px-6 py-4">
      <div className="flex items-center gap-4 text-base-content">
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em]">
          {title}
        </h1>
      </div>
      <button
        onClick={onAddClick}
        className="btn btn-primary min-w-[84px] h-10 px-4 text-sm font-bold"
      >
        <Plus size={16} />
        <span className="truncate">{addButtonText}</span>
      </button>
    </header>
  );
}
