// variant 총 4가지 
// 0: 단순 입력 필드
// 1: 단순 입력 필드 + 최대 글자수 제한 (우측 하단에 글자수 표시)
// 2: 단순 입력 필드 + 입력값 추적, 입력값 검사하여 우측 하단에 오류 메시지 표시
// 3: 단순 입력 필드 + 입력 필드 내부 우측에 버튼 위치, 버튼 클릭 시 입력값 검사 함수 작동, 우측 하단에 오류 메시지 표시

import React, { useState } from "react";
import clsx from "clsx";

type InputFieldVariant = 0 | 1 | 2 | 3;

interface InputFieldProps {
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
  buttonLabel?: string; // 버튼 라벨 (Variant 3)
  onButtonClick?: () => void; // 버튼 클릭 시 실행되는 함수 (Variant 3)
  variant: InputFieldVariant; // variant 추가
  className?: string;
  type?: string; // input type 추가
  disabled?: boolean; // disabled 상태 추가
  id?: string;
  label?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
  required?: boolean;
  autoComplete?: string;
}

const CustomInputField: React.FC<InputFieldProps> = ({
  width = "w-full", // 기본값 일부러 설정해서 옵셔널 요소들과 위치 일치시키기 위함 
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
  buttonLabel,
  onButtonClick,
  variant,
  className,
  type = "text",
  disabled = false,
  id,
  label,
  "aria-describedby": ariaDescribedby,
  "aria-label": ariaLabel,
  required = false,
  autoComplete,
}) => {
  // const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // setInputValue(newValue);

    // 입력값 검증 함수가 존재하면 실행
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }

    // onChange로 부모 컴포넌트에 값 전달
    onChange(newValue);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      const validationError = validate ? validate(value) : null;
      if (!validationError) {
        onButtonClick();
      } else {
        setError(validationError);
      }
    }
  };

  const errorId = id ? `${id}-error` : undefined;
  const helpId = id ? `${id}-help` : undefined;

  return (
    <div className={clsx("flex flex-col w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="필수">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-describedby={clsx(
            ariaDescribedby,
            (error || errorMessage) && errorId,
            helpId
          )}
          aria-invalid={!!(error || errorMessage)}
          className={clsx(
            "border",
            borderColor,
            bgColor,
            borderRadius,
            padding,
            margin,
            width,
            disabled && "opacity-50 cursor-not-allowed",
            height,
            "focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors",
            (error || errorMessage) && "border-error-500 focus:ring-error-500",
            variant === 3 && "pr-16" // variant 3일 경우 버튼 공간을 위해 padding-right 추가
          )}
        />
        {variant === 3 && buttonLabel && (
          <button
            onClick={handleButtonClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-0.5 bg-blue-500 text-white text-sm rounded-md cursor-pointer"
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {/* 최대 글자수 표시 (variant 1에서 사용) */}
      {maxLength && variant !== 2 && (
        <div className="text-sm text-right mt-1">
          {value.length}/{maxLength}
        </div>
      )}

      {/* 오류 메시지 (variant 2와 3에서 사용) */}
      {(error || errorMessage) && (
        <div
          id={errorId}
          className="text-sm text-error-500 mt-1"
          role="alert"
          aria-live="polite"
        >
          {error || errorMessage}
        </div>
      )}
    </div>
  );
};

export default CustomInputField;

/*
사용 예시:

import React, { useState } from "react";
import CustomInputField from "./CustomInputField";

// 예시 입력값 검증 함수
const validateInput = (value: string) => {
  if (value.length < 3) {
    return "입력값은 최소 3자 이상이어야 합니다.";
  }
  return null;
};

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [maxLength] = useState(20);

  const handleChange = (value: string) => {
    setInputValue(value);
  };

  const handleButtonClick = () => {
    alert("버튼 클릭!");
  };

  return (
    <div className="p-6">
      <CustomInputField
        variant={3} // variant 3 (버튼 + 입력값 검증)
        width="w-full"
        value={inputValue}
        onChange={handleChange}
        placeholder="입력하세요"
        validate={validateInput}
        buttonLabel="검증"
        onButtonClick={handleButtonClick}
      />

      <CustomInputField
        variant={1} // variant 1 (최대 글자수 표시)
        width="w-full"
        value={inputValue}
        onChange={handleChange}
        placeholder="입력하세요"
        maxLength={maxLength}
      />

      <CustomInputField
        variant={2} // variant 2 (입력값 검증 + 오류 메시지 표시)
        width="w-full"
        value={inputValue}
        onChange={handleChange}
        placeholder="입력하세요"
        validate={validateInput}
      />
    </div>
  );
};

export default App;

*/
