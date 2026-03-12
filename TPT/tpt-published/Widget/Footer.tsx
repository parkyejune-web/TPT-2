"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const footerData = {
  companyName: "티피티(TPT)",
  ceo: "김동욱",
  businessNumber: "570-03-03924",
  number: "02-857-1210",
  tongshinpanmaeupNum: "제 2025 - 서울금천 - 2288 호",
  address: "서울특별시 금천구 가산디지털2로 46, 305호",
  postalCode: "08589",
  email: "tpt251210@gmail.com",
  phone: "010-7319-4069",
  hosting: "AWS",
  copyright: "© 2025 TPT Inc. All Rights Reserved.",
};

export function Footer() {
  const pathname = usePathname();

  // Footer를 숨길 경로 목록
  const hiddenRoutes = ["/login", "/signup"];

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <footer className="bg-gray-800 text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* 상단 섹션 - 로고, 링크, SNS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-700">
          {/* 좌측 - 로고 */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image
              src="/images/final_logo_white.png"
              alt="TPT Logo"
              width={110}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* 중앙 - 주요 링크 */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
            <Link
              href="/menu/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              회사소개
            </Link>
            <Link
              href="/terms"
              className="text-gray-300 hover:text-white transition-colors"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/crypto-notice"
              className="text-gray-300 hover:text-white transition-colors"
            >
              가상자산 거래 시 유의사항
            </Link>
            <Link
              href="/my/support"
              className="text-gray-300 hover:text-white transition-colors"
            >
              고객센터
            </Link>
            <a
              href="http://pf.kakao.com/_eTxkNn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
              </svg>
              카카오톡 상담
            </a>
          </nav>

{/* 소셜 미디어 아이콘 삭제됨 (2025년 12월) */}
        </div>

        {/* 하단 섹션 - 회사 정보 */}
        <div className="pt-6 text-xs text-gray-400 space-y-2">
          {/* <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <p>
              <span className="font-semibold text-gray-300">{footerData.companyName}</span>
              <span className="mx-2">|</span>
              <span>대표자 {footerData.ceo}</span>
            </p>
          </div>
          <p>
            사업자 등록번호 {footerData.businessNumber}
            <span className="mx-2">|</span>
            통신판매업 신고번호 {footerData.tongshinpanmaeupNum}
          </p>
          <p>
            주소: {footerData.address} ({footerData.postalCode})
          </p>
          <p>
            이메일: {footerData.email}
            <span className="mx-2">|</span>
            전화: {footerData.number}
          </p>
          <p>호스팅 서비스: {footerData.hosting}</p> */}
          <p className="text-gray-500 pt-4">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
