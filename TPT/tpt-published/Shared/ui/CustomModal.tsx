// variant 총 4가지 
// 0: 버튼 없고, Overlay 클릭 시 닫힘
// 1: x 버튼 클릭 시 닫힘
// 2: [확인] 버튼 하나만 있고, 확인 버튼 클릭 시 닫힘
// 3: [확인] [취소] 버튼 중 취소 버튼 클릭 시 닫힘 (확인 버튼에는 onClcik 함수 부여 가능)

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

type ModalVariant = 0 | 1 | 2 | 3;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  bgColor?: string;
  borderRadius?: string;
  overlayColor?: string;
  className?: string;
  onConfirm?: () => void; // Variant 3에서 확인 버튼 클릭 시 호출될 함수
  children?: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  variant,
  width = "w-full",
  height = "h-auto",
  padding = "p-6",
  margin = "m-4",
  bgColor = "bg-white",
  borderRadius = "rounded-lg",
  overlayColor = "bg-black/50", // 반투명한 검정색
  className,
  onConfirm,
  children,
}) => {

  if (!isOpen) return null;

  // 공통 스타일
  const modalContentClasses = clsx(
    "fixed inset-0 flex items-center justify-center z-50",
    overlayColor // Overlay 스타일
  );

  const modalBoxClasses = clsx(
    "relative",
    width,
    height,
    bgColor,
    padding,
    margin,
    borderRadius,
    "shadow-xl",
    "overflow-y-auto max-h-[calc(100vh-4rem)]"
  );

  // Variant 0: Overlay 클릭 시 닫히는 모달
  if (variant === 0) {
    return ReactDOM.createPortal(
      <div className={modalContentClasses} onClick={onClose}>
        <div
          className={modalBoxClasses}
          onClick={(e) => e.stopPropagation()} // Overlay 클릭 시 닫히지 않도록 막기
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }

  // Variant 1: x 버튼이 우측 상단에 있고, x 버튼 클릭 시 닫히는 모달
  if (variant === 1) {
    return ReactDOM.createPortal(
      <div className={modalContentClasses} onClick={onClose}>
        <div
          className={modalBoxClasses}
          onClick={(e) => e.stopPropagation()} // Overlay 클릭 시 닫히지 않도록 막기
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-lg font-semibold cursor-pointer"
          >
            &times;
          </button>
          {children}
        </div>
      </div>,
      document.body
    );
  }

  // Variant 2: 확인 버튼이 하단 중앙에 있고, 확인 버튼 클릭 시 닫히는 모달
  if (variant === 2) {
    return ReactDOM.createPortal(
      <div className={modalContentClasses} onClick={onClose}>
        <div
          className={modalBoxClasses}
          onClick={(e) => e.stopPropagation()} // Overlay 클릭 시 닫히지 않도록 막기
        >
          {children}
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Variant 3: 확인 버튼과 취소 버튼이 하단에 있고, 취소 버튼 클릭 시 닫히는 모달
  if (variant === 3) {
    return ReactDOM.createPortal(
      <div className={modalContentClasses} onClick={onClose}>
        <div
          className={modalBoxClasses}
          onClick={(e) => e.stopPropagation()} // Overlay 클릭 시 닫히지 않도록 막기
        >
          {children}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm(); // onConfirm 함수가 있으면 호출
                onClose();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
};

export default CustomModal;
