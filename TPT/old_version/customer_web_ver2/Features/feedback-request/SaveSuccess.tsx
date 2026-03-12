'use client';

import { useRouter } from 'next/navigation';
import CustomModal from '../../Shared/ui/CustomModal';
import CustomButton from '../../Shared/ui/CustomButton';

interface SaveSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 피드백 요청 저장 성공 모달
 */
export default function SaveSuccess({ isOpen, onClose }: SaveSuccessProps) {
  const router = useRouter();

  const handleGoToFeedback = () => {
    onClose();
    router.push('/feedback-view');
  };

  return (
    <CustomModal variant={1} isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-4 text-green-600">저장 완료!</h3>
        <p className="text-gray-700 mb-6">피드백 요청이 성공적으로 저장되었습니다.</p>
        <div className="flex gap-3">
          <CustomButton variant="prettyFull" onClick={handleGoToFeedback}>
            피드백 보기
          </CustomButton>
          <CustomButton variant="normalClean" onClick={onClose}>
            닫기
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
