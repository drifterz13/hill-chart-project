import Avatar from './Avatar';
import type { Avatar as AvatarType } from './Avatar';

type AvatarGroupProps = {
  avatars: AvatarType[];
  maxVisible?: number;
};

export default function AvatarGroup({
  avatars,
  maxVisible = 3,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = Math.max(0, avatars.length - maxVisible);

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar) => (
        <Avatar key={avatar.id} avatar={avatar} />
      ))}
      {remainingCount > 0 && (
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
