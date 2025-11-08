import { LayoutGrid, CheckSquare, Calendar, BarChart3, Settings, Flag } from "lucide-react";
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
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDoxYfv46w79yD92uFxVjqwyfZzjME-GEj_XQVWcsLilAFdd0F8wyF2MJiSU1wyLtgqbq5xPQU1mzNwNefta5hrkSjUM2Dt_A9HQAgC6BzKSq_cSGqaf3hNUg5RpFk_YHpLMhZweZU_kS6y4S7ZrQSqiS24RRp6XBlyQ7pS4_cJJmx0FLlFF1EKmxOAKl2TC9USrhkhwlnT14UQz09Ztwv7l6yutiLMbHvSTbS1T13GqREe7A0uDjumWDTtD_IZVhn6iKmwVpFEwouR",
  userName = "Alex Hartman",
  userRole = "Product Manager",
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 p-2 mb-4">
        <div className="text-blue-500 size-8">
          <Flag size={32} fill="currentColor" />
        </div>
        <h1 className="text-gray-900 dark:text-gray-100 text-xl font-bold">
          HillTrack
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-500/20 text-blue-500"
                  : "text-gray-600 dark:text-gray-400 hover:bg-blue-500/10 hover:text-blue-500"
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
            <h1 className="text-gray-900 dark:text-gray-100 text-sm font-medium">
              {userName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
