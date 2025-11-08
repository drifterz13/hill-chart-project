import { Search, Bell } from "lucide-react";

type DashboardTopBarProps = {
  userAvatar?: string;
  onSearchChange?: (value: string) => void;
};

export default function DashboardTopBar({
  userAvatar = "http://localhost:3001/croc.jpeg",
  onSearchChange,
}: DashboardTopBarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-base-200 px-10 py-3 sticky top-0 bg-base-100/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-8">
        <label className="input min-w-40 max-w-sm">
          <Search size={20} className="text-base-content/60" />
          <input
            type="text"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="input h-10 text-sm"
            placeholder="Search projects..."
          />
        </label>
      </div>

      <div className="flex flex-1 justify-end gap-4 items-center">
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
