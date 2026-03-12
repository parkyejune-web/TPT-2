'use client';

import { useState, useEffect } from 'react';
import { BookmarkX, Edit3, Check, X } from 'lucide-react';
import { getMemo, createOrUpdateMemo } from '../../Shared/api/services/memoService';

interface WrongAnswerNoteProps {
  className?: string;
}

/**
 * 오답노트 컴포넌트 - API 연동 (프리미엄 UI)
 */
export default function WrongAnswerNote({ className = '' }: WrongAnswerNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 메모 불러오기
  useEffect(() => {
    const fetchMemo = async () => {
      try {
        setLoading(true);
        const response = await getMemo();
        if (response.success && response.data) {
          setTitle(response.data.title);
          setContent(response.data.content);
        }
      } catch (err) {
        // 404는 메모가 없는 경우이므로 무시
        console.log('[WrongAnswerNote] 메모 없음');
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, []);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    try {
      setSaving(true);
      const response = await createOrUpdateMemo({ title, content });
      if (response.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error('[WrongAnswerNote] 저장 실패:', err);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 저장된 데이터로 되돌리기
  };

  // 빈 상태일 때 자동으로 편집 모드
  useEffect(() => {
    if (!loading && !title && !content) {
      setIsEditing(true);
    }
  }, [loading, title, content]);

  if (loading) {
    return (
      <div className={`bg-[#D9D9D9] rounded-xl p-8 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#F8F8F8] rounded-xl p-8 ${className}`}
      onDoubleClick={() => !isEditing && setIsEditing(true)}
    >
      {/* 상단 인용구 및 안내 문구 */}
      <div className="flex flex-col gap-3 mb-6">
        <p className="text-xl md:text-md text-center font-bold text-[#989898]">
          "실패의 원인을 복기하는 그 순간부터, 그 매매는 더이상 실패가 아니게 된다."
        </p>

        <div className="border-t border-gray-400" />

        <p className="text-sm text-center text-gray-400">
          매매 전 유념해야할 체크리스트, 지난 매매를 돌아보며 반성할 지점 등을 고민해보세요.
          <br />
          남들에게 보여주는 기록이 아니라, 나만 보는 진짜 기록입니다. 숨기지 말고 마주하세요.
        </p>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-[#989898]">NOTE.</h3>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-400"
          >
            <Edit3 className="w-3.5 h-3.5" />
            수정
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none placeholder:text-gray-400 transition-all"
            autoFocus
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="손실 매매 분석 및 개선 사항을 기록하세요"
            rows={4}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none resize-none placeholder:text-gray-400 transition-all leading-relaxed"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all border border-gray-400"
            >
              <X className="w-4 h-4" />
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {title && (
            <h4 className="text-sm font-bold text-gray-900 leading-snug text-left">{title}</h4>
          )}
          {content && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap text-left">
              {content}
            </p>
          )}
          {/* <p className="text-xs text-gray-500 pt-1">
            더블클릭하여 수정
          </p> */}
        </div>
      )}
    </div>
  );
}
