// 인증 코드 입력을 위한 모달 컴포넌트
"use client";
import React, { useState, useEffect } from "react";
import CustomModal from "./CustomModal";
import CustomInputField from "./CustomInputField";
import CustomButton from "./CustomButton";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  title: string;
  description: string;
  type: 'phone' | 'email';
  target: string; // 전화번호 또는 이메일
}

export default function VerificationModal({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
  type,
  target
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초
  const [isExpired, setIsExpired] = useState(false);

  // 타이머 관리
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError("");
      setTimeLeft(300);
      setIsExpired(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError("6자리 인증코드를 입력해주세요.");
      return;
    }

    if (isExpired) {
      setError("인증시간이 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const success = await onVerify(code);

      if (success) {
        onClose();
      } else {
        setError("인증코드가 일치하지 않습니다. 다시 확인해주세요.");
      }
    } catch (error) {
      setError("인증 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (!isVerifying) {
      onClose();
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} variant={1} width="max-w-lg">
      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
        <p className="text-gray-600 text-center mb-4">{description}</p>

        {/* 타겟 정보 표시 */}
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">
            {type === 'phone' ? '전화번호: ' : '이메일: '}
          </span>
          <span className="text-sm font-medium text-blue-600">{target}</span>
        </div>

        {/* 인증코드 입력 */}
        <div className="mb-4">
          <CustomInputField
            placeholder="인증코드 6자리"
            value={code}
            onChange={setCode}
            variant={2}
            maxLength={6}
            disabled={isExpired || isVerifying}
          />
        </div>

        {/* 타이머 및 상태 표시 */}
        <div className="text-center mb-4">
          {isExpired ? (
            <span className="text-red-500 text-sm">인증시간이 만료되었습니다</span>
          ) : (
            <span className="text-gray-500 text-sm">
              남은 시간: <span className="font-mono">{formatTime(timeLeft)}</span>
            </span>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-2">
          <CustomButton
            variant="normalClean"
            onClick={handleClose}
            disabled={isVerifying}
            width="flex-1"
          >
            취소
          </CustomButton>
          <CustomButton
            variant="normalFull"
            onClick={handleVerify}
            disabled={isExpired || isVerifying || !code}
            width="flex-1"
          >
            {isVerifying ? "인증 중..." : "확인"}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}