'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import HardBreak from '@tiptap/extension-hard-break';
import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '../api/s3';

// 사용 가능한 폰트 목록
export const AVAILABLE_FONTS = [
  { value: 'default', label: '기본 폰트' },
  { value: 'noto-sans', label: 'Noto Sans KR' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'nanum-gothic', label: '나눔고딕' },
  { value: 'nanum-myeongjo', label: '나눔명조' },
  { value: 'gothic-a1', label: 'Gothic A1' },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectedFont?: string;
  onFontChange?: (font: string) => void;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  selectedFont = 'default',
  onFontChange,
  readOnly = false,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false, // StarterKit의 hardBreak 비활성화하고 별도로 설정
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      HardBreak.configure({
        keepMarks: true,
      }),
    ],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 에디터의 현재 색상 동기화
  useEffect(() => {
    if (editor) {
      const color = editor.getAttributes('textStyle').color;
      if (color) {
        setCurrentColor(color);
      }
    }
  }, [editor?.state.selection]);

  // value가 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

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

    setIsUploadingImage(true);
    try {
      // S3 업로드
      const response = await uploadImage(file, 'columns/content');
      if (response.success && response.data) {
        // 에디터에 이미지 삽입
        editor.chain().focus().setImage({ src: response.data.url }).run();
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingImage(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 이미지 삽입 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 폰트에 따른 스타일
  const getFontClassName = (font: string) => {
    const fontMap: Record<string, string> = {
      default: '',
      'noto-sans': 'font-noto-sans',
      roboto: 'font-roboto',
      'nanum-gothic': 'font-nanum-gothic',
      'nanum-myeongjo': 'font-nanum-myeongjo',
      'gothic-a1': 'font-gothic-a1',
    };
    return fontMap[font] || '';
  };

  if (!editor) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">에디터 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 폰트 선택 드롭다운 */}
      {onFontChange && !readOnly && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            폰트 선택:
          </label>
          <select
            value={selectedFont}
            onChange={(e) => onFontChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            선택한 폰트는 칼럼 전체에 적용됩니다
          </span>
        </div>
      )}

      {/* 툴바 */}
      {!readOnly && (
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-2">
          {/* 텍스트 스타일 */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('bold')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('italic')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('strike')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <s>S</s>
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 헤딩 */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H3
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 리스트 */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('bulletList')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            • 리스트
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('orderedList')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            1. 리스트
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 정렬 */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            왼쪽
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            가운데
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            오른쪽
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 이미지 삽입 */}
          <button
            onClick={handleImageButtonClick}
            disabled={isUploadingImage}
            className="px-3 py-1.5 rounded border text-sm bg-white border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isUploadingImage ? '업로드 중...' : '🖼️ 이미지'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 텍스트 색상 - RGB 팔레트 스포이드 */}
          <div className="relative flex items-center gap-1">
            <label
              className="px-3 py-1.5 rounded border text-sm bg-white border-gray-300 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              title="텍스트 색상 선택"
            >
              <span
                className="w-5 h-5 rounded border border-gray-400"
                style={{
                  backgroundColor: currentColor,
                }}
              />
              <span>색상</span>
              <input
                ref={colorInputRef}
                type="color"
                value={currentColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setCurrentColor(newColor);
                  editor?.chain().focus().setColor(newColor).run();
                }}
                className="w-0 h-0 opacity-0 absolute"
              />
            </label>
            {/* 색상 초기화 버튼 */}
            <button
              onClick={() => {
                setCurrentColor('#000000');
                editor?.chain().focus().unsetColor().run();
              }}
              className="px-2 py-1.5 rounded border text-xs bg-white border-gray-300 hover:bg-gray-100"
              type="button"
              title="색상 초기화"
            >
              초기화
            </button>
          </div>
        </div>
      )}

      {/* 에디터 영역 */}
      <div
        className={`${getFontClassName(selectedFont)} ${
          readOnly ? '' : 'border border-gray-300 rounded-b-lg'
        }`}
      >
        <EditorContent
          editor={editor}
          className={`prose max-w-none ${readOnly ? '' : 'min-h-[400px] p-4'}`}
        />
      </div>

      <style jsx global>{`
        /* TipTap 에디터 스타일 */
        .ProseMirror {
          min-height: 350px;
          outline: none;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .ProseMirror p {
          margin: 0;
          min-height: 1.5em;
          line-height: 1.75;
        }

        .ProseMirror p + p {
          margin-top: 0.75rem;
        }

        .ProseMirror br {
          display: block;
          content: "";
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1rem 0;
          line-height: 1.4;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75rem 0;
          line-height: 1.4;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5rem 0;
          line-height: 1.4;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* 색상이 적용된 텍스트 스타일 유지 */
        .ProseMirror span[style*="color"] {
          color: inherit;
        }

        /* 폰트 클래스 정의 */
        .font-noto-sans {
          font-family: 'Noto Sans KR', sans-serif;
        }

        .font-roboto {
          font-family: 'Roboto', sans-serif;
        }

        .font-nanum-gothic {
          font-family: 'Nanum Gothic', sans-serif;
        }

        .font-nanum-myeongjo {
          font-family: 'Nanum Myeongjo', serif;
        }

        .font-gothic-a1 {
          font-family: 'Gothic A1', sans-serif;
        }
      `}</style>
    </div>
  );
}
