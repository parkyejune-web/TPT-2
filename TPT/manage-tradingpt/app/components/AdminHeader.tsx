'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMockData } from '../contexts/MockDataContext';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from './CustomButton';

interface MenuItem {
  name: string;
  path: string;
  adminOnly?: boolean;
}

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMockMode, toggleMockMode } = useMockData();
  const { isAdmin } = useAuth();

  const menuItems: MenuItem[] = [
    { name: '고객관리', path: '/admin/customers' },
    { name: '조교관리', path: '/admin/assistants', adminOnly: true },
    { name: '칼럼관리', path: '/admin/columns' },
    { name: '후기관리', path: '/admin/reviews' },
    { name: '민원관리', path: '/admin/complaints' },
    { name: '강의관리', path: '/admin/lectures' },
    { name: '일지 관리', path: '/admin/best-feedback' },
    // { name: 'LT관리', path: '/admin/lt' },
    // { name: '상담일시관리', path: '/admin/consultations' },
    { name: '이벤트관리', path: '/admin/events' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleMenuClick = (item: MenuItem) => {
    if (item.adminOnly && !isAdmin) {
      alert('관리자만 이용할 수 있는 탭입니다.');
      return;
    }
    router.push(item.path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측 로고 및 Mock 데이터 토글 */}
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={() => router.push('/admin')}>
              <Image
                src="/favicon.png"
                alt="TPT Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            {/* Mock 데이터 토글 버튼 */}
            {/* <button
              onClick={toggleMockMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isMockMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              title={isMockMode ? 'Mock 데이터 사용 중' : '실제 데이터 사용 중'}
            >
              {isMockMode ? '🔧 Mock' : '📡 Real'}
            </button> */}
          </div>

          {/* 중앙 메뉴 */}
          <nav className="flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item)}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  isActive(item.path)
                    ? 'border-2 border-red-500 text-red-600 font-bold'
                    : 'border-2 border-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* 우측 마이페이지 버튼 */}
          <CustomButton
            onClick={() => router.push('/admin/mypage')}
            variant='primary'
          >
            마이페이지
          </CustomButton>
        </div>
      </div>
    </header>
  );
}
