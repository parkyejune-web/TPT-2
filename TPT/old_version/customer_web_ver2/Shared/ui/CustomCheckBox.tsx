import React from "react";
import clsx from "clsx";

type CheckBoxSize = "sm" | "md" | "lg";

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: CheckBoxSize;
  className?: string;
}

// 크기에 따른 클래스 매핑
const sizeClasses = {
  sm: {
    box: "w-4 h-4",
    icon: "w-2.5 h-2.5",
  },
  md: {
    box: "w-5 h-5",
    icon: "w-3 h-3",
  },
  lg: {
    box: "w-6 h-6",
    icon: "w-4 h-4",
  },
};

const CustomCheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = "md",
  className,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label
      className={clsx(
        "flex items-center gap-2 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div
        onClick={handleToggle}
        className={clsx(
          "flex items-center justify-center rounded border transition-all",
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-400",
          sizeClasses[size].box,
          disabled && "pointer-events-none"
        )}
      >
        {checked && (
          <svg
            className={clsx(sizeClasses[size].icon, "text-white")}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {label && <span>{label}</span>}
    </label>
  );
};

export default CustomCheckBox;
