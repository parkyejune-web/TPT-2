'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../Shared/store/authStore';
import {
  getLectureCurriculum,
  getLectureDetail,
  purchaseLectureWithToken,
} from '../../../Shared/api/services/lectureService';
import type { ChapterBlock, LectureDetailData, LectureData } from '../../../Shared/api/services/lectureService';
import { USE_MOCK_DATA, applyMockDataIfNeeded } from '../../../Shared/mock/lectureMock';
import HeroBanner from '../../../Features/class/HeroBanner';
import ChapterSection from '../../../Features/class/ChapterSection';
import VideoPlayerModal from '../../../Features/class/VideoPlayerModal';
import CustomModal from '../../../Shared/ui/CustomModal';
import {
  TokenConfirmModal,
  TokenSuccessModal,
  TokenInsufficientModal,
  useTokenPurchaseModal,
} from '../../../Features/class/TokenPurchaseModal';
import { getMyInfo } from '../../../Shared/api/services/authService';
import AccessGuard from '../../../Shared/ui/AccessGuard';

/**
 * All-in-one 강의 페이지
 * 실제 API 연동 버전
 */
export default function ClassListPage() {
  const { user, updateUser } = useAuthStore();
  const [regularChapters, setRegularChapters] = useState<ChapterBlock[]>([]);
  const [proChapters, setProChapters] = useState<ChapterBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<LectureDetailData | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isProRestrictedModalOpen, setIsProRestrictedModalOpen] = useState(false);
  const [isNotReleasedModalOpen, setIsNotReleasedModalOpen] = useState(false);
  const [isExpiredRepurchaseModalOpen, setIsExpiredRepurchaseModalOpen] = useState(false);
  const [expiredLectureInfo, setExpiredLectureInfo] = useState<{ lectureId: number; lectureTitle: string } | null>(null);
  const [isRepurchasing, setIsRepurchasing] = useState(false);

  // 토큰 모달 관리
  const tokenModal = useTokenPurchaseModal({
    onPurchaseSuccess: () => {
      // 모달 닫힐 때 비디오 모달 열기
      if (selectedLecture) {
        setIsVideoModalOpen(true);
      }
    },
  });

  // 프리미엄 사용자 여부
  const isPremium = user?.isPremium || false;

  // 사용자 토큰 (API 필드명: token)
  const userTokens = (user as any)?.token ?? (user as any)?.remainingToken ?? 0;

  // 커리큘럼 데이터 가져오기
  const fetchCurriculum = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[ClassListPage] 커리큘럼 조회 시작 (Mock 모드:', USE_MOCK_DATA, ')');

      // Mock 모드가 true일 경우, API 호출 없이 바로 mock 데이터 사용
      if (USE_MOCK_DATA === true) {
        console.log('[ClassListPage] Mock 데이터 사용');
        const regularData = applyMockDataIfNeeded([], 'REGULAR');
        const proData = applyMockDataIfNeeded([], 'PRO');

        console.log('[ClassListPage] Mock REGULAR 챕터:', regularData.length, '개');
        console.log('[ClassListPage] Mock PRO 챕터:', proData.length, '개');

        setRegularChapters(regularData);
        setProChapters(proData);
        setLoading(false);
        return;
      }

      const response = await getLectureCurriculum(0, 100);

      if (response.success && response.data) {
        const chapters = response.data;
        console.log('[ClassListPage] 커리큘럼 조회 성공:', chapters.length, '개 챕터');

        // API 데이터 필터링 (fallback 모드 지원)
        const regularData = applyMockDataIfNeeded(
          chapters.filter(ch => ch.chapterType === 'REGULAR'),
          'REGULAR'
        );
        const proData = applyMockDataIfNeeded(
          chapters.filter(ch => ch.chapterType === 'PRO'),
          'PRO'
        );

        console.log('[ClassListPage] REGULAR 챕터:', regularData.length, '개');
        console.log('[ClassListPage] PRO 챕터:', proData.length, '개');

        setRegularChapters(regularData);
        setProChapters(proData);
      } else {
        console.error('[ClassListPage] 커리큘럼 조회 실패:', response.message);
        setError(response.message || '강의 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('[ClassListPage] 커리큘럼 로드 에러:', err);
      setError('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  // 강의 클릭 처리
  const handleLectureClick = async (lectureId: number) => {
    try {
      console.log('[ClassListPage] 강의 클릭:', lectureId);

      // 해당 강의 정보 찾기 (Regular 또는 Pro)
      let lectureInfo: LectureData | undefined;
      let isProLecture = false;

      // Regular 챕터에서 찾기
      for (const chapter of regularChapters) {
        const found = chapter.lectures.find(l => l.lectureId === lectureId);
        if (found) {
          lectureInfo = found;
          isProLecture = false;
          break;
        }
      }

      // Regular에서 못 찾으면 Pro 챕터에서 찾기
      if (!lectureInfo) {
        for (const chapter of proChapters) {
          const found = chapter.lectures.find(l => l.lectureId === lectureId);
          if (found) {
            lectureInfo = found;
            isProLecture = true;
            break;
          }
        }
      }

      if (!lectureInfo) {
        alert('강의 정보를 찾을 수 없습니다.');
        return;
      }

      // 토큰이 필요한 무료 강의인지 확인
      const requiresToken = (lectureInfo.requiredTokens ?? 0) > 0;
      // 이미 구매했는지 확인 (dueDate 또는 lastWatchedAt이 있으면 구매 완료)
      const isAlreadyPurchased = !!lectureInfo.dueDate || !!lectureInfo.lastWatchedAt;

      console.log('[ClassListPage] 강의 정보:', {
        lectureId,
        isProLecture,
        requiresToken,
        requiredTokens: lectureInfo.requiredTokens,
        isAlreadyPurchased,
        dueDate: lectureInfo.dueDate,
        lastWatchedAt: lectureInfo.lastWatchedAt,
      });

      // 토큰이 필요하고 아직 구매하지 않은 경우 -> 토큰 구매 Modal 표시
      if (requiresToken && !isAlreadyPurchased) {
        const requiredTokens = lectureInfo.requiredTokens ?? 0;

        // isPremium 사용자는 토큰 개수에 관계없이 항상 확인 모달 표시
        if (isPremium) {
          tokenModal.openConfirmModal(lectureId, lectureInfo.title, requiredTokens);
        } else if (userTokens < requiredTokens) {
          // 일반 사용자: 토큰 부족 - 확인 모달 후 부족 모달로 전환
          tokenModal.openConfirmModal(lectureId, lectureInfo.title, requiredTokens);
          setTimeout(() => {
            tokenModal.openInsufficientModal();
          }, 0);
        } else {
          // 일반 사용자: 토큰 충분 - 확인 모달 표시
          tokenModal.openConfirmModal(lectureId, lectureInfo.title, requiredTokens);
        }
        return;
      }

      // 토큰 필요 없거나 이미 구매한 경우 -> 바로 재생
      await openVideoPlayer(lectureId, isProLecture);
    } catch (err) {
      console.error('[ClassListPage] 강의 클릭 처리 에러:', err);
      alert('강의를 불러오는데 실패했습니다.');
    }
  };

  // Pro 강의 클릭 처리 (Regular 회원용)
  const handleProLectureClickForRegular = () => {
    setIsProRestrictedModalOpen(true);
  };

  // 비디오 플레이어 열기
  const openVideoPlayer = async (lectureId: number, isProLecture: boolean = false) => {
    try {
      console.log('[ClassListPage] 강의 상세 조회:', lectureId, { isProLecture });
      const response = await getLectureDetail(lectureId);

      if (response.success && response.data) {
        console.log('[ClassListPage] 강의 상세 조회 성공:', response.data.title);

        // Pro 타입 강의이면서 프리미엄 사용자인 경우 과제 제출 섹션 표시
        const lectureData = {
          ...response.data,
          hasAssignment: isProLecture && isPremium,
        };

        console.log('[ClassListPage] 과제 제출 섹션 표시 여부:', {
          isProLecture,
          isPremium,
          hasAssignment: lectureData.hasAssignment,
        });

        setSelectedLecture(lectureData);
        setIsVideoModalOpen(true);
      } else {
        console.error('[ClassListPage] 강의 상세 조회 실패:', response.message, 'status:', response.status, 'code:', response.code);

        // LECTURE_400_5: 수강 기간이 만료된 강의 - 재구매 모달 표시
        if (response.code === 'LECTURE_400_5') {
          // 강의 정보 찾기
          let lectureTitle = '강의';
          for (const chapter of [...regularChapters, ...proChapters]) {
            const found = chapter.lectures.find(l => l.lectureId === lectureId);
            if (found) {
              lectureTitle = found.title;
              break;
            }
          }
          setExpiredLectureInfo({ lectureId, lectureTitle });
          setIsExpiredRepurchaseModalOpen(true);
        } else {
          // 기타 에러는 기존처럼 alert 표시
          alert(response.message || '강의를 불러오는데 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('[ClassListPage] 강의 상세 조회 에러:', err);
      alert('강의를 불러오는데 실패했습니다.');
    }
  };

  // 토큰으로 강의 구매 처리
  const handleTokenPurchase = async () => {
    if (!tokenModal.lectureInfo) return;

    setIsPurchasing(true);
    try {
      console.log('[ClassListPage] 토큰으로 강의 구매:', tokenModal.lectureInfo.lectureId);
      const response = await purchaseLectureWithToken(tokenModal.lectureInfo.lectureId);

      if (response.success) {
        console.log('[ClassListPage] 강의 구매 성공');

        // 사용자 토큰 업데이트 (서버에서 조회)
        const newRemainingTokens = userTokens - tokenModal.lectureInfo.requiredTokens;

        // 성공 모달 표시
        tokenModal.openSuccessModal(
          tokenModal.lectureInfo.requiredTokens,
          newRemainingTokens
        );

        // 사용자 정보 새로고침
        const userInfoResponse = await getMyInfo();
        if (userInfoResponse.success && userInfoResponse.data) {
          updateUser(userInfoResponse.data);
        }

        // 강의 상세 조회하여 selectedLecture 설정
        await openVideoPlayer(tokenModal.lectureInfo.lectureId);

        // 커리큘럼 새로고침 (시청 가능 상태 업데이트)
        fetchCurriculum();
      } else {
        console.error('[ClassListPage] 강의 구매 실패:', response.message);
        alert(response.message || '강의 구매에 실패했습니다.');
      }
    } catch (err) {
      console.error('[ClassListPage] 강의 구매 에러:', err);
      alert('강의 구매 중 오류가 발생했습니다.');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 수강 기간 만료 강의 재구매 처리
  const handleExpiredRepurchase = async () => {
    if (!expiredLectureInfo) return;

    setIsRepurchasing(true);
    try {
      console.log('[ClassListPage] 수강 만료 강의 재구매 요청:', expiredLectureInfo.lectureId);
      const response = await purchaseLectureWithToken(expiredLectureInfo.lectureId);

      if (response.success) {
        console.log('[ClassListPage] 강의 재구매 성공');

        // 사용자 정보 새로고침 (토큰 업데이트)
        const userInfoResponse = await getMyInfo();
        if (userInfoResponse.success && userInfoResponse.data) {
          updateUser(userInfoResponse.data);
        }

        // 모달 닫기
        setIsExpiredRepurchaseModalOpen(false);
        setExpiredLectureInfo(null);

        // 커리큘럼 새로고침
        fetchCurriculum();

        // 강의 재생 시도
        await openVideoPlayer(expiredLectureInfo.lectureId);
      } else {
        console.error('[ClassListPage] 강의 재구매 실패:', response.message);
        alert(response.message || '강의 재구매에 실패했습니다.');
      }
    } catch (err) {
      console.error('[ClassListPage] 강의 재구매 에러:', err);
      alert('강의 재구매 중 오류가 발생했습니다.');
    } finally {
      setIsRepurchasing(false);
    }
  };

  // 진행도 업데이트 콜백 (VideoPlayerModal에서 호출)
  const handleProgressUpdate = useCallback((currentSeconds: number) => {
    console.log('[ClassListPage] 진행도 업데이트:', currentSeconds, '초');
    // VideoPlayerModal 내부에서 직접 API 호출하므로 여기서는 로깅만
  }, []);

  // 과제 제출 성공 콜백 (VideoPlayerModal에서 호출)
  const handleAssignmentSubmitted = useCallback((lectureId: number) => {
    console.log('[ClassListPage] 과제 제출 완료:', lectureId);
    // Pro 챕터에서 해당 강의를 찾아 assignmentSubmitted를 true로 설정
    setProChapters(prev => prev.map(chapter => ({
      ...chapter,
      lectures: chapter.lectures.map(lecture =>
        lecture.lectureId === lectureId
          ? { ...lecture, assignmentSubmitted: true }
          : lecture
      ),
    })));
  }, []);

  // 비디오 모달 닫기
  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
    // 모달 닫힐 때 커리큘럼 새로고침 (진행도 업데이트 반영)
    fetchCurriculum();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <AccessGuard level="UID_APPROVED_REQUIRED">
    <div className="min-h-screen bg-white">
      {/* 배너 - 반응형 이미지 */}
      <HeroBanner
        imageSrc="/images/banners/final_class-list_banner_img_desk_4.png"
        imageSrcMobile="/images/banners/final_class-list_banner_img_mobile_4.png"
        title=""
        description=""
        showOverlay={false}
      />

      {/* 강의 섹션 */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {isPremium ? (
          <>
            {/* <ChapterSection
              chapters={proChapters}
              type="PRO"
              onLectureClick={handleLectureClick}
              className="mb-32"
            /> */}
            <ChapterSection
              chapters={regularChapters}
              type="REGULAR"
              onLectureClick={handleLectureClick}
            />
          </>
        ) : (
          <>
            <ChapterSection
              chapters={regularChapters}
              type="REGULAR"
              onLectureClick={handleLectureClick}
              className="mb-32"
            />

            {/* {proChapters.length > 0 && (
              <ChapterSection
                chapters={proChapters}
                type="PRO"
                onLectureClick={handleProLectureClickForRegular}
              />
            )} */}
          </>
        )}
      </main>


      {/* 비디오 플레이어 모달 */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={handleVideoModalClose}
        lecture={selectedLecture}
        onProgressUpdate={handleProgressUpdate}
        onAssignmentSubmitted={handleAssignmentSubmitted}
        onPlayError={(errorCode) => {
          // /play API 에러 코드에 따른 처리
          // LECTURE_404_1: 진짜 없는 강의
          // LECTURE_404_4: 아직 공개되지 않은 주차
          if (errorCode === 'LECTURE_404_4') {
            setIsNotReleasedModalOpen(true);
          } else if (errorCode === 'LECTURE_404_1') {
            alert('존재하지 않는 강의입니다.');
          } else {
            alert('강의를 재생할 수 없습니다.');
          }
        }}
      />

      {/* 토큰 사용 확인 모달 */}
      <TokenConfirmModal
        isOpen={tokenModal.modalType === 'confirm'}
        onClose={tokenModal.closeModal}
        onConfirm={handleTokenPurchase}
        lectureTitle={tokenModal.lectureInfo?.lectureTitle || ''}
        requiredTokens={tokenModal.lectureInfo?.requiredTokens || 0}
        userTokens={userTokens}
        isLoading={isPurchasing}
        isPremium={isPremium}
      />

      {/* 토큰 결제 성공 모달 */}
      <TokenSuccessModal
        isOpen={tokenModal.modalType === 'success'}
        onClose={tokenModal.closeModal}
        lectureTitle={tokenModal.lectureInfo?.lectureTitle || ''}
        usedTokens={tokenModal.purchaseResult?.usedTokens || 0}
        remainingTokens={tokenModal.purchaseResult?.remainingTokens || 0}
      />

      {/* 토큰 부족 모달 */}
      <TokenInsufficientModal
        isOpen={tokenModal.modalType === 'insufficient'}
        onClose={tokenModal.closeModal}
        requiredTokens={tokenModal.lectureInfo?.requiredTokens || 0}
        userTokens={userTokens}
      />

      {/* Pro 강의 제한 모달 (Regular 회원용) */}
      <CustomModal
        isOpen={isProRestrictedModalOpen}
        onClose={() => setIsProRestrictedModalOpen(false)}
        variant={2}
        width="w-96"
      >
        <div className="text-center py-4">
          <p className="text-gray-900 font-medium">
            정기 구독 후 이용하실 수 있는 서비스입니다.
          </p>
        </div>
      </CustomModal>

      {/* 아직 공개되지 않은 강의 모달 */}
      <CustomModal
        isOpen={isNotReleasedModalOpen}
        onClose={() => setIsNotReleasedModalOpen(false)}
        variant={2}
        width="max-w-md"
      >
        <div className="text-center py-4 px-2">
          <p className="text-gray-900 font-medium leading-relaxed">
            Pro Type 전환 후 TPT 시스템 트레이딩 강의는
            <br />
            주차별로 1강씩 순차 오픈됩니다.
            <br />
            <br />
            현재는 해당 주차가 아직 도달하지 않아
            <br />
            강의 열람이 제한된 상태입니다.
          </p>
        </div>
      </CustomModal>

      {/* 수강 기간 만료 재구매 모달 */}
      <CustomModal
        isOpen={isExpiredRepurchaseModalOpen}
        onClose={() => {
          setIsExpiredRepurchaseModalOpen(false);
          setExpiredLectureInfo(null);
        }}
        variant={1}
        width="max-w-md"
      >
        <div className="text-center py-4 px-2">
          <p className="text-gray-900 font-medium leading-relaxed mb-6">
            수강 기간이 만료된 강의입니다.
            <br />
            재구매하시겠습니까?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setIsExpiredRepurchaseModalOpen(false);
                setExpiredLectureInfo(null);
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={isRepurchasing}
            >
              취소
            </button>
            <button
              onClick={handleExpiredRepurchase}
              disabled={isRepurchasing}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRepurchasing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  처리 중...
                </>
              ) : (
                '확인'
              )}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
    </AccessGuard>
  );
}
