import { Search, Bell } from "lucide-react";

type DashboardTopBarProps = {
  userAvatar?: string;
  onSearchChange?: (value: string) => void;
};

export default function DashboardTopBar({
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_PaApwm1XJawmLGwBzHVr6prkpQPvjw9xfAv0AB5LKOKt1-zlai9ogcaiZOCOxOX2iWDOIJF8MoIMXem6QEq-NOY15IAWxKtE02lJ7AAuy6ndxfS7dN4S52TnEz4CWBr9kmfhZYetO2K-yrEVA1AQXiq4hFR-qIW4Z7ewYzpF9OpbSXfo511lM3WNISQBccAG-8MNp8slwy_JxwbERXGGahwj6q89G0rjDsSQaalPuAoKtFMTtOiAWIsW9skTV99JSFKiAzNKwOaG",
  onSearchChange,
}: DashboardTopBarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-8">
        <label className="relative flex flex-col min-w-40 max-w-sm">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          />
          <input
            type="text"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-10 pr-4 text-sm font-normal"
            placeholder="Search projects..."
          />
        </label>
      </div>

      <div className="flex flex-1 justify-end gap-4 items-center">
        <button className="flex items-center justify-center rounded-lg h-10 w-10 text-gray-600 dark:text-gray-400 hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
          <Bell size={24} />
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
          style={{ backgroundImage: `url("${userAvatar}")` }}
        />
      </div>
    </header>
  );
}
