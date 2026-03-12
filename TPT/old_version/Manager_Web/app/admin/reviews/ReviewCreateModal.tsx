'use client';

import { useState } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import { createReview } from '../../api/reviews';

interface ReviewCreateModalProps {
  onClose: (reload?: boolean) => void;
}

export default function ReviewCreateModal({ onClose }: ReviewCreateModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (!confirm('리뷰를 작성하시겠습니까?')) return;

    setLoading(true);

    const response = await createReview(content);

    if (response.success) {
      alert('리뷰가 작성되었습니다.');
      onClose(true);
    } else {
      alert(`오류: ${response.error}`);
    }

    setLoading(false);
  };

  return (
    <CustomModal title="리뷰 데이터 생성" onClose={() => onClose(false)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            리뷰 내용 (HTML/Markdown 지원)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="리뷰 내용을 입력하세요...&#10;&#10;HTML 또는 Markdown 형식을 사용할 수 있습니다."
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>참고:</strong> 이 리뷰는 현재 로그인된 사용자(관리자)의 이름으로 작성됩니다.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton variant="secondary" onClick={() => onClose(false)}>
            취소
          </CustomButton>
          <CustomButton variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '처리 중...' : '작성 완료'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
