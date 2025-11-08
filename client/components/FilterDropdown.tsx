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
        className="select"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
