import { Search, Bell, Plus, ChevronLeft } from "lucide-react";

type TopBarProps = {
  // Left side: either search or title/back
  onSearchChange?: (value: string) => void;
  title?: string;

  // Right side
  onAddClick?: () => void;
  addButtonText?: string;
  userAvatar?: string;
};

export default function TopBar({
  onSearchChange,
  title,
  onAddClick,
  addButtonText = "Add",
  userAvatar = "http://localhost:3001/croc.jpeg",
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-base-200 px-10 py-3 sticky top-0 bg-base-100/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-8">
        {onSearchChange ? (
          <label className="input min-w-40 max-w-sm">
            <Search size={20} className="text-base-content/60" />
            <input
              type="text"
              onChange={(e) => onSearchChange(e.target.value)}
              className="input h-10 text-sm"
              placeholder="Search projects..."
            />
          </label>
        ) : (
          <div className="flex items-center gap-4 text-base-content">
            {title && (
              <h1 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                {title}
              </h1>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 justify-end gap-4 items-center">
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="btn btn-primary min-w-[84px] h-10 px-4 text-sm font-bold"
          >
            <Plus size={16} />
            <span className="truncate">{addButtonText}</span>
          </button>
        )}
        <button className="btn btn-ghost btn-circle">
          <Bell size={20} />
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
          style={{ backgroundImage: `url("${userAvatar}")` }}
        />
      </div>
    </header>
  );
}

