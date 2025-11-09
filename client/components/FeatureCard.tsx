import { MoreHorizontal, SignalHigh } from "lucide-react";
import AvatarGroup from "./AvatarGroup";
import type { FeatureStage, FeatureStatus } from "../types/feature-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

type FeatureCardProps = {
  id: string;
  title: string;
  description: string;
  status?: FeatureStatus;
  stage: FeatureStage;
  progress?: number;
  avatars?: Avatar[];
  dueDate?: Date;
  onClick?: (id: string | number) => void;
  onMenuClick?: (id: string | number) => void;
};

export default function FeatureCard({
  id,
  title,
  description,
  stage,
  progress,
  avatars = [],
  dueDate,
  onClick,
  onMenuClick,
}: FeatureCardProps) {
  const getStageInfo = (stage?: FeatureStage) => {
    switch (stage) {
      case "uphill":
        return { color: "text-blue-500", label: "Uphill" };
      case "at-peak":
        return { color: "text-green-500", label: "At the peak" };
      case "downhill":
        return { color: "text-green-500", label: "Downhill" };
      default:
        return null;
    }
  };

  const stageInfo = stage ? getStageInfo(stage) : null;

  const getDueDateInfo = (dueDate?: Date) => {
    if (!dueDate) return null;

    if (dayjs().isAfter(dayjs(dueDate))) {
      return `Overdue ${dayjs(dueDate).fromNow()}`;
    }
    if (dayjs().isSame(dayjs(dueDate), "day")) {
      return "Due today";
    }

    return `Due in ${dayjs(dueDate).toNow(true)}`;
  };

  const dueDateInfo = getDueDateInfo(dueDate);

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-md"
      onClick={() => onClick?.(id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-base-content text-base font-semibold leading-normal mb-1">
            {title}
          </p>
          <p className="text-base-content/60 text-sm font-normal">
            {description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(id);
          }}
          className="text-base-content/60 hover:text-primary transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Status or Progress */}
      {stageInfo && (
        <div className="flex items-center gap-2">
          <SignalHigh size={20} className={stageInfo.color} />
          <p className="text-base-content/60 text-sm">{stageInfo.label}</p>
        </div>
      )}

      {progress !== undefined && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-base-content/60">
              Progress
            </span>
            <span className="text-sm font-medium text-base-content/60">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-1.5">
            <progress
              className={`progress progress-primary w-56`}
              value={progress}
              max={100}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {avatars.length > 0 ? (
          <AvatarGroup avatars={avatars} maxVisible={3} />
        ) : (
          <div />
        )}
        {dueDateInfo && (
          <p className="text-base-content/60 text-xs">{dueDateInfo}</p>
        )}
      </div>
    </div>
  );
}
