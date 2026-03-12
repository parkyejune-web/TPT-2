import React from 'react';
import clsx from 'clsx';

type NotionPageButtonProps = {
  number: number;          // 버튼 왼쪽에 표시될 숫자
  text: string;            // 버튼 오른쪽에 표시될 텍스트
  onClick: () => void;     // 클릭 시 실행될 함수
};

const NotionPageButton: React.FC<NotionPageButtonProps> = ({ number, text, onClick }) => {
  return (
    <div
      onClick={onClick}  // 클릭 시 onClick 이벤트 처리
      className="flex items-center gap-1 cursor-pointer w-full"
    >
      {/* 좌측 숫자 아이콘 */}
      <div className="w-5 h-5 p-3 bg-[#0F182B] rounded-sm flex items-center justify-center text-white font-semibold">
        {number}
      </div>

      {/* 우측 텍스트 div */}
      <div className="flex-1 text-start border-b-1 border-gray-300">
        <span className="text-gray-800">{text}</span>
      </div>
    </div>
  );
};

export default NotionPageButton;
