'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  createMultipleChoice,
  updateMultipleChoice,
  createShortAnswer,
  updateShortAnswer,
  createSubjective,
  updateSubjective,
  type LevelTestQuestionDetail,
  type ProblemType,
  type MultipleChoiceRequest,
  type TextAnswerRequest,
} from '../../api/leveltest';

interface QuestionFormModalProps {
  question: LevelTestQuestionDetail | null;
  onClose: (reload?: boolean) => void;
}

export default function QuestionFormModal({ question, onClose }: QuestionFormModalProps) {
  const [problemType, setProblemType] = useState<ProblemType>('MULTIPLE_CHOICE');
  const [content, setContent] = useState('');
  const [score, setScore] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  
  // 객관식 필드
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [choice3, setChoice3] = useState('');
  const [choice4, setChoice4] = useState('');
  const [choice5, setChoice5] = useState('');
  const [correctChoiceNum, setCorrectChoiceNum] = useState('1');
  
  // 주관식 필드
  const [answerText, setAnswerText] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setProblemType(question.problemType);
      setContent(question.content);
      setScore(question.score);
      
      if (question.multipleChoice) {
        setChoice1(question.multipleChoice.choice1 || '');
        setChoice2(question.multipleChoice.choice2 || '');
        setChoice3(question.multipleChoice.choice3 || '');
        setChoice4(question.multipleChoice.choice4 || '');
        setChoice5(question.multipleChoice.choice5 || '');
      }
      
      if (question.textAnswer) {
        setAnswerText(question.textAnswer.answerText || '');
      }
    }
  }, [question]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('문제 내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    let response;
    const isEdit = !!question;

    if (problemType === 'MULTIPLE_CHOICE') {
      if (!choice1 || !choice2) {
        alert('최소 2개의 선택지를 입력해주세요.');
        setLoading(false);
        return;
      }
      
      const data: MultipleChoiceRequest = {
        content,
        score,
        choice1,
        choice2,
        choice3,
        choice4,
        choice5,
        correctChoiceNum,
        problemType,
      };
      
      response = isEdit
        ? await updateMultipleChoice(question.questionId, data, image || undefined)
        : await createMultipleChoice(data, image || undefined);
    } else {
      if (!answerText.trim()) {
        alert('정답을 입력해주세요.');
        setLoading(false);
        return;
      }
      
      const data: TextAnswerRequest = {
        content,
        score,
        answerText,
        problemType,
      };
      
      if (problemType === 'SHORT_ANSWER') {
        response = isEdit
          ? await updateShortAnswer(question.questionId, data, image || undefined)
          : await createShortAnswer(data, image || undefined);
      } else {
        response = isEdit
          ? await updateSubjective(question.questionId, data, image || undefined)
          : await createSubjective(data, image || undefined);
      }
    }

    if (response.success) {
      alert(isEdit ? '문제가 수정되었습니다.' : '문제가 생성되었습니다.');
      onClose(true);
    } else {
      alert(`오류: ${response.error}`);
    }
    
    setLoading(false);
  };

  return (
    <CustomModal title={question ? '문제 수정' : '문제 생성'} onClose={() => onClose(false)} size="lg">
        <div className="space-y-4">
          {/* 문제 유형 선택 (생성 시에만) */}
          {!question && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">문제 유형</label>
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value as ProblemType)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="MULTIPLE_CHOICE">객관식</option>
                <option value="SHORT_ANSWER">단답형</option>
                <option value="SUBJECTIVE">서술형</option>
              </select>
            </div>
          )}

          {/* 문제 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">문제 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg"
              placeholder="문제를 입력하세요..."
            />
          </div>

          {/* 배점 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">배점</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              min={1}
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">문제 이미지 (선택)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 객관식 선택지 */}
          {problemType === 'MULTIPLE_CHOICE' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">선택지 1 *</label>
                  <input
                    value={choice1}
                    onChange={(e) => setChoice1(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">선택지 2 *</label>
                  <input
                    value={choice2}
                    onChange={(e) => setChoice2(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">선택지 3</label>
                  <input
                    value={choice3}
                    onChange={(e) => setChoice3(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">선택지 4</label>
                  <input
                    value={choice4}
                    onChange={(e) => setChoice4(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">선택지 5</label>
                  <input
                    value={choice5}
                    onChange={(e) => setChoice5(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정답 번호 (콤마로 구분, 예: 1,2)
                </label>
                <input
                  value={correctChoiceNum}
                  onChange={(e) => setCorrectChoiceNum(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="1,2"
                />
              </div>
            </>
          )}

          {/* 주관식 정답 */}
          {(problemType === 'SHORT_ANSWER' || problemType === 'SUBJECTIVE') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정답/모범답안</label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg"
                placeholder="정답 또는 모범답안을 입력하세요..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton variant="secondary" onClick={() => onClose(false)}>
            취소
          </CustomButton>
          <CustomButton variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '처리 중...' : question ? '수정' : '생성'}
          </CustomButton>
        </div>
    </CustomModal>
  );
}
