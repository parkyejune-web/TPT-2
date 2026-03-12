'use client';

interface AccountInfoSectionProps {
  email: string;
  phone?: string;
}

/**
 * 마이페이지 사이드바의 계정 정보 섹션
 */
export default function AccountInfoSection({ email, phone }: AccountInfoSectionProps) {
  return (
    <div className="flex flex-col gap-1 text-sm text-gray-700 w-full px-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">이메일:</span>
        <span className="truncate text-black">{email}</span>
      </div>
      {phone && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">전화:</span>
          <span className="text-black">{phone}</span>
        </div>
      )}
    </div>
  );
}
