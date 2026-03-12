'use client';

import Image from 'next/image';
import { Coins, User, Infinity } from 'lucide-react';

interface ProfileSectionProps {
  name: string;
  profileImage: string;
  onChange: (file: File) => void;
  uploading: boolean;
  remainingToken?: number;
  isPremium?: boolean;
}

/**
 * 마이페이지 사이드바의 프로필 섹션
 */
export default function ProfileSection({
  name,
  profileImage,
  onChange,
  uploading,
  remainingToken,
  isPremium = false,
}: ProfileSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 프로필 이미지 업로더 */}
      <div className="relative">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#B9AB70] bg-gray-200 flex items-center justify-center">
          {profileImage && profileImage.trim() !== '' ? (
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <User size={48} className="text-gray-400" />
          )}
        </div>
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 bg-[#B9AB70] text-white rounded-full p-2 cursor-pointer hover:bg-[#A89B60] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      <span className="font-semibold text-base md:text-lg text-black">{name} 님</span>
      {uploading && <p className="text-xs text-gray-500">이미지 업로드 중...</p>}

      {/* 토큰 개수 표시 */}
      {remainingToken !== undefined && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D2C693] to-[#928346] rounded-full">
          <Coins size={16} className="text-white" />
          {isPremium ? (
            <div className="flex items-center gap-1">
              <Infinity size={18} className="text-white" />
              <span className="text-sm font-semibold text-white">무제한</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-white">{remainingToken}개</span>
          )}
        </div>
      )}
    </div>
  );
}
