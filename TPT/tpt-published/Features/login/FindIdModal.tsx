'use client';

import { useState } from 'react';
import CustomInputField from '../../Shared/ui/CustomInputField';
import CustomButton from '../../Shared/ui/CustomButton';
import CustomModal from '../../Shared/ui/CustomModal';
import { authService } from '../../Shared/api/services';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 아이디 찾기 모달
 * 이메일을 입력하면 해당 이메일로 등록된 아이디를 조회
 */
export default function FindIdModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFindId = async () => {
    if (!email) {
      setFoundId('이메일을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setFoundId(null);
      const res = await authService.findId({ email });
      console.log('[FindIdModal] 아이디 찾기 응답:', res);

      // API 응답: { usernames: string[] }
      if (res.success && res.data?.usernames && res.data.usernames.length > 0) {
        const usernames = res.data.usernames;
        if (usernames.length === 1) {
          setFoundId(`당신의 아이디는: ${usernames[0]}`);
        } else {
          // 여러 개의 아이디가 있는 경우
          setFoundId(`등록된 아이디: ${usernames.join(', ')}`);
        }
      } else {
        setFoundId('해당 이메일로 등록된 아이디가 없습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 실패:', error);
      setFoundId('아이디 찾기 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFoundId(null);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} variant={1} width='w-xl'>
      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">아이디 찾기</h2>

        <CustomInputField
          variant={0}
          id="findIdEmail"
          label="이메일"
          placeholder="가입 시 등록한 이메일을 입력하세요"
          value={email}
          onChange={setEmail}
          type="email"
          required
        />

        <CustomButton variant="prettyFull" onClick={handleFindId} disabled={loading} width="w-full">
          {loading ? '조회 중...' : '아이디 찾기'}
        </CustomButton>

        {foundId && <p className="text-center text-gray-700 mt-2">{foundId}</p>}
      </div>
    </CustomModal>
  );
}
