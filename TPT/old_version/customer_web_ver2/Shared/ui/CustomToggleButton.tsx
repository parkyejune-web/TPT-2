import React, { useState } from 'react';
import clsx from 'clsx';

type ToggleButtonProps = {
    text: string;  // 버튼 우측에 표시할 텍스트
    children: React.ReactNode;  // 토글 상태에서 표시할 내부 컴포넌트
};

const CustomToggleButton: React.FC<ToggleButtonProps> = ({ text, children }) => {
    const [isOpen, setIsOpen] = useState(false);  // 토글 상태 (열림/닫힘)

    // 클릭 시 토글 상태 변경
    const handleToggle = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <div className="w-auto">
            <div className="flex gap-1">
                {/* Toggle 버튼 */}
                <button
                    onClick={handleToggle}
                    className="flex justify-center items-center cursor-pointer"
                >
                    {/* 좌측 삼각형 모양 */}
                    <div
                        className={clsx(
                            // 'transition-transform transform', 
                            isOpen ? 'rotate-0' : 'rotate-270', // 회전
                            'mr-3'
                        )}
                        style={{ width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '10px solid black' }} // 삼각형 스타일
                    />
                </button>
                {/* 우측 텍스트 */}
                <span>{text}</span>
            </div>

            {/* Toggle 내용 (열리면 표시) */}
            {isOpen && (
                <div className="w-auto mt-2 p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CustomToggleButton;
