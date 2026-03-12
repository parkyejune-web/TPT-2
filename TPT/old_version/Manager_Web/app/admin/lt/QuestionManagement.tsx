'use client';

import { useState, useEffect } from 'react';
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
