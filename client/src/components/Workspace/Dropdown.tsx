import { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  nodeLabel?: string;
  onValueChange?: (nodeLabel: string, value: string) => void;
}

export default function Dropdown({
  label,
  options,
  nodeLabel,
  onValueChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (nodeLabel && onValueChange) {
      onValueChange(nodeLabel, option);
    }
  };

  return (
    <div className="relative inline-block text-left cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-1 
                   bg-white/90 backdrop-blur-md border border-gray-300 
                   rounded-sm shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="truncate text-gray-600 font-medium text-[6px]">
          {selected || label}
        </span>

        <span
          className={`ml-2 transform text-[8px] transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute z-20 mt-2 bg-white/95 backdrop-blur-md 
                     border border-gray-200 rounded-xl shadow-lg 
                     animate-fadeIn overflow-hidden"
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full text-left text-[6px] px-4 py-2 text-gray-700 
                         hover:bg-cyan-100 hover:text-cyan-700 
                         transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
