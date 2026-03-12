'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRnRCalculation } from './useRnRCalculation';
import { getDateInfo } from '../../../Shared/utils/dateFormatter';

/**
 * 피드백 요청 폼 상태 관리 훅
 */
export function useFormState(riskTaking: number = 5) {
  const initialDate = new Date().toISOString().split('T')[0];
  const initialDateInfo = getDateInfo(initialDate);

  const [form, setForm] = useState({
    feedbackRequestDate: initialDate,
    feedbackYear: initialDateInfo.year,
    feedbackMonth: initialDateInfo.month,
    feedbackWeek: initialDateInfo.week,
    category: '',
    positionHoldingTime: '',
    operatingFundsRatio: '',
    entryPrice: '',
    exitPrice: '',
    riskTaking: riskTaking.toString(),
    leverage: '0',
    settingStopLoss: '',
    settingTakeProfit: '',
    positionStartReason: '',
    positionEndReason: '',
    tradingReview: '',
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [position, setPosition] = useState<'LONG' | 'SHORT' | null>(null);
  const [isPositive, setIsPositive] = useState(true);
  const [pl, setPl] = useState<number>(0);

  // useRnRCalculation 훅을 사용하여 R&R 자동 계산
  const rr = useRnRCalculation(pl, isPositive, Number(form.riskTaking));

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 날짜가 변경되면 주차 정보도 자동으로 업데이트
    if (name === 'feedbackRequestDate') {
      const dateInfo = getDateInfo(value);
      setForm((prev) => ({
        ...prev,
        feedbackRequestDate: value,
        feedbackYear: dateInfo.year,
        feedbackMonth: dateInfo.month,
        feedbackWeek: dateInfo.week,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 파일 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleWeekChange = useCallback((data: { month: number; week: number }) => {
    setForm((prev) => ({ ...prev, month: data.month, week: data.week }));
  }, []);

  return {
    form,
    setForm,
    screenshot,
    screenshotPreview,
    handleChange,
    handleFileChange,
    handleWeekChange,
    position,
    setPosition,
    isPositive,
    setIsPositive,
    pl,
    setPl,
    rr,
  };
}
