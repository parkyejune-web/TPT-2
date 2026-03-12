'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../Shared/store/authStore';

const PREMIUM_WELCOME_SHOWN_KEY = 'tpt_premium_welcome_shown';

/**
 * 트레이너 배정 완료 상태 위젯
 * UserStatus: TRAINER_ASSIGNED
 */
export default function AfterAssignedTrainer() {
  const { user } = useAuthStore();
  const [showWelcome, setShowWelcome] = useState(false);

  // isPremium이 true인 경우, 최초 1회만 환영 메시지 표시
  useEffect(() => {
    if (user?.isPremium) {
      const hasShown = localStorage.getItem(PREMIUM_WELCOME_SHOWN_KEY);
      if (!hasShown) {
        setShowWelcome(true);
        localStorage.setItem(PREMIUM_WELCOME_SHOWN_KEY, 'true');
      }
    }
  }, [user?.isPremium]);

  return (
    <div className="flex flex-col gap-4">
      {/* 상단 텍스트 */}
      {/* <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          올바른 트레이딩으로 지속적인 성장을 기대합니다.
        </h1>
        <h3 className="text-base md:text-lg text-center text-gray-600">
          마라톤처럼 긴 여정이 될지라도, 완주할 수 있도록 곁에서 응원하겠습니다
        </h3>
      </div> */}

      {/* Pro 고객 환영 메시지 - 최초 1회만 표시 */}
      {showWelcome && (
        <>
          <div className="border-t border-gray-400" />

          <h1 className="text-2xl text-[#B9AB70] text-start mb-2">
            유료 구독 플랜을 결제해주신 Pro 고객님 환영합니다.
          </h1>
          <div className="text-md text-start mb-4 text-gray-700">
            <p className="mb-2">
              이제 전문 트레이너와 함께 트레이딩 실력을 향상시킬 수 있습니다.
              <br />
              매매일지를 작성하시면, 전문 트레이너가 자동으로 트레이딩 피드백을 제공합니다.
            </p>
          </div>

          <div className="border-t border-gray-400" />
        </>
      )}
    </div>
  );
}
