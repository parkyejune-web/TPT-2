// variant 총 2가지 
// 0: 단순 입력 필드
// 1: 단순 입력 필드 + 최대 글자수 제한 (우측 하단에 글자수 표시)

import React, { useState } from "react";
import clsx from "clsx";

type TextAreaVariant = 0 | 1;

interface TextAreaProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  bgColor?: string;
  borderColor?: string;
  borderRadius?: string;
  placeholder?: string;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => string | null;
  errorMessage?: string;
  variant: TextAreaVariant; // variant 추가
  className?: string;
}

const CustomTextArea: React.FC<TextAreaProps> = ({
  width = "w-full",
  height,
  padding = "px-2 py-1",
  margin,
  bgColor,
  borderColor = "border-gray-300",
  borderRadius = "rounded-md",
  placeholder,
  maxLength,
  value,
  onChange,
  validate,
  errorMessage,
  variant,
  className,
}) => {
  const [textValue, setTextValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);

    // 입력값 검증 함수가 존재하면 실행
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }

    // onChange로 부모 컴포넌트에 값 전달
    onChange(newValue);
  };

  return (
    <div className={clsx("flex flex-col", className)}>
      <textarea
        value={textValue}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          "border",
          borderColor,
          bgColor,
          borderRadius,
          padding,
          margin,
          width,
          height,
          "focus:outline-none focus:ring-2 focus:ring-blue-400"
        )}
      />
      {/* 최대 글자수 표시 (variant 1에서 사용) */}
      {maxLength && variant === 1 && (
        <div className="text-sm text-right mt-1">
          {textValue.length}/{maxLength}
        </div>
      )}

      {/* 오류 메시지 (validate 또는 errorMessage가 존재할 경우 표시) */}
      {(error || errorMessage) && (
        <div className="text-sm text-red-500 mt-1">
          {error || errorMessage}
        </div>
      )}
    </div>
  );
};

export default CustomTextArea;

/*
사용 에시:

import React, { useState } from "react";
import CustomTextArea from "./CustomTextArea";

// 예시 입력값 검증 함수
const validateText = (value: string) => {
  if (value.length < 5) {
    return "입력값은 최소 5자 이상이어야 합니다.";
  }
  return null;
};

const App = () => {
  const [textValue, setTextValue] = useState("");
  const [maxLength] = useState(50);

  const handleChange = (value: string) => {
    setTextValue(value);
  };

  return (
    <div className="p-6">
      <CustomTextArea
        variant={0} // variant 0 (단순 입력 필드)
        width="w-full"
        value={textValue}
        onChange={handleChange}
        placeholder="입력하세요"
      />

      <CustomTextArea
        variant={1} // variant 1 (최대 글자수 표시)
        width="w-full"
        value={textValue}
        onChange={handleChange}
        placeholder="입력하세요"
        maxLength={maxLength}
      />

      <CustomTextArea
        variant={1} // variant 1 (최대 글자수 표시)
        width="w-full"
        value={textValue}
        onChange={handleChange}
        placeholder="입력하세요"
        maxLength={maxLength}
        validate={validateText}
      />
    </div>
  );
};

export default App;

*/
