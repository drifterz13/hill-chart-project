import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Flag,
} from "lucide-react";
import { Link, useLocation } from "react-router";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutGrid size={24} />, href: "/" },
  { label: "My Tasks", icon: <CheckSquare size={24} />, href: "/tasks" },
  { label: "Calendar", icon: <Calendar size={24} />, href: "/calendar" },
  { label: "Reports", icon: <BarChart3 size={24} />, href: "/reports" },
  { label: "Settings", icon: <Settings size={24} />, href: "/settings" },
];

type SidebarProps = {
  userAvatar?: string;
  userName?: string;
  userRole?: string;
};

export default function Sidebar({
  userAvatar = "http://localhost:3001/croc.jpeg",
  userName = "Ben Parker",
  userRole = "Begger",
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-base-200 bg-base-100 flex flex-col p-4">
      <div className="flex items-center gap-3 p-2 mb-4">
        <h1 className="text-base-content text-xl font-bold">
          Progress Tracker
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-base-content/60 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {item.icon}
              <p className="text-sm font-medium">{item.label}</p>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{ backgroundImage: `url("${userAvatar}")` }}
          />
          <div className="flex flex-col">
            <h1 className="text-base-content text-sm font-medium">
              {userName}
            </h1>
            <p className="text-base-content/60 text-xs">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
