import { ChevronDownIcon } from "lucide-react";

type FilterDropdownProps = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-base">
        <ChevronDownIcon size={14} />
      </span>
    </div>
  );
}
