import React from "react";
import clsx from "clsx";

type DividerVariant = "horizontal" | "vertical";

interface CustomDividerProps {
  variant?: DividerVariant;
  width?: string;      // Tailwind width 클래스 (예: "w-1/2", "w-[2px]")
  height?: string;     // Tailwind height 클래스 (예: "h-10", "h-[1px]")
  bgColor?: string;    // 배경색 클래스 (예: "bg-gray-400")
  margin?: string;     // 마진 클래스 (예: "my-4" or "mx-2")
  className?: string;  // 추가 클래스
}

const CustomDivider: React.FC<CustomDividerProps> = ({
  variant = "horizontal",
  width,
  height,
  bgColor = "bg-gray-200",
  margin,
  className,
}) => {
  const baseClass = clsx(
    "shrink-0",
    variant === "horizontal"
      ? clsx(width || "w-full", height || "h-[1px]")
      : clsx(width || "w-[1px]", height || "h-screen"),
    bgColor,
    margin,
    className
  );

  return <div className={baseClass} />;
};

export default CustomDivider;
