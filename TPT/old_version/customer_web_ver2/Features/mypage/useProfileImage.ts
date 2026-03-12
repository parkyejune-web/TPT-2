'use client';

import { useState } from 'react';
import { authService } from '../../Shared/api/services';
import { useAuthStore } from '../../Shared/store/authStore';

/**
 * 프로필 이미지 업로드 관리 훅
 */
export const useProfileImage = (initialImage?: string | null) => {
  // 빈 문자열이나 null인 경우 빈 문자열로 설정 (조건부 렌더링에서 처리)
  const [profileImage, setProfileImage] = useState(initialImage && initialImage.trim() !== '' ? initialImage : '');
  const [uploading, setUploading] = useState(false);
  const { updateUser } = useAuthStore();

  const handleProfileImageChange = async (file: File) => {
    setUploading(true);
    try {
      console.log('[useProfileImage] 프로필 이미지 업로드 시작:', file.name);
      const result = await authService.updateProfileImage(file);
      console.log('[useProfileImage] 프로필 이미지 업로드 결과:', result);

      if (result.success && result.data) {
        // result.data는 { myProfileImage: "url" } 형태의 객체
        const newImageUrl = result.data.myProfileImage;
        console.log('[useProfileImage] 추출된 이미지 URL:', newImageUrl);

        // 빈 문자열이 아닌 경우에만 설정
        if (newImageUrl && typeof newImageUrl === 'string' && newImageUrl.trim() !== '') {
          console.log('[useProfileImage] 새 프로필 이미지 URL 설정:', newImageUrl);
          setProfileImage(newImageUrl);
          updateUser({ profileImage: newImageUrl });
        } else {
          console.warn('[useProfileImage] 프로필 이미지 URL이 빈 문자열입니다:', newImageUrl);
        }
      } else {
        console.error('[useProfileImage] 프로필 이미지 업로드 실패:', result);
      }
    } catch (error) {
      console.error('[useProfileImage] 프로필 이미지 업로드 오류:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    profileImage,
    handleProfileImageChange,
    uploading,
  };
};
