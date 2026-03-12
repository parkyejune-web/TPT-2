'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { leveltestService } from '../../../Shared/api/services';

interface QuestionAnswer {
  questionId: number;
  choiceNumber?: string;
  answerText?: string;
}

/**
 * 레벨테스트 페이지
 * 60분 타이머, 객관식/단답형/서술형 문제 지원
 */
export default function LeveltestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Map<number, QuestionAnswer>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60분

  // 문제 로드
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await leveltestService.getLeveltestQuestions(0, 100);
        if (response.success && response.data) {
          setQuestions(response.data);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error('문제 조회 중 오류:', error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 타이머 카운트다운
  useEffect(() => {
    if (isLoading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, questions.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const updateAnswer = (questionId: number, answer: Partial<QuestionAnswer>) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      const existing = newAnswers.get(questionId) || { questionId };
      newAnswers.set(questionId, { ...existing, ...answer });
      return newAnswers;
    });
  };

  const handleMultipleChoiceAnswer = (questionId: number, choiceNumber: string) => {
    updateAnswer(questionId, { choiceNumber });
  };

  const handleTextAnswer = (questionId: number, answerText: string) => {
    updateAnswer(questionId, { answerText });
  };

  const validateAnswers = (): boolean => {
    const unanswered = questions.filter((q) => {
      const answer = answers.get(q.questionId);
      if (!answer) return true;

      if (q.problemType === 'MULTIPLE_CHOICE') {
        return !answer.choiceNumber;
      } else {
        return !answer.answerText || answer.answerText.trim() === '';
      }
    });

    if (unanswered.length > 0) {
      alert(`모든 문제에 답변해주세요. (미답변: ${unanswered.length}개)`);
      return false;
    }

    return true;
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    try {
      const answersArray = Array.from(answers.values());
      const response = await leveltestService.submitLeveltest({ answers: answersArray });

      if (response.success && response.data) {
        alert(
          `시간이 종료되어 자동으로 제출되었습니다.\n\n시도 ID: ${response.data.attemptId}\n\n채점이 완료되면 결과를 확인하실 수 있습니다.`
        );
        router.push('/my');
      } else {
        alert(`자동 제출 실패: ${response.error}`);
        router.push('/my');
      }
    } catch (error) {
      console.error('자동 제출 중 오류:', error);
      alert('자동 제출 중 오류가 발생했습니다.');
      router.push('/my');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) return;

    if (
      !confirm(
        '레벨테스트를 제출하시겠습니까?\n제출 후에는 수정할 수 없습니다.\n\n관리자 채점 후 결과를 확인할 수 있습니다.'
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const answersArray = Array.from(answers.values());
      const response = await leveltestService.submitLeveltest({ answers: answersArray });

      if (response.success && response.data) {
        alert(
          `레벨테스트 제출이 완료되었습니다!\n\n시도 ID: ${response.data.attemptId}\n\n채점이 완료되면 결과를 확인하실 수 있습니다.`
        );
        router.push('/my');
      } else {
        alert(`제출 실패: ${response.error}`);
      }
    } catch (error) {
      console.error('제출 중 오류:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const calculateProgress = (): number => {
    if (questions.length === 0) return 0;
    const answeredCount = questions.filter((q) => answers.has(q.questionId)).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">문제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">레벨테스트</h1>
            {questions.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-600 mb-1">남은 시간</span>
                <div
                  className={`text-2xl font-bold ${timeRemaining <= 300 ? 'text-red-600' : 'text-indigo-600'}`}
                >
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            모든 문제에 답변 후 제출해주세요. 관리자 채점 후 결과를 확인할 수 있습니다.
          </p>

          {/* 진행률 */}
          {questions.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>답변 진행률</span>
                <span className="font-semibold">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 문제 목록 */}
        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 등록된 문제가 없습니다.
            </h3>
            <p className="text-gray-500 mb-6">
              관리자가 레벨테스트 문제를 등록하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.questionId} className="bg-white rounded-lg shadow-md p-6">
                  {/* 문제 헤더 */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">문제 {index + 1}</span>
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                          {getProblemTypeLabel(question.problemType)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {question.score}점
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{question.content}</p>
                    </div>
                  </div>

                  {/* 이미지 */}
                  {question.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={question.imageUrl}
                        alt={`문제 ${index + 1} 이미지`}
                        className="max-w-full h-auto rounded-md border border-gray-200"
                      />
                    </div>
                  )}

                  {/* 답변 영역 */}
                  <div className="mt-4">
                    {question.problemType === 'MULTIPLE_CHOICE' ? (
                      <div className="space-y-2">
                        {question.multipleChoice &&
                          Object.entries(question.multipleChoice)
                            .filter(([_, value]) => value)
                            .map(([key, value]) => {
                              const choiceNum = key.replace('choice', '');
                              const isSelected =
                                answers.get(question.questionId)?.choiceNumber === choiceNum;
                              return (
                                <button
                                  key={key}
                                  onClick={() =>
                                    handleMultipleChoiceAnswer(question.questionId, choiceNum)
                                  }
                                  className={`w-full p-3 rounded-md border text-left transition-all ${
                                    isSelected
                                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-medium'
                                      : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="font-semibold mr-2">{choiceNum}.</span>
                                  {value as string}
                                </button>
                              );
                            })}
                      </div>
                    ) : question.problemType === 'SHORT_ANSWER' ? (
                      <input
                        type="text"
                        value={answers.get(question.questionId)?.answerText || ''}
                        onChange={(e) => handleTextAnswer(question.questionId, e.target.value)}
                        placeholder="답변을 입력하세요"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <textarea
                        value={answers.get(question.questionId)?.answerText || ''}
                        onChange={(e) => handleTextAnswer(question.questionId, e.target.value)}
                        placeholder="답변을 작성하세요"
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 제출 버튼 */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || calculateProgress() < 100}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors ${
                  isSubmitting || calculateProgress() < 100
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? '제출 중...' : '제출하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
