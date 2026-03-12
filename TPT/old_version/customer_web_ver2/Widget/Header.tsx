"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "../Shared/ui/CustomButton";
import CustomModal from "../Shared/ui/CustomModal";
import { useAuthStore } from "../Shared/store/authStore";

// 메뉴 항목 타입 정의
type MenuItem = {
  label: string;
  path?: string;
  submenu?: { label: string; path: string }[];
};

// 메뉴 구성
const menuItems: MenuItem[] = [
  { label: "BRAND", path: "/menu/about" },
  {
    label: "TPT 서비스",
    submenu: [
      { label: "매매일지 작성하기", path: "/my/feedback-request" },
      { label: "All-in-one 강의", path: "/menu/class-list" },
      { label: "10억 인사이트", path: "/menu/insight" },
    ],
  },
  {
    label: "TPT 커뮤니티",
    submenu: [
      { label: "TPT 매매일지", path: "/menu/feedback-list" },
      { label: "TPT 후기", path: "/menu/community/review" },
      { label: "TPT 전문가 분석", path: "/menu/analysis" },
    ],
  },
  { label: "ETCC 회원권", path: "/menu/etcc" },
  { label: "고객센터", path: "/my/support" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // zustand에서 로그인 상태 가져오기
  const { isAuthenticated, user } = useAuthStore();

  // 헤더를 숨길 경로 목록
  const hiddenRoutes = ["/login", "/signup"];

  if (hiddenRoutes.includes(pathname)) return null;

  // 데스크톱 hover 핸들러
  const handleMouseEnter = () => {
    // 모바일이 아닐 때만 동작
    if (window.innerWidth >= 768) {
      setIsMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // 모바일이 아닐 때만 동작
    if (window.innerWidth >= 768) {
      setIsMenuOpen(false);
    }
  };

  // 모바일 메뉴 토글
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 메뉴 클릭 핸들러 (비로그인 상태에서 매매일지 작성하기 클릭 시 모달)
  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    // 매매일지 작성하기 경로이고 비로그인 상태인 경우
    if (path === "/my/feedback-request" && !isAuthenticated) {
      e.preventDefault();
      setIsLoginModalOpen(true);
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
    } else {
      // 다른 링크 클릭 시 드롭다운 메뉴 닫기
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // 마이페이지/로그인 버튼 클릭 시 드롭다운 닫기
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-16 flex items-center justify-center px-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full max-w-7xl flex items-center justify-between">
          {/* 좌측 로고 영역 */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
            <Image
              src="/images/final_logo_blue.png"
              alt="TPT Logo"
              width={110}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* 중앙 네비게이션 메뉴 영역 - 데스크톱 */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <div key={item.label}>
                {/* 상위 메뉴 */}
                {item.path ? (
                  <Link
                    href={item.path}
                    className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200">
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* 로그인 상태: 마이페이지 버튼 및 사용자 아이콘 */}
                {/* <Link href="/my" onClick={handleLinkClick}>
                  <CustomButton
                    variant="normalClean"
                    className="hidden md:inline-flex px-4 py-2 text-sm rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    마이페이지
                  </CustomButton>
                </Link> */}

                {/* 사용자 아이콘 */}
                <Link href="/my" onClick={handleLinkClick}>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    {user?.profileImage && user.profileImage.trim() !== "" ? (
                      <Image
                        src={user.profileImage}
                        alt="프로필"
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <>
                {/* 비로그인 상태: 회원가입 및 로그인 버튼 */}
                <Link href="/signup" onClick={handleLinkClick}>
                  <CustomButton
                    variant="normalClean"
                    className="hidden md:inline-flex px-4 py-2 text-sm rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    회원가입
                  </CustomButton>
                </Link>

                <Link href="/login" onClick={handleLinkClick}>
                  <CustomButton
                    variant="normalFull"
                    className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    로그인
                  </CustomButton>
                </Link>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 데스크톱 메뉴 드롭다운 - Header 하단에 full width */}
      {isMenuOpen && (
        <div
          className="hidden md:block fixed top-16 left-0 right-0 z-20 bg-white shadow-lg border-t border-gray-200 animate-fadeIn"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">
                    {item.label}
                  </h3>
                  {item.submenu ? (
                    <ul className="space-y-2">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.path}
                            onClick={(e) => handleMenuClick(e, subItem.path)}
                            className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : item.path ? (
                    <Link
                      href={item.path}
                      className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150"
                    >
                      바로가기 →
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-20 bg-white shadow-lg border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-6">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-base">
                  {item.label}
                </h3>
                {item.submenu ? (
                  <ul className="space-y-3 pl-4">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.path}
                          onClick={(e) => handleMenuClick(e, subItem.path)}
                          className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150 block py-2"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : item.path ? (
                  <Link
                    href={item.path}
                    onClick={handleLinkClick}
                    className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150 block py-2 pl-4"
                  >
                    바로가기 →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 로그인 필요 모달 */}
      <CustomModal variant={1} isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center">로그인이 필요합니다</h3>
          <p className="text-center text-gray-700">
            매매일지 작성하기는 로그인 후 이용 가능합니다.
            <br />
            로그인 페이지로 이동하시겠습니까?
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                router.push('/login');
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              로그인
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
