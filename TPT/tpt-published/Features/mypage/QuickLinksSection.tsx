'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Lightbulb } from 'lucide-react';

/**
 * 마이페이지 사이드바의 바로가기 버튼 섹션
 * TPT 연구실, 10억 인사이트
 */
export default function QuickLinksSection() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-sm font-semibold text-gray-700">Quick Links</h3>
      <div className="flex flex-col gap-2">
        {/* TPT 연구실 */}
        <button
          onClick={() => router.push('/menu/class-list')}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          {/* <BookOpen size={18} /> */}
          <span>TPT 연구실</span>
        </button>

        {/* 10억 인사이트 */}
        <button
          onClick={() => router.push('/menu/insight')}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          {/* <Lightbulb size={18} /> */}
          <span>10억 인사이트</span>
        </button>
      </div>
    </div>
  );
}
