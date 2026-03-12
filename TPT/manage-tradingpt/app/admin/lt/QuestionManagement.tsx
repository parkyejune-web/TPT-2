'use client';

import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../components/CustomButton';
import {
  getQuestions,
  deleteQuestion,
  getProblemTypeLabel,
  type LevelTestQuestionDetail,
} from '../../api/leveltest';
import QuestionFormModal from './QuestionFormModal';

export default function QuestionManagement() {
  const [questions, setQuestions] = useState<LevelTestQuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<LevelTestQuestionDetail | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  // 문제 유형별 개수 계산
  const questionTypeCounts = useMemo(() => {
    const multipleChoice = questions.filter((q) => q.problemType === 'MULTIPLE_CHOICE').length;
    const shortAnswer = questions.filter((q) => q.problemType === 'SHORT_ANSWER').length;
    const subjective = questions.filter((q) => q.problemType === 'SUBJECTIVE').length;
    return { multipleChoice, shortAnswer, subjective };
  }, [questions]);

  // 조합 충족 여부 확인 (객관식 1개 이상 + 주관식(단답형/서술형) 1개 이상)
  const isValidCombination = useMemo(() => {
    const hasMultipleChoice = questionTypeCounts.multipleChoice >= 1;
    const hasSubjectiveType = (questionTypeCounts.shortAnswer + questionTypeCounts.subjective) >= 1;
    return hasMultipleChoice && hasSubjectiveType;
  }, [questionTypeCounts]);

  const loadQuestions = async () => {
    setLoading(true);
    const response = await getQuestions({ page: 0, size: 100 });
    if (response.success && response.data) {
      setQuestions(response.data.content || []);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (questionId: number) => {
    if (!confirm('이 문제를 삭제하시겠습니까?')) return;

    setLoading(true);
    const response = await deleteQuestion(questionId);
    if (response.success) {
      alert('문제가 삭제되었습니다.');
      loadQuestions();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setShowFormModal(true);
  };

  const handleEdit = (question: LevelTestQuestionDetail) => {
    setEditingQuestion(question);
    setShowFormModal(true);
  };

  const handleFormClose = (reload?: boolean) => {
    setShowFormModal(false);
    setEditingQuestion(null);
    if (reload) loadQuestions();
  };

  return (
    <div className="p-6">
      {/* 조합 유효성 경고 배너 */}
      {!isValidCombination && questions.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <span className="text-yellow-800 font-medium">
              레벨테스트 조합 필수 조건 미충족
            </span>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            레벨테스트는 <strong>객관식 1개 이상</strong> + <strong>주관식(단답형/서술형) 1개 이상</strong>의 조합이 필요합니다.
          </p>
          <div className="mt-2 text-sm text-yellow-700">
            현재: 객관식 {questionTypeCounts.multipleChoice}개 /
            단답형 {questionTypeCounts.shortAnswer}개 /
            서술형 {questionTypeCounts.subjective}개
            {questionTypeCounts.multipleChoice < 1 && (
              <span className="ml-2 text-red-600">→ 객관식 문제 추가 필요</span>
            )}
            {(questionTypeCounts.shortAnswer + questionTypeCounts.subjective) < 1 && (
              <span className="ml-2 text-red-600">→ 단답형/서술형 문제 추가 필요</span>
            )}
          </div>
        </div>
      )}

      {/* 조합 충족 배너 */}
      {isValidCombination && questions.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-green-800 font-medium">
              레벨테스트 조합 조건 충족
            </span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            객관식 {questionTypeCounts.multipleChoice}개 /
            단답형 {questionTypeCounts.shortAnswer}개 /
            서술형 {questionTypeCounts.subjective}개
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">문제 목록</h2>
        <CustomButton variant="primary" onClick={handleCreate}>
          문제 생성
        </CustomButton>
      </div>

      {loading && <p className="text-center py-4 text-gray-500">로딩 중...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                문제 유형
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                문제 내용
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                배점
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  등록된 문제가 없습니다.
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.questionId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{q.questionId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {getProblemTypeLabel(q.problemType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">
                    {q.content}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{q.score}점</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(q.questionId)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFormModal && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
