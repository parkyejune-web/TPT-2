'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import RichTextEditor from '../../components/RichTextEditor';
import type { Column, ColumnCategory } from '../../api/columns';
import { uploadImage } from '../../api/s3';
import Image from 'next/image';

interface ColumnFormModalProps {
  column?: Column | null; // null이면 새 칼럼 작성, 값이 있으면 수정
  categories: ColumnCategory[];
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    writerName: string;
    fontFamily: string;
    thumbnailImage?: string;
  }) => Promise<void>;
}

export default function ColumnFormModal({
  column,
  categories,
  onClose,
  onSubmit,
}: ColumnFormModalProps) {
  const isEditMode = !!column;

  const [title, setTitle] = useState(column?.title || '');
  const [subtitle, setSubtitle] = useState(column?.subtitle || '');
  const [content, setContent] = useState(column?.content || '');
  const [category, setCategory] = useState(column?.categoryName || '');
  const [writerName, setWriterName] = useState(column?.writerName || '');
  const [fontFamily, setFontFamily] = useState(column?.fontFamily || 'default');
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (column) {
      setTitle(column.title);
      setSubtitle(column.subtitle);
      setContent(column.content || '');
      setCategory(column.categoryName);
      setWriterName(column.writerName);
      setFontFamily(column.fontFamily || 'default');
    }
  }, [column]);

  // 썸네일 이미지 업로드 핸들러
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // S3 업로드
      const response = await uploadImage(file, 'columns/thumbnails');
      if (response.success && response.data) {
        setThumbnailImage(response.data.url);
        alert('썸네일이 업로드되었습니다.');
      } else {
        alert('썸네일 업로드에 실패했습니다.');
        setThumbnailPreview('');
      }
    } catch (error) {
      console.error('썸네일 업로드 오류:', error);
      alert('썸네일 업로드 중 오류가 발생했습니다.');
      setThumbnailPreview('');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // 썸네일 제거
  const handleRemoveThumbnail = () => {
    setThumbnailImage('');
    setThumbnailPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!subtitle.trim()) {
      alert('부제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!category.trim()) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!writerName.trim()) {
      alert('작성자 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        subtitle,
        content,
        category,
        writerName,
        fontFamily,
        thumbnailImage: thumbnailImage || undefined,
      });
      onClose();
    } catch (error) {
      console.error('칼럼 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal title={isEditMode ? '칼럼 수정' : '새 칼럼 작성'} onClose={onClose} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="칼럼 제목을 입력하세요"
              required
            />
          </div>

          {/* 부제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              부제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="칼럼 부제목을 입력하세요"
              required
            />
          </div>

          {/* 썸네일 이미지 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              썸네일 이미지
            </label>
            <div className="space-y-3">
              {thumbnailPreview ? (
                <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={thumbnailPreview}
                    alt="썸네일 미리보기"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    제거
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                      <p className="text-gray-600">
                        {isUploadingThumbnail ? '업로드 중...' : '클릭하여 썸네일 이미지 업로드'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        권장 크기: 1200x630px, 최대 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploadingThumbnail}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 카테고리와 작성자 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                작성자 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="작성자 이름"
                required
              />
            </div>
          </div>

          {/* 내용 (리치 텍스트 에디터) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="칼럼 내용을 작성하세요..."
              selectedFont={fontFamily}
              onFontChange={setFontFamily}
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </CustomButton>
            <CustomButton
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? '저장 중...'
                : isEditMode
                ? '수정 완료'
                : '작성 완료'}
            </CustomButton>
          </div>
        </form>
    </CustomModal>
  );
}
