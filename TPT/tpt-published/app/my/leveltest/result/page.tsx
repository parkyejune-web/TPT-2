'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { leveltestService } from '../../../../Shared/api/services';
import type {
  LeveltestAttemptListResponseDTO,
  LeveltestAttemptDetailResponseDTO,
  QuestionResponseDTO,
} from '../../../../Shared/api/apiTypes';

/**
 * 레벨테스트 결과 페이지
 * - 채점 완료된 시도 목록 조회
 * - 특정 시도 선택 시 상세 결과 표시
 */
export default function LeveltestResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');

  const [gradedAttempts, setGradedAttempts] = useState<LeveltestAttemptListResponseDTO[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<LeveltestAttemptDetailResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 채점 완료된 시도 목록 로드
  useEffect(() => {
    const fetchGradedAttempts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await leveltestService.getGradedAttempts();
        if (response.success && response.data) {
          setGradedAttempts(response.data);

          // URL에 attemptId가 있으면 해당 시도 상세 조회
          if (attemptIdParam) {
            fetchAttemptDetail(Number(attemptIdParam));
          } else if (response.data.length > 0) {
            // 없으면 가장 최근 시도 상세 조회
            fetchAttemptDetail(response.data[0].attemptId);
          }
        } else {
          setError(response.message || '채점 완료된 시도를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[LeveltestResultPage] 채점 완료된 시도 조회 에러:', err);
        setError('채점 완료된 시도를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGradedAttempts();
  }, [attemptIdParam]);

  // 시도 상세 조회
  const fetchAttemptDetail = async (attemptId: number) => {
    setIsDetailLoading(true);
    try {
      const response = await leveltestService.getLeveltestAttemptDetail(attemptId);
      if (response.success && response.data) {
        setSelectedAttempt(response.data);
      } else {
        setError(response.message || '시도 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('[LeveltestResultPage] 시도 상세 조회 에러:', err);
      setError('시도 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 시도 선택 핸들러
  const handleAttemptSelect = (attemptId: number) => {
    router.push(`/my/leveltest/result?attemptId=${attemptId}`);
    fetchAttemptDetail(attemptId);
  };

  // 등급에 따른 색상 반환
  const getGradeColor = (grade: string | null | undefined): string => {
    if (!grade) {
      return 'text-gray-600 bg-gray-100';
    }
    switch (grade.toUpperCase()) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 문제 유형 라벨 반환
  const getProblemTypeLabel = (type: string): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return '객관식';
      case 'SHORT_ANSWER':
        return '단답형';
      case 'SUBJECTIVE':
        return '서술형';
      default:
        return type;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && gradedAttempts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">레벨테스트 결과</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            {/* <button
              onClick={() => router.push('/my')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              마이페이지로 돌아가기
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  if (gradedAttempts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">레벨테스트 결과</h2>
            <p className="text-gray-500 mb-6">
              아직 채점 완료된 레벨테스트가 없습니다.
              <br />
              레벨테스트를 제출하고 관리자 채점을 기다려주세요.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/my')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                마이페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">레벨테스트 결과</h1>
            {/* <button
              onClick={() => router.push('/my')}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              마이페이지로 돌아가기
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 시도 목록 (사이드바) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">응시 이력</h2>
              <div className="space-y-2">
                {gradedAttempts.map((attempt) => (
                  <button
                    key={attempt.attemptId}
                    onClick={() => handleAttemptSelect(attempt.attemptId)}
                    className={`w-full p-3 rounded-md text-left transition-all ${
                      selectedAttempt?.attemptId === attempt.attemptId
                        ? 'bg-indigo-50 border-2 border-indigo-400'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      {attempt.grade && (
                        <span className={`text-lg font-bold px-2 py-0.5 rounded ${getGradeColor(attempt.grade)}`}>
                          {attempt.grade}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        {attempt.totalScore}점
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(attempt.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 결과 */}
          <div className="lg:col-span-3">
            {isDetailLoading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">상세 결과를 불러오는 중...</p>
              </div>
            ) : selectedAttempt ? (
              <div className="space-y-6">
                {/* 총점 및 등급 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {selectedAttempt.grade && (
                        <>
                          <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getGradeColor(selectedAttempt.grade)}`}>
                            {selectedAttempt.grade}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">최종 등급</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedAttempt.totalScore}점</p>
                          </div>
                        </>
                      )}
                      {!selectedAttempt.grade && (
                        <p className="text-2xl font-bold text-gray-900">{selectedAttempt.totalScore}점</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 text-right">시도 ID: {selectedAttempt.attemptId}</p>
                  </div>
                </div>

                {/* 문항별 결과 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">문항별 결과</h2>
                  <div className="space-y-4">
                    {selectedAttempt.responses.map((response, index) => (
                      <QuestionResultCard
                        key={response.questionId}
                        response={response}
                        index={index}
                        getProblemTypeLabel={getProblemTypeLabel}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">좌측에서 응시 이력을 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 문항별 결과 카드 컴포넌트
interface QuestionResultCardProps {
  response: QuestionResponseDTO;
  index: number;
  getProblemTypeLabel: (type: string) => string;
}

function QuestionResultCard({ response, index, getProblemTypeLabel }: QuestionResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 (클릭하여 펼치기/접기) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900">문제 {index + 1}</span>
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
              {getProblemTypeLabel(response.problemType)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${response.scoreAwarded > 0 ? 'text-green-600' : 'text-red-600'}`}>
              +{response.scoreAwarded}점
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* 상세 내용 */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {/* 문제 내용 */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">문제</p>
            <p className="text-gray-800 whitespace-pre-wrap">{response.content}</p>
          </div>

          {/* 문제 이미지 */}
          {response.imageUrl && (
            <div className="mb-4">
              <img
                src={response.imageUrl}
                alt={`문제 ${index + 1} 이미지`}
                className="max-w-full h-auto rounded-md border border-gray-200"
              />
            </div>
          )}

          {/* 선택지 (객관식인 경우) */}
          {response.problemType === 'MULTIPLE_CHOICE' && response.choices && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">선택지</p>
              <div className="space-y-2">
                {response.choices.map((choice, choiceIndex) => {
                  const choiceNum = String(choiceIndex + 1);
                  const isSelected = response.choiceNumber === choiceNum;
                  return (
                    <div
                      key={choiceIndex}
                      className={`p-2 rounded-md ${
                        isSelected
                          ? 'bg-indigo-50 border border-indigo-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="font-semibold mr-2">{choiceNum}.</span>
                      {choice}
                      {isSelected && (
                        <span className="ml-2 text-xs text-indigo-600 font-medium">(선택)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 내 답변 (단답형/서술형인 경우) */}
          {(response.problemType === 'SHORT_ANSWER' || response.problemType === 'SUBJECTIVE') && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">내 답변</p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {response.answerText || '(답변 없음)'}
                </p>
              </div>
            </div>
          )}

          {/* 획득 점수 */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">획득 점수</span>
              <span className={`text-lg font-bold ${response.scoreAwarded > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {response.scoreAwarded}점
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
