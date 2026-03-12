'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getAttemptDetail,
  gradeAttempt,
  getProblemTypeLabel,
  type QuestionResponse,
  type QuestionGrade,
} from '../../api/leveltest';

interface GradingModalProps {
  attemptId: number;
  onClose: (reload?: boolean) => void;
}

export default function GradingModal({ attemptId, onClose }: GradingModalProps) {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [grades, setGrades] = useState<Record<number, number>>({});

  useEffect(() => {
    loadAttemptDetail();
  }, []);

  const loadAttemptDetail = async () => {
    setLoading(true);
    const response = await getAttemptDetail(attemptId);

    if (response.success && response.data) {
      setCustomerName(response.data.customerName);
      setTotalScore(response.data.totalScore);
      setResponses(response.data.responses || []);

      // 기존 점수로 초기화
      const initialGrades: Record<number, number> = {};
      response.data.responses.forEach((r) => {
        initialGrades[r.questionId] = r.scoreAwarded;
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
    if (!confirm('채점 결과를 저장하시겠습니까?')) return;

    setLoading(true);

    // 단답형/서술형만 채점
    const gradesArray: QuestionGrade[] = responses
      .filter((r) => r.problemType !== 'MULTIPLE_CHOICE')
      .map((r) => ({
        questionId: r.questionId,
        responseId: r.responseId,
        score: grades[r.questionId] || 0,
      }));

    const response = await gradeAttempt(attemptId, gradesArray);

    if (response.success) {
      alert('채점이 완료되었습니다.');
      onClose(true);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  return (
    <CustomModal title="레벨테스트 채점" onClose={() => onClose(false)} size="2xl">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            응시자: {customerName} | 현재 점수: {totalScore}점
          </p>
        </div>

        {loading && <p className="text-center py-4 text-gray-500">로딩 중...</p>}

        <div className="space-y-6">
          {responses.map((response, index) => (
            <div key={response.questionId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">문제 {index + 1}</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        response.problemType === 'MULTIPLE_CHOICE'
                          ? 'bg-blue-100 text-blue-800'
                          : response.problemType === 'SHORT_ANSWER'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {getProblemTypeLabel(response.problemType)}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2">{response.content}</p>
                  {response.imageUrl && (
                    <img
                      src={response.imageUrl}
                      alt="문제 이미지"
                      className="max-w-md rounded border border-gray-300 mb-2"
                    />
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">배점</span>
                  <p className="text-lg font-bold text-gray-900">{response.maxScore}점</p>
                </div>
              </div>

              {/* 객관식 */}
              {response.problemType === 'MULTIPLE_CHOICE' && (
                <div className="bg-blue-50 rounded p-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">선택지:</p>
                  {response.choices?.map((choice, idx) => (
                    <div
                      key={idx}
                      className={`p-2 mb-1 rounded ${
                        String(idx + 1) === response.choiceNumber
                          ? 'bg-blue-200 font-medium'
                          : 'bg-white'
                      }`}
                    >
                      {idx + 1}. {choice}
                    </div>
                  ))}
                  <p className="text-sm font-medium text-blue-900 mt-2">
                    학생 선택: {response.choiceNumber}번
                  </p>
                  <p className="text-sm font-medium text-green-900">
                    자동 채점 결과: {response.scoreAwarded}점
                  </p>
                </div>
              )}

              {/* 단답형/서술형 */}
              {(response.problemType === 'SHORT_ANSWER' ||
                response.problemType === 'SUBJECTIVE') && (
                <>
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">학생 답변:</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{response.answerText}</p>
                  </div>

                  {/* 채점 입력 */}
                  <div className="flex items-center gap-4 bg-yellow-50 rounded p-3">
                    <label className="text-sm font-medium text-gray-700">부여 점수:</label>
                    <input
                      type="number"
                      min={0}
                      max={response.maxScore}
                      value={grades[response.questionId] || 0}
                      onChange={(e) =>
                        handleScoreChange(response.questionId, Number(e.target.value))
                      }
                      className="w-24 p-2 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">/ {response.maxScore}점</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton variant="secondary" onClick={() => onClose(false)}>
            취소
          </CustomButton>
          <CustomButton variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '처리 중...' : '채점 완료'}
          </CustomButton>
        </div>
    </CustomModal>
  );
}
