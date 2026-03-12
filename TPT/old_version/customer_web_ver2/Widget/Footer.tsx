"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const footerData = {
  companyName: "로얄 트레이딩 아카데미",
  ceo: "김동욱",
  businessNumber: "570-03-03924",
  mailOrderNumber: "02 887 4810",
  address: "서울특별시 금천구 가산디지털2로 46, 305호",
  postalCode: "08725",
  email: "rlaehddnr4810@naver.com",
  phone: "010-7319-4069",
  hosting: "AWS",
  copyright: "© 2025 TPT Inc. All Rights Reserved.",
};

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* 상단 섹션 - 로고, 링크, SNS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-700">
          {/* 좌측 - 로고 */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image
              src="/images/final_logo_blue.png"
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
              href="/my/support"
              className="text-gray-300 hover:text-white transition-colors"
            >
              고객센터
            </Link>
          </nav>

          {/* 우측 - SNS 링크 */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </a>
          </div>
        </div>

        {/* 하단 섹션 - 회사 정보 */}
        <div className="pt-6 text-xs text-gray-400 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <p>
              <span className="font-semibold text-gray-300">{footerData.companyName}</span>
              <span className="mx-2">|</span>
              <span>대표자 {footerData.ceo}</span>
            </p>
          </div>
          <p>
            사업자 등록번호 {footerData.businessNumber}
            <span className="mx-2">|</span>
            통신판매업 신고번호 {footerData.mailOrderNumber}
          </p>
          <p>
            주소: {footerData.address} ({footerData.postalCode})
          </p>
          <p>
            이메일: {footerData.email}
            <span className="mx-2">|</span>
            전화: {footerData.phone}
          </p>
          <p>호스팅 서비스: {footerData.hosting}</p>
          <p className="text-gray-500 pt-4">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
