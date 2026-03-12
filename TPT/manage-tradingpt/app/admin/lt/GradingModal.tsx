'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getAttemptDetail,
  gradeAttempt,
  getProblemTypeLabel,
  type QuestionResponseDetail,
  type QuestionGrade,
  type LevelTestGrade,
} from '../../api/leveltest';

interface GradingModalProps {
  attemptId: number;
  onClose: (reload?: boolean) => void;
}

export default function GradingModal({ attemptId, onClose }: GradingModalProps) {
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [questions, setQuestions] = useState<QuestionResponseDetail[]>([]);
  const [grades, setGrades] = useState<Record<number, number>>({});
  const [selectedGrade, setSelectedGrade] = useState<LevelTestGrade | null>(null);

  useEffect(() => {
    loadAttemptDetail();
  }, []);

  const loadAttemptDetail = async () => {
    setLoading(true);
    const response = await getAttemptDetail(attemptId);

    if (response.success && response.data) {
      setCustomerName(response.data.customerName);
      setTotalScore(response.data.totalScore);
      setQuestions(response.data.questions || []);

      // 기존 점수로 초기화
      const initialGrades: Record<number, number> = {};
      response.data.questions.forEach((q) => {
        initialGrades[q.questionId] = q.scoredAwarded;
      });
      setGrades(initialGrades);
    } else {
      alert(`오류: ${response.error}`);
      onClose(false);
    }
    setLoading(false);
  };

  const handleScoreChange = (questionId: number, score: number) => {
    setGrades((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedGrade) {
      alert('성적(A/B/C/D)을 선택해주세요.');
      return;
    }

    if (!confirm('채점 결과를 저장하시겠습니까?')) return;

    setLoading(true);

    // 단답형/서술형만 채점
    const gradesArray: QuestionGrade[] = questions
      .filter((q) => q.problemType !== 'MULTIPLE_CHOICE')
      .map((q) => ({
        questionId: q.questionId,
        responseId: q.responseId,
        score: grades[q.questionId] || 0,
      }));

    const response = await gradeAttempt(attemptId, gradesArray, selectedGrade);

    if (response.success) {
      alert('채점이 완료되었습니다.');
      onClose(true);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  // 객관식 선택지를 배열로 변환
  const getChoicesArray = (multipleChoice?: { choice1?: string; choice2?: string; choice3?: string; choice4?: string; choice5?: string }) => {
    if (!multipleChoice) return [];
    const choices: string[] = [];
    if (multipleChoice.choice1) choices.push(multipleChoice.choice1);
    if (multipleChoice.choice2) choices.push(multipleChoice.choice2);
    if (multipleChoice.choice3) choices.push(multipleChoice.choice3);
    if (multipleChoice.choice4) choices.push(multipleChoice.choice4);
    if (multipleChoice.choice5) choices.push(multipleChoice.choice5);
    return choices;
  };

  return (
    <CustomModal title="레벨테스트 채점" onClose={() => onClose(false)} size="2xl">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            응시자: {customerName} | 현재 점수: {totalScore}점
          </p>
        </div>

        {loading ? (
          <p className="text-center py-4 text-gray-500">로딩 중...</p>
        ) : (
          <>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">문제 {index + 1}</span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            question.problemType === 'MULTIPLE_CHOICE'
                              ? 'bg-blue-100 text-blue-800'
                              : question.problemType === 'SHORT_ANSWER'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {getProblemTypeLabel(question.problemType)}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-2">{question.content}</p>
                      {question.imageUrl && (
                        <img
                          src={question.imageUrl}
                          alt="문제 이미지"
                          className="max-w-md rounded border border-gray-300 mb-2"
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">배점</span>
                      <p className="text-lg font-bold text-gray-900">{question.score}점</p>
                    </div>
                  </div>

                  {/* 객관식 */}
                  {question.problemType === 'MULTIPLE_CHOICE' && question.multipleChoice && (
                    <div className="bg-blue-50 rounded p-3 mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">선택지:</p>
                      {getChoicesArray(question.multipleChoice).map((choice, idx) => (
                        <div
                          key={idx}
                          className="p-2 mb-1 rounded bg-white"
                        >
                          {idx + 1}. {choice}
                        </div>
                      ))}
                      <p className="text-sm font-medium text-green-900 mt-2">
                        자동 채점 결과: {question.scoredAwarded}점
                      </p>
                    </div>
                  )}

                  {/* 단답형/서술형 */}
                  {(question.problemType === 'SHORT_ANSWER' ||
                    question.problemType === 'SUBJECTIVE') && (
                    <>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">학생 답변:</p>
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {question.textAnswer?.answerText || '(답변 없음)'}
                        </p>
                      </div>

                      {/* 채점 입력 */}
                      <div className="flex items-center gap-4 bg-yellow-50 rounded p-3">
                        <label className="text-sm font-medium text-gray-700">부여 점수:</label>
                        <input
                          type="number"
                          min={0}
                          max={question.score}
                          value={grades[question.questionId] || 0}
                          onChange={(e) =>
                            handleScoreChange(question.questionId, Number(e.target.value))
                          }
                          className="w-24 p-2 border border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-600">/ {question.score}점</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 성적 선택 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">성적 부여 (필수)</p>
              <div className="flex gap-3">
                {(['A', 'B', 'C', 'D'] as LevelTestGrade[]).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`w-14 h-14 rounded-lg text-xl font-bold transition-all ${
                      selectedGrade === grade
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {!selectedGrade && (
                <p className="text-xs text-red-500 mt-2">채점 완료 전 성적을 선택해주세요.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => onClose(false)}>
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleSubmit} disabled={loading || !selectedGrade}>
                {loading ? '처리 중...' : '채점 완료'}
              </CustomButton>
            </div>
          </>
        )}
    </CustomModal>
  );
}
