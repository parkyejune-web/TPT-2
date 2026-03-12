"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import CustomButton from "../Shared/ui/CustomButton";
import { useAuthStore } from "../Shared/store/authStore";
import { useAccessControl, AccessDeniedReason } from "../Shared/hooks/useAccessControl";
import AccessControlModal from "../Shared/ui/AccessControlModal";

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
      { label: "TPT 연구실", path: "/menu/class-list" }, // 강의 화면
      { label: "10억 인사이트", path: "/menu/insight" }, // 칼럼 화면
      // { label: "TPT 트레이딩 룸", path: "/menu/analysis" }, // 텔레그램 방
    ],
  },
  {
    label: "TPT 커뮤니티",
    submenu: [
      { label: "매매일지 모아보기", path: "/menu/feedback-list" },
      { label: "TPT 후기", path: "/menu/community/review" },
      { label: "TPT 성장일지", path: "/menu/growth" }, // 아직 미정, 클라이언트 문의 필요
    ],
  },
  // { label: "TPT-PLAN", path: "/menu/tpt-plan" },
  {
    label: "고객센터",
    submenu: [
      { label: "문의하기", path: "/my/support" },
      // { label: "거래소 사용 방법", path: "/menu/guide/exchange" },
      { label: "TPT 이용 정책", path: "/menu/guide/policy" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accessDeniedReason, setAccessDeniedReason] = useState<AccessDeniedReason>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // zustand에서 로그인 상태 가져오기
  const { isAuthenticated, user } = useAuthStore();
  const { checkAccessForPath } = useAccessControl();

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

  // 메뉴 클릭 핸들러 - 권한 검사 적용
  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    // 접근 권한 검사
    const accessResult = checkAccessForPath(path);

    if (!accessResult.allowed) {
      e.preventDefault();
      setAccessDeniedReason(accessResult.reason);
      setIsAccessModalOpen(true);
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }

    // 다른 링크 클릭 시 드롭다운 메뉴 닫기
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // 마이페이지/로그인 버튼 클릭 시 드롭다운 닫기
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-16 md:h-16 flex items-center px-3 md:px-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full flex items-center justify-between">
          {/* 좌측 로고 영역 + 홈 버튼 - 고정 너비 */}
          <div className="flex items-center gap-2 md:gap-4 w-auto md:w-[180px] shrink-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
              <Image
                src="/images/final_logo_blue.svg"
                alt="TPT Logo"
                width={110}
                height={40}
                className="h-9 md:h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* 홈 버튼 */}
            <Link
              href="/home"
              className="flex items-center gap-1 px-2 py-1.5 md:px-3 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              <Home size={18} className="text-gray-700" />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">홈</span>
            </Link>
          </div>

          {/* 중앙 네비게이션 메뉴 영역 - 데스크톱 */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <div className="flex items-center gap-10">
              {menuItems.map((item) => (
                <div key={item.label} className="w-[120px]">
                  {/* 상위 메뉴 */}
                  {item.path ? (
                    <Link
                      href={item.path}
                      className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200 text-left">
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* 우측 버튼 영역 - 로그인 상태와 관계없이 동일한 너비 유지, 고정 너비 */}
          <div className="flex items-center justify-end gap-1.5 md:gap-3 w-auto md:w-[180px] shrink-0">
            {isAuthenticated ? (
              <>
                {/* 로그인 상태: 사용자 아이콘 + 비로그인 버튼 영역만큼 invisible 공간 확보 */}
                <div className="hidden md:flex items-center gap-3">
                  {/* 회원가입 버튼 크기만큼 invisible 공간 */}
                  <div className="invisible">
                    <CustomButton
                      variant="normalClean"
                      className="px-4 py-2 text-sm rounded-full"
                    >
                      회원가입
                    </CustomButton>
                  </div>
                </div>

                {/* 사용자 아이콘 */}
                <Link href="/my" onClick={handleLinkClick}>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
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
                        className="w-4 h-4 md:w-5 md:h-5 text-white"
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
                    className="px-2.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    회원가입
                  </CustomButton>
                </Link>

                <Link href="/login" onClick={handleLinkClick}>
                  <CustomButton
                    variant="normalFull"
                    className="px-2.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
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
          <div className="w-full flex items-center justify-between px-3 md:px-4">
            {/* 좌측 영역 - Header와 동일한 고정 너비 */}
            <div className="md:w-[180px]" />

            {/* 중앙 메뉴 영역 - 헤더 nav와 동일한 구조 */}
            <nav className="flex items-start py-6">
              <div className="flex items-start gap-10">
                {menuItems.map((item) => (
                  <div key={item.label} className="w-[120px]">
                    <h3 className="font-semibold text-gray-900 mb-3 text-base">
                      {item.label}
                    </h3>
                    {item.submenu ? (
                      <ul className="space-y-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.label}>
                            <Link
                              href={subItem.path}
                              onClick={(e) => handleMenuClick(e, subItem.path)}
                              className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150 whitespace-nowrap"
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
            </nav>

            {/* 우측 영역 - Header와 동일한 고정 너비 */}
            <div className="md:w-[180px]" />
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

      {/* 접근 권한 검사 모달 */}
      <AccessControlModal
        isOpen={isAccessModalOpen}
        reason={accessDeniedReason}
        onClose={() => {
          setIsAccessModalOpen(false);
          setAccessDeniedReason(null);
        }}
      />
    </>
  );
}
