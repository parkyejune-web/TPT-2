'use client';

import { useState } from 'react';
import { authService } from '../../Shared/api/services';
import { useAuthStore } from '../../Shared/store/authStore';

/**
 * 닉네임 변경 관리 훅
 */
export const useNickname = (initialNickname?: string | null) => {
  const [nickName, setNickName] = useState(initialNickname || null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuthStore();

  /**
   * 닉네임 변경 API 호출
   * @param newNickname - 새로운 닉네임
   * @returns 성공 여부
   */
  const handleNicknameChange = async (newNickname: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('[useNickname] 닉네임 변경 요청:', newNickname);
      const result = await authService.updateNickname({ nickname: newNickname });
      console.log('[useNickname] 닉네임 변경 결과:', result);

      if (result.success && result.data) {
        const updatedNickname = result.data.nickName;
        console.log('[useNickname] 새 닉네임 설정:', updatedNickname);

        setNickName(updatedNickname);
        updateUser({ nickName: updatedNickname });

        return true;
      } else {
        console.error('[useNickname] 닉네임 변경 실패:', result);
        return false;
      }
    } catch (error) {
      console.error('[useNickname] 닉네임 변경 오류:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    nickName,
    handleNicknameChange,
    loading,
  };
};
