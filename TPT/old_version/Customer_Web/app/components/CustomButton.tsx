// npm install clsx 설치해야 합니당 
// variant 종류: normal, disable, error, success, highlight, danger...

import React from "react";
import clsx from "clsx";

type ButtonVariant =
  | "normalFull"
  | "normalClean"
  | "danger"
  | "disable"
  | "disableSimple"
  | "redFull"
  | "redClean"
  | "prettyFull"
  | "onlyText"
  | "simpleBlack";

interface ButtonProps {
  width?: string;
  height?: string;
  padding?: string; // px, py 여기서 한번에 지정하기 
  margin?: string;
  bgColor?: string;
  textColor?: string;
  textSize?: string;
  border?: string;
  borderRadius?: string;
  align?: string; // e.g., "text-center", "text-left"
  opacity?: string; // e.g., "opacity-50"
  disabled?: boolean;
  onClick?: () => void;
  hover?: string; // e.g., "hover:bg-blue-700"
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string; // 추가 확장용
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-pressed"?: boolean;
  role?: string;
}

// 커스텀 스타일링 (variant)
// Figma 참고 
const variantStyles: Record<ButtonVariant, string> = {
  normalFull: "bg-blue-600 text-white px-2 py-1 rounded-lg focus:outline-none",
  normalClean: "bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600 px-2 py-1 rounded-lg focus:outline-none",
  danger: "bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded-lg",
  disable: "bg-gray-300 text-white hover:bg-gray-600 px-2 py-1 rounded-lg",
  disableSimple: "bg-transparent text-gray-300 px-2 py-1 rounded-lg",
  redFull: "bg-[#EF5555] text-white px-2 py-1 rounded-lg focus:outline-none",
  redClean: "bg-transparent text-[#EF5555] border border-[#EF5555] px-2 py-1 rounded-md focus:outline-none",
  prettyFull: "bg-[#E2E2FF] text-[#2626C3] p-2 rounded-lg focus:outline-none",
  onlyText: "border-none bg-transparent text-black text-sm font-bold focus:outline-none",
  simpleBlack: "bg-transparent text-black border border-black px-2 py-1 rounded-md focus:outline-none"
};

export default function CustomButton({
  width,
  height,
  padding,
  margin,
  bgColor,
  textColor,
  textSize,
  border,
  borderRadius,
  align,
  opacity,
  disabled = false,
  onClick,
  hover,
  variant,
  children,
  className,
  type = "button",
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  "aria-pressed": ariaPressed,
  role,
}: ButtonProps) {
  const baseClass = clsx(
    "inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
    width,
    height,
    padding,
    margin,
    bgColor,
    textColor,
    textSize,
    border,
    borderRadius,
    align,
    opacity,
    hover,
    variant ? variantStyles[variant] : "",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  );

  return (
    <button
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-pressed={ariaPressed}
      role={role}
      style={style}
    >
      {children}
    </button>
  );
}

/*
반응형으로 활용하는 예시:
<Box
  width="sm:w-1/2 md:w-full lg:w-1/3 xl:w-1/4"
  padding="sm:p-4 md:p-6 lg:p-8"
  margin="sm:m-2 md:m-4 lg:m-6 xl:m-8"
  bgColor="bg-gray-200"
  textColor="text-gray-800"
  textAlign="text-center"
  borderRadius="rounded-lg"
  hover="hover:bg-gray-300"
>
  반응형 박스 컴포넌트
</Box>
*/
