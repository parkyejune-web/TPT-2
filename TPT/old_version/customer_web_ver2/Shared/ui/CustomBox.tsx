import React from "react";
import clsx from "clsx";

type BoxVariant = "card" | "panel" | "transparent";

interface BoxProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  bgColor?: string;
  opacity?: string;
  textColor?: string;
  textSize?: string;
  borderRadius?: string;
  textAlign?: string; // e.g., "text-center"
  flexAlign?: string; // e.g., "items-center justify-center"
  visible?: boolean;
  hover?: string;
  scrollX?: boolean;
  scrollY?: boolean;
  variant?: BoxVariant;
  children: React.ReactNode;
  className?: string;
}

// Figma 참고
const variantStyles: Record<BoxVariant, string> = {
  card: "bg-white shadow-md rounded-lg p-4",
  panel: "bg-gray-100 border border-gray-300 rounded-md p-3",
  transparent: "bg-transparent",
};

export default function CustomBox({
  width,
  height,
  padding,
  margin,
  bgColor,
  opacity,
  textColor,
  textSize,
  borderRadius,
  textAlign,
  flexAlign,
  visible = true,
  hover,
  scrollX = false,
  scrollY = false,
  variant,
  children,
  className,
}: BoxProps) {
  const baseClass = clsx(
    "transition-all",
    "cursor-default", // 기본 박스는 클릭 안된다고 가정
    width,
    height,
    padding,
    margin,
    bgColor,
    opacity,
    textColor,
    textSize,
    borderRadius,
    textAlign,
    flexAlign,
    hover,
    scrollX && "overflow-x-auto",
    scrollY && "overflow-y-auto",
    !visible && "hidden",
    variant && variantStyles[variant],
    className
  );

  return <div className={baseClass}>{children}</div>;
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
