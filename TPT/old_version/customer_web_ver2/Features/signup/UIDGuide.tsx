'use client';

import CustomModal from '../../Shared/ui/CustomModal';

interface UIDGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * UID 가이드 모달 컴포넌트
 */
export default function UIDGuide({ isOpen, onClose }: UIDGuideProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} variant={1}>
      <div className="flex flex-col gap-4 text-sm text-gray-700 p-6">
        <h2 className="text-xl font-bold mb-2">UID란?</h2>
        <p>
          UID(User ID)는 거래소에서 발급하는 고유 식별자입니다. TPT 서비스를 이용하기 위해서는
          거래소의 UID를 입력해야 합니다.
        </p>
        <div>
          <h3 className="font-semibold mb-2">UID 확인 방법:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>바이낸스: 계정 설정 - API 관리 - UID 확인</li>
            <li>업비트: 마이페이지 - 계정 정보 - 고객센터 문의 시 UID 확인</li>
            <li>빗썸: 고객센터 문의를 통해 UID 확인</li>
          </ul>
        </div>
        <p className="text-xs text-gray-500">
          UID는 거래소마다 다르며, 보안을 위해 정확한 UID를 입력해주세요.
        </p>
      </div>
    </CustomModal>
  );
}
