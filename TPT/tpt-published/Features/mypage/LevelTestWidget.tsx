'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LevelTestStatus } from '../../Shared/store/authStore';
import { getGradedAttempts } from '../../Shared/api/services/leveltestService';
import CustomModal from '../../Shared/ui/CustomModal';

type Props = {
  levelTestStatus?: LevelTestStatus;
};

/**
 * 레벨테스트 위젯 (유료 회원 전용)
 * levelTestStatus에 따라 다른 UI를 표시
 * - AVAILABLE: 응시 가능 상태 - 골드 그라데이션 배너 형태
 * - BEFORE_GRADE: 채점 전 - 채점 대기 중 안내
 * - COMPLETED: 채점 완료 - 결과 확인 버튼
 */
export default function LevelTestWidget({ levelTestStatus }: Props) {
  const router = useRouter();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [grade, setGrade] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 채점 완료 결과 조회 및 모달 표시
  const handleShowResult = async () => {
    setIsLoading(true);
    try {
      const response = await getGradedAttempts();
      if (response.success && response.data && response.data.length > 0) {
        // 가장 최근 채점 결과의 grade 사용
        const latestAttempt = response.data[0];
        setGrade(latestAttempt.grade);
        setIsGradeModalOpen(true);
      } else {
        console.error('[LevelTestWidget] 채점 결과 조회 실패:', response.message);
      }
    } catch (error) {
      console.error('[LevelTestWidget] 채점 결과 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 응시 가능 상태 - 골드 그라데이션 배너 형태
  if (levelTestStatus === 'AVAILABLE') {
    return (
      <div
        className="flex items-center justify-center px-4 py-2 rounded-md gap-4"
        style={{
          background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
        }}
      >
        {/* 텍스트 영역 */}
        <div className="flex flex-col text-start w-full justify-between">
          <p className="text-white font-bold text-sm md:text-base lg:text-lg">
            고객님께 딱 맞는 트레이너 배정을 위해, 먼저 레벨테스트를 응시해주세요.
          </p>
        </div>

        {/* 화살표 아이콘 */}
        <img src="/images/icon_arrowRight.svg" alt="arrow" className="w-20 h-6" />

        {/* 버튼 영역 */}
        <button
          onClick={() => router.push('/my/leveltest')}
          className="flex items-center gap-2 bg-[#FAF8F0] hover:bg-[#F5F2E6] font-semibold px-2 py-1 rounded-md transition-colors duration-200 whitespace-nowrap"
        >
          <span
            className="text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            레벨테스트 시작
          </span>
        </button>
      </div>
    );
  }

  // 채점 전 상태
  if (levelTestStatus === 'BEFORE_GRADE') {
    return (
      <div
        className="flex flex-col items-center justify-center px-4 py-2  rounded-md"
        style={{
          background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
        }}
      >
        <p className="text-white font-bold text-sm md:text-base lg:text-lg text-center">
          제출하신 레벨테스트를 채점하고 있습니다.
        </p>
      </div>
    );
  }

  // 채점 완료 상태
  if (levelTestStatus === 'COMPLETED') {
    return (
      <>
        <div
          className="flex items-center justify-center px-4 py-2 rounded-md gap-4"
          style={{
            background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
          }}
        >
          {/* 텍스트 영역 */}
          <div className="flex flex-col text-start w-full justify-between">
            <p className="text-white font-bold text-sm md:text-base lg:text-lg">
              레벨테스트 결과를 확인하세요.
            </p>
            <p className="text-white/80 text-xs">
              * 4개월 후 재응시 가능
            </p>
          </div>

          {/* 화살표 아이콘 */}
          <img src="/images/icon_arrowRight.svg" alt="arrow" className="w-20 h-6" />

          {/* 버튼 영역 */}
          <button
            onClick={handleShowResult}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#FAF8F0] hover:bg-[#F5F2E6] font-semibold px-2 py-1 rounded-md transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
          >
            <span
              className="text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {isLoading ? '조회 중...' : '결과 확인'}
            </span>
          </button>
        </div>

        {/* 등급 결과 모달 */}
        <CustomModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          variant={2}
          width="w-80"
        >
          <div className="text-center py-4">
            <p className="text-xl font-bold text-gray-900">
              최종등급: <span className="text-[#B9AB70]">{grade}</span>
            </p>
          </div>
        </CustomModal>
      </>
    );
  }

  // levelTestStatus가 없거나 알 수 없는 상태인 경우 기본 안내
  return (
    <div
      className="flex flex-col items-center justify-center px-6 md:px-10 py-6 md:py-8 rounded-md"
      style={{
        background: 'linear-gradient(135deg, #B9AB70 0%, #B9AB70 50%, #968A57 100%)',
      }}
    >
      <p className="text-white font-bold text-sm md:text-base lg:text-lg text-center">
        레벨테스트 정보 조회 중...
      </p>
    </div>
  );
}
