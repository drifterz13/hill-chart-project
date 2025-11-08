export type Avatar = {
  id: string | number;
  src: string;
  alt: string;
};

type AvatarProps = {
  avatar: Avatar;
};

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function getRandomColor(id: string | number): string {
  const hash = String(id).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % colors.length;
  return colors[index]!;
}

export default function Avatar({ avatar }: AvatarProps) {
  const randomColor = getRandomColor(avatar.id);

  return (
    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-800 ${randomColor}`}>
      <img
        className="h-full w-full rounded-full object-cover opacity-90"
        src={avatar.src}
        alt={avatar.alt}
      />
    </div>
  );
}