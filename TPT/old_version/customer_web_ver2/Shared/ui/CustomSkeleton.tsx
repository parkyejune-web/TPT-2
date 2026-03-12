import React from "react";
import clsx from "clsx";

type SkeletonVariant = "text" | "rect" | "circle";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;        // 예: "w-full", "w-1/2", "w-[200px]"
  height?: string;       // 예: "h-4", "h-[50px]"
  borderRadius?: string; // 예: "rounded-md"
  bgColor?: string;      // 예: "bg-gray-200"
  animated?: boolean;
  repeat?: number;
  className?: string;
}

const CustomSkeleton: React.FC<SkeletonProps> = ({
  variant = "rect",
  width = "w-full",
  height = "h-4",
  borderRadius,
  bgColor = "bg-gray-200",
  animated = true,
  repeat = 1,
  className,
}) => {
  const baseClasses = clsx(
    width,
    height,
    bgColor,
    animated && "animate-pulse",
    variant === "text" && "rounded",
    variant === "rect" && (borderRadius || "rounded-md"),
    variant === "circle" && "rounded-full",
    className
  );

  return (
    <>
      {Array.from({ length: repeat }).map((_, index) => (
        <div key={index} className={baseClasses} />
      ))}
    </>
  );
};

export default CustomSkeleton;
