import { MoreHorizontal, SignalHigh } from "lucide-react";
import AvatarGroup from "./AvatarGroup";

type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

type ProjectStatus = "uphill" | "peak" | "downhill";

type ProjectCardProps = {
  id: string | number;
  title: string;
  description: string;
  status?: ProjectStatus;
  progress?: number;
  avatars?: Avatar[];
  dueDate?: string;
  onClick?: (id: string | number) => void;
  onMenuClick?: (id: string | number) => void;
};

export default function ProjectCard({
  id,
  title,
  description,
  status,
  progress,
  avatars = [],
  dueDate,
  onClick,
  onMenuClick,
}: ProjectCardProps) {
  const getStatusInfo = (status?: ProjectStatus) => {
    switch (status) {
      case "uphill":
        return { color: "text-blue-500", label: "Uphill" };
      case "peak":
        return { color: "text-green-500", label: "At the peak" };
      case "downhill":
        return { color: "text-green-500", label: "Downhill" };
      default:
        return null;
    }
  };

  const statusInfo = status ? getStatusInfo(status) : null;

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-900 dark:text-gray-100 text-base font-semibold leading-normal mb-1">
            {title}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
            {description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(id);
          }}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Status or Progress */}
      {statusInfo ? (
        <div className="flex items-center gap-2">
          <SignalHigh size={20} className={statusInfo.color} />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {statusInfo.label}
          </p>
        </div>
      ) : progress !== undefined ? (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {avatars.length > 0 ? (
          <AvatarGroup avatars={avatars} maxVisible={3} />
        ) : (
          <div />
        )}
        {dueDate && (
          <p className="text-gray-600 dark:text-gray-400 text-xs">{dueDate}</p>
        )}
      </div>
    </div>
  );
}
