'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import CustomModal from '../../Shared/ui/CustomModal';
import CustomInputField from '../../Shared/ui/CustomInputField';
import CustomButton from '../../Shared/ui/CustomButton';

interface ProfileSectionProps {
  name: string;
  email: string;
  phone?: string;
  profileImage: string;
  nickName?: string | null;
  onChange: (file: File) => void;
  uploading: boolean;
  onLogout: () => void;
  onWriteDiary: () => void;
  onNicknameChange?: (newNickname: string) => Promise<boolean>;
  nicknameLoading?: boolean;
}

/**
 * 마이페이지 사이드바의 프로필 섹션
 * 프로필 이미지, 사용자 정보(이름/이메일/전화번호), 닉네임 설정, 로그아웃, 매매일지 작성 버튼
 */
export default function ProfileSection({
  name,
  email,
  phone,
  profileImage,
  nickName,
  onChange,
  uploading,
  onLogout,
  onWriteDiary,
  onNicknameChange,
  nicknameLoading = false,
}: ProfileSectionProps) {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickName || '');
  const [nicknameError, setNicknameError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleOpenNicknameModal = () => {
    setNicknameInput(nickName || '');
    setNicknameError('');
    setIsNicknameModalOpen(true);
  };

  const handleCloseNicknameModal = () => {
    setIsNicknameModalOpen(false);
    setNicknameError('');
  };

  const handleNicknameSubmit = async () => {
    if (!nicknameInput.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (nicknameInput.trim().length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    if (nicknameInput.trim().length > 20) {
      setNicknameError('닉네임은 20자 이하여야 합니다.');
      return;
    }

    if (onNicknameChange) {
      const success = await onNicknameChange(nicknameInput.trim());
      if (success) {
        handleCloseNicknameModal();
      } else {
        setNicknameError('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 닉네임 버튼 텍스트 결정
  const nicknameButtonText = nickName ? `닉네임 변경 | ${nickName}` : '닉네임 설정';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Profile 제목 */}
      <h3 className="text-sm font-semibold text-gray-700 text-left">Profile</h3>

      {/* 프로필 이미지 + 사용자 정보 (Row) */}
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="relative flex-shrink-0">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#B9AB70] bg-gray-200 flex items-center justify-center">
            {profileImage && profileImage.trim() !== '' ? (
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-[#B9AB70] text-white rounded-full p-1.5 cursor-pointer hover:bg-[#A89B60] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
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

        {/* 사용자 정보 (Column) */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="font-semibold text-base text-black truncate">{name}</span>
          <span className="text-xs text-gray-600 truncate">{email}</span>
          {phone && <span className="text-xs text-gray-600">{phone}</span>}
        </div>
      </div>

      {uploading && <p className="text-xs text-gray-500 text-center">이미지 업로드 중...</p>}

      {/* 닉네임 설정/변경 버튼 */}
      <button
        onClick={handleOpenNicknameModal}
        disabled={nicknameLoading}
        className="w-full py-2 px-4 text-sm font-medium text-[#B9AB70] bg-white border border-[#B9AB70] rounded-md hover:bg-[#F9F7F0] transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>{nicknameLoading ? '처리 중...' : nicknameButtonText}</span>
      </button>

      {/* 로그아웃 버튼 */}
      <button
        onClick={onLogout}
        className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Log out</span>
      </button>

      {/* 매매일지 작성하기 버튼 */}
      <button
        onClick={onWriteDiary}
        className="w-full py-2 px-4 text-sm font-medium text-white bg-[#0F3570] rounded-md hover:bg-[#0D2F5F] transition"
      >
        매매일지 작성하기
      </button>

      {/* 닉네임 설정 모달 */}
      <CustomModal
        isOpen={isNicknameModalOpen}
        onClose={handleCloseNicknameModal}
        variant={1}
        width="w-md"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {nickName ? '닉네임 변경' : '닉네임 설정'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            다른 사용자에게 보여질 닉네임을 {nickName ? '변경' : '설정'}해주세요.
          </p>

          <CustomInputField
            label="닉네임"
            type="text"
            variant={2}
            value={nicknameInput}
            onChange={(value) => {
              setNicknameInput(value);
              setNicknameError('');
            }}
            placeholder="닉네임을 입력하세요 (2~20자)"
            errorMessage={nicknameError}
          />

          <div className="flex gap-3 mt-6">
            <CustomButton
              variant="simpleBlack"
              onClick={handleCloseNicknameModal}
              className="flex-1"
            >
              취소
            </CustomButton>
            <CustomButton
              variant="prettyFull"
              onClick={handleNicknameSubmit}
              disabled={nicknameLoading}
              className="flex-1"
            >
              {nicknameLoading ? '처리 중...' : '확인'}
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
