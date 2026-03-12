"use client";

import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Header가 숨겨지는 경로 목록
  const hiddenHeaderRoutes = ["/login", "/signup"];
  const isHeaderHidden = hiddenHeaderRoutes.includes(pathname);

  return (
    <div className={isHeaderHidden ? "" : "pt-16 bg-white"}>
      {children}
    </div>
  );
}
