import React from "react";
import clsx from "clsx";

interface LoadingIndicatorProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
  "aria-label"?: string;
}

const CustomLoading: React.FC<LoadingIndicatorProps> = ({
  text = "잠시만 기다려주세요...",
  fullScreen = true,
  className,
  "aria-label": ariaLabel,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        "bg-white text-gray-600",
        fullScreen ? "w-screen h-screen fixed top-0 left-0 z-50" : "w-full h-full",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || text}
    >
      {/* 로딩 스피너 */}
      <div 
        className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" 
        aria-hidden="true"
      />

      {/* 텍스트 */}
      <p className="text-base" aria-live="polite">
        {text}
      </p>
    </div>
  );
};

export default CustomLoading;
