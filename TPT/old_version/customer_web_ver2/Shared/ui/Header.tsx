"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";
import CustomButton from "./CustomButton";

const SidebarOverlay = ({ onClose }: { onClose: () => void }) => {
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);

  useEffect(() => {
    const root = document.getElementById("portal-root");
    setPortalRoot(root);
  }, []);

  if (!portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
    >
      <div
        className="fixed top-0 left-0 h-full bg-white w-1/4 shadow-md z-50 p-4"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 버블 방지
      >
        <h2 className="text-lg font-semibold mb-4">사이드바</h2>
        <ul className="flex flex-col gap-2">
          <li><Link href="/">홈</Link></li>
          <li><Link href="/about">소개</Link></li>
          <li><Link href="/contact">문의</Link></li>
        </ul>
      </div>
    </div>,
    portalRoot
  );
};

const Header = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 헤더를 숨길 경로 목록
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-16 flex items-center justify-between px-4">
        <button onClick={() => setIsSidebarOpen(true)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <CustomButton variant="normalFull" padding="p-1 text-sm">로그인</CustomButton>
          </Link>
          <Link href="/register">
            <CustomButton variant="normalClean" padding="p-1 text-sm">회원가입</CustomButton>
          </Link>
        </div>
      </header>

      {isSidebarOpen && <SidebarOverlay onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Header;
