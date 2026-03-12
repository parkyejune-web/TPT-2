'use client';

import { useRouter } from 'next/navigation';
import CustomModal from '../../Shared/ui/CustomModal';
import CustomButton from '../../Shared/ui/CustomButton';

interface SaveSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

/**
 * 피드백 요청 저장 성공 모달
 */
export default function SaveSuccess({ isOpen, onClose, message }: SaveSuccessProps) {
  const router = useRouter();

  const handleGoToFeedback = () => {
    onClose();
    router.push('/my');
  };

  const displayMessage = message || '매매일지가 성공적으로 저장되었습니다.';

  return (
    <CustomModal variant={0} isOpen={isOpen} onClose={() => {}} width='max-w-md'>
      <div className="p-6 flex flex-col justify-center items-center">
        <p className="text-gray-700 mb-6 text-center">{displayMessage}</p>
        <CustomButton variant="normalClean" onClick={handleGoToFeedback}>
          확인
        </CustomButton>
      </div>
    </CustomModal>
  );
}
