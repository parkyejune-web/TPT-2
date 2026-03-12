'use client';

import { useState, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import CustomModal from '../../Shared/ui/CustomModal';
import { User } from '../../Shared/store/authStore';
import WeekSelector from './WeekSelector';
import CustomDivider from '../../Shared/ui/CustomDivider';
import { FixedModalButton } from '../../Shared/ui/FixedModalButton';
import EntryTable from './EntryTable';
import { useRnRCalculation } from './hooks/useRnRCalculation';
import { useRiskTakingCalculation } from './hooks/useRiskTakingCalculation';
import { useTotalAssetPnlCalculation } from './hooks/useTotalAssetPnlCalculation';
import { getTimeframeOptions } from './constants/timeframes';

type Props = {
  onSubmit: (data: any) => void;
  currentUser: User;
  riskTaking?: number;
  isEditMode?: boolean;
  initialData?: any;
  onCancel?: () => void;
};

const investmentTypeMap: Record<string, string> = {
  SWING: '스윙',
  DAY: '데이',
  SCALPING: '스켈핑',
};

const completionMap: Record<string, string> = {
  BEFORE_COMPLETION: '완강 전',
  AFTER_COMPLETION: '완강 후',
};

// 진입 타점 표시용 헬퍼 함수
const getDisplayEntryPoint = (value: string): string => {
  const map: Record<string, string> = {
    REVERSE: '역배열',
    PULL_BACK: '풀백',
    BREAK_OUT: '브레이크아웃',
  };
  return map[value] || value;
};

// 등급 표시용 헬퍼 함수
const getDisplayGrade = (value: string): string => {
  const map: Record<string, string> = {
    S_PLUS: 'S+',
    S: 'S',
    A: 'A',
    B: 'B',
    NONE: '없음',
  };
  return map[value] || value;
};

/**
 * 스윙 투자 + 완강 후 프리미엄 회원용 피드백 요청 폼
 * isEditMode가 true인 경우 수정 모드로 동작
 */
export default function SwingAfterForm({ onSubmit, currentUser, riskTaking = 5, isEditMode = false, initialData, onCancel }: Props) {
  const investmentType = currentUser.investmentType || 'SWING';
  const completion = currentUser.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';
  const userLevel = currentUser.isPremium ? 'PREMIUM' : 'BASIC';

  const investmentTypeLabel = investmentTypeMap[investmentType] || investmentType;
  const completionLabel = completionMap[completion] || completion;
  const membershipLabel = userLevel === 'PREMIUM' ? 'Pro' : '무료';

  // 투자 유형에 따른 타임프레임 옵션
  const timeframeOptions = useMemo(() => ({
    direction: getTimeframeOptions(investmentType as any, 'direction'),
    main: getTimeframeOptions(investmentType as any, 'main'),
    sub: getTimeframeOptions(investmentType as any, 'sub'),
  }), [investmentType]);

  // 상태 (수정 모드일 경우 initialData에서 초기값 가져옴)
  const [category, setCategory] = useState(initialData?.category || '');
  const [recordDate, setRecordDate] = useState(initialData?.feedbackRequestDate || new Date().toISOString().split('T')[0]);
  const [entryDate, setEntryDate] = useState(initialData?.positionStartDate || '');
  const [exitDate, setExitDate] = useState(initialData?.positionEndDate || '');
  const [trendAnalysis, setTrendAnalysis] = useState(initialData?.trendAnalysis || '');
  const [tradingReview, setTradingReview] = useState(initialData?.tradingReview || '');
  const [trainerFeedback, setTrainerFeedback] = useState(initialData?.trainerFeedbackRequestContent || '');

  // 프레임 선택
  const [directionFrame, setDirectionFrame] = useState(initialData?.directionFrame || '');
  const [mainFrame, setMainFrame] = useState(initialData?.mainFrame || '');
  const [subFrame, setSubFrame] = useState(initialData?.subFrame || '');

  // A-div (포지션 진입) 필드들
  const [directionFrameExists, setDirectionFrameExists] = useState<boolean | null>(
    initialData?.directionFrameExists ?? null
  );
  const [entryPoint1, setEntryPoint1] = useState<string>(initialData?.entryPoint1 || initialData?.entryPoint || '');
  const [grade1, setGrade1] = useState<string>(initialData?.grade || '');
  const [displayEntryPoint1, setDisplayEntryPoint1] = useState<string>(
    getDisplayEntryPoint(initialData?.entryPoint1 || initialData?.entryPoint || '')
  );
  const [displayGrade1, setDisplayGrade1] = useState<string>(
    getDisplayGrade(initialData?.grade || '')
  );
  const [additionalBuyCount, setAdditionalBuyCount] = useState<number | ''>(initialData?.additionalBuyCount ?? '');
  const [splitSellCount, setSplitSellCount] = useState<number | ''>(initialData?.splitSellCount ?? '');
  const [leverage, setLeverage] = useState<number | ''>(initialData?.leverage ?? '');
  const [leverageError, setLeverageError] = useState<string>('');
  const [operatingFundsRatio, setOperatingFundsRatio] = useState<number | ''>(initialData?.operatingFundsRatio ?? '');
  const [operatingFundsRatioError, setOperatingFundsRatioError] = useState<string>('');

  // B-div (결과) 필드들
  const [position, setPosition] = useState<'LONG' | 'SHORT' | null>(initialData?.position || null);
  const initialPl = initialData?.pnl ?? '';
  const [isPositive, setIsPositive] = useState(initialPl >= 0);
  const [pl, setPl] = useState<number | ''>(initialPl !== '' ? Math.abs(initialPl) : '');
  const [entryPrice, setEntryPrice] = useState<number | ''>(initialData?.entryPrice ?? '');
  const [exitPrice, setExitPrice] = useState<number | ''>(initialData?.exitPrice ?? '');
  const [settingStopLoss, setSettingStopLoss] = useState<number | ''>(initialData?.settingStopLoss ?? '');
  const [settingTakeProfit, setSettingTakeProfit] = useState<number | ''>(initialData?.settingTakeProfit ?? '');

  // 자동 계산 필드 (빈 문자열을 0으로 변환)
  const riskTakingValue = useRiskTakingCalculation(
    typeof entryPrice === 'number' ? entryPrice : 0,
    typeof settingStopLoss === 'number' ? settingStopLoss : 0,
    typeof leverage === 'number' ? leverage : 0
  );
  const totalAssetPnl = useTotalAssetPnlCalculation(
    typeof pl === 'number' ? pl : 0,
    isPositive,
    typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0
  );
  const rr = useRnRCalculation(
    typeof pl === 'number' ? pl : 0,
    isPositive,
    riskTakingValue
  );

  // 주차 선택
  const [selectedWeek, setSelectedWeek] = useState<{ month: number; week: number } | null>(null);

  // 진입 타점 모달
  const [isOpen, setIsOpen] = useState(false);
  // 날짜 수정 불가 모달 상태
  const [isDateEditNotAllowedModalOpen, setIsDateEditNotAllowedModalOpen] = useState(false);

  const handleSelect1 = (data: { target: string; grade: string; displayTarget: string; displayGrade: string }) => {
    setEntryPoint1(data.target);
    setGrade1(data.grade);
    setDisplayEntryPoint1(data.displayTarget);
    setDisplayGrade1(data.displayGrade);
    setIsOpen(false);
  };

  // 스크린샷 파일 (multiple)
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>(
    initialData?.screenshotImageUrls || []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setScreenshotFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshotFiles((prev) => prev.filter((_, i) => i !== index));
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    document.getElementById('screenshotInput')?.click();
  };

  // 클립보드 붙여넣기 핸들러
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      setScreenshotFiles((prev) => [...prev, ...imageFiles]);
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // 주차 선택
  const handleWeekChange = useCallback((data: { month: number; week: number }) => {
    setSelectedWeek(data);
  }, []);

  // Entry/Exit Price 검증 함수
  const validatePrices = (): boolean => {
    // Entry Price와 Exit Price가 입력되지 않은 경우 검증 스킵
    if (!entryPrice || !exitPrice || !position) {
      return true;
    }

    const plNumber = typeof pl === 'number' ? pl : 0;
    const actualPl = isPositive ? plNumber : -plNumber;

    // 롱 포지션 검증
    if (position === 'LONG') {
      if (actualPl > 0 && exitPrice <= entryPrice) {
        alert('롱 포지션에서 P&L이 양수인 경우, Exit Price는 Entry Price보다 높아야 합니다.');
        return false;
      }
      if (actualPl < 0 && exitPrice >= entryPrice) {
        alert('롱 포지션에서 P&L이 음수인 경우, Exit Price는 Entry Price보다 낮아야 합니다.');
        return false;
      }
    }

    // 숏 포지션 검증
    if (position === 'SHORT') {
      if (actualPl > 0 && exitPrice >= entryPrice) {
        alert('숏 포지션에서 P&L이 양수인 경우, Exit Price는 Entry Price보다 낮아야 합니다.');
        return false;
      }
      if (actualPl < 0 && exitPrice <= entryPrice) {
        alert('숏 포지션에서 P&L이 음수인 경우, Exit Price는 Entry Price보다 높아야 합니다.');
        return false;
      }
    }

    return true;
  };

  // 폼 제출 처리 (엔터키 방지)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출은 버튼 클릭으로만 처리
  };

  // 실제 제출 처리
  const handleActualSubmit = () => {
    // Entry/Exit Price 검증
    if (!validatePrices()) {
      return;
    }

    // 실제 P&L 값 (부호 적용)
    const actualPl = typeof pl === 'number' ? (isPositive ? pl : -pl) : 0;

    // 주차 정보를 year, month, week로 분리
    const weekInfo = selectedWeek
      ? {
          year: new Date().getFullYear(),
          month: selectedWeek.month,
          week: selectedWeek.week,
        }
      : null;

    const formData = {
      // 필수: 코스 및 멤버십 정보
      courseStatus: completion,
      membershipLevel: userLevel,

      // 필수: 주차 정보
      selectedWeek: weekInfo,

      // 필수: 기록 날짜
      recordDate,

      // 필수: 기본 정보
      screenshotFiles,
      category,
      position,
      riskTaking: riskTakingValue,
      leverage: typeof leverage === 'number' ? leverage : 0,
      operatingFundsRatio: typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0,
      pl: actualPl,
      rr,
      totalAssetPnl,

      // 완강 후 필수: 날짜 정보
      entryDate,
      exitDate,

      // 완강 후 필수: 프레임 정보
      directionFrame,
      mainFrame,
      subFrame,
      directionFrameExists,

      // 완강 후 필수: 추세 분석
      trendAnalysis,

      // 완강 후 필수: 진입 타점
      entryPoint1,
      grade1,

      // 선택: 추가 매수/분할 매도
      additionalBuyCount: additionalBuyCount === '' ? undefined : additionalBuyCount,
      splitSellCount: splitSellCount === '' ? undefined : splitSellCount,

      // 필수: Entry/Exit/StopLoss/TakeProfit
      entryPrice: typeof entryPrice === 'number' ? entryPrice : 0,
      exitPrice: typeof exitPrice === 'number' ? exitPrice : 0,
      settingStopLoss: typeof settingStopLoss === 'number' ? settingStopLoss : 0,
      settingTakeProfit: settingTakeProfit === '' ? undefined : settingTakeProfit,

      // 선택: 복기 및 피드백 요청
      tradingReview,
      trainerFeedback,
    };

    console.log('[SwingAfterForm] 제출 데이터:', formData);
    onSubmit(formData);
  };

  // 수정 모드에서 직접 제출
  const handleEditSubmit = () => {
    if (!validatePrices()) {
      return;
    }

    const actualPl = typeof pl === 'number' ? (isPositive ? pl : -pl) : 0;

    const formData = {
      category,
      position,
      pnl: actualPl,
      totalAssetPnl,
      rnr: rr,
      riskTaking: riskTakingValue,
      leverage: typeof leverage === 'number' ? leverage : 0,
      operatingFundsRatio: typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0,
      entryPrice: typeof entryPrice === 'number' ? entryPrice : 0,
      exitPrice: typeof exitPrice === 'number' ? exitPrice : 0,
      settingStopLoss: typeof settingStopLoss === 'number' ? settingStopLoss : 0,
      settingTakeProfit: settingTakeProfit === '' ? undefined : settingTakeProfit,
      positionHoldingTime: undefined,
      positionStartReason: undefined,
      positionEndReason: undefined,
      tradingReview: tradingReview || undefined,
      directionFrameExists,
      directionFrame: directionFrame || undefined,
      mainFrame: mainFrame || undefined,
      subFrame: subFrame || undefined,
      trendAnalysis: trendAnalysis || undefined,
      trainerFeedbackRequestContent: trainerFeedback || undefined,
      entryPoint: entryPoint1 || undefined,
      grade: grade1 || undefined,
      additionalBuyCount: additionalBuyCount === '' ? undefined : additionalBuyCount,
      splitSellCount: splitSellCount === '' ? undefined : splitSellCount,
      positionStartDate: entryDate || undefined,
      positionEndDate: exitDate || undefined,
      isEditMode: true,
    };

    console.log('[SwingAfterForm] 수정 제출 데이터:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      {/* 상단: 투자유형, 완강여부, 유료/무료, 주차 */}
      <div className="flex items-center gap-3 mb-6">
        {/* 투자유형 뱃지 - 현재 데이 유형만 사용하므로 주석처리 */}
        {/* <span
          className={`px-3 py-1 text-white rounded ${
            investmentType === 'SWING'
              ? 'bg-orange-400'
              : investmentType === 'DAY'
                ? 'bg-[#2AC287]'
                : 'bg-sky-400'
          }`}
        >
          {investmentTypeLabel}
        </span> */}
        <span className="px-3 py-1 border rounded">{completionLabel}</span>
        <span
          className={`px-3 py-1 text-white rounded ${
            userLevel === 'PREMIUM' ? 'bg-gradient-to-r from-[#D2C693] to-[#928346]' : 'bg-gray-500'
          }`}
        >
          {membershipLabel}
        </span>
      </div>

      <WeekSelector onChange={handleWeekChange} />

      {/* 날짜 */}
      <div>
        <label className="block mb-1 font-medium">매매 날짜</label>
        {isEditMode ? (
          <div
            onClick={() => setIsDateEditNotAllowedModalOpen(true)}
            className="border border-gray-300 rounded p-2 w-full cursor-not-allowed bg-gray-100 text-gray-600"
          >
            {recordDate}
          </div>
        ) : (
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            min={currentUser.signedAt}
            className="border border-gray-300 rounded p-2 w-full cursor-pointer hover:border-[#B9AB70] focus:border-[#B9AB70] focus:ring-1 focus:ring-[#B9AB70] transition-all"
          />
        )}
      </div>

      {/* 종목 */}
      <div>
        <label className="block mb-1 font-medium">종목</label>
        <input
          type="text"
          placeholder="투자 종목을 입력하세요."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#F4F4F4] rounded p-2 w-full"
        />
      </div>

      {/* 포지션 진입/종료 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">포지션 진입 날짜</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">포지션 종료 날짜</label>
          <input
            type="date"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full cursor-pointer"
          />
        </div>
      </div>

      {/* 스크린샷 업로드 */}
      <div>
        <label className="block mb-1 font-medium">스크린샷 업로드</label>
        <div
          className="w-full min-h-40 rounded bg-[#F4F4F4] flex items-center justify-center cursor-pointer p-4 focus:outline-none focus:ring-2 focus:ring-[#B9AB70]"
          onClick={handleUploadClick}
          onPaste={handlePaste}
          tabIndex={0}
        >
          {screenshotPreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              {screenshotPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`screenshot ${index + 1}`} className="object-contain w-full h-32 rounded" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveScreenshot(index);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">클릭하여 업로드하거나 Ctrl+V로 붙여넣기</span>
          )}
        </div>
        <input type="file" id="screenshotInput" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {/* 프레임 선택 */}
      <div className="flex gap-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <label className="block mb-1 text-sm">디렉션 프레임</label>
          <FixedModalButton options={timeframeOptions.direction} defaultValue="선택" onSelect={setDirectionFrame} />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <label className="block mb-1 text-sm">메인 프레임</label>
          <FixedModalButton options={timeframeOptions.main} defaultValue="선택" onSelect={setMainFrame} />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <label className="block mb-1 text-sm">서브 프레임</label>
          <FixedModalButton options={timeframeOptions.sub} defaultValue="선택" onSelect={setSubFrame} />
        </div>
      </div>

      {/* === 2-Column Layout: [포지션 진입] | [결과] === */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* A-div: 포지션 진입 */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="font-semibold text-lg">[포지션 진입]</h3>

          {/* 디렉션 프레임 방향성 유무 */}
          <div>
            <label className="block mb-1 font-medium">디렉션 프레임 방향성 유무</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDirectionFrameExists(true)}
                className={`px-4 py-2 cursor-pointer rounded ${
                  directionFrameExists === true ? 'bg-[#273042] text-white' : 'bg-[#F4F4F4] text-black'
                }`}
              >
                O
              </button>
              <button
                type="button"
                onClick={() => setDirectionFrameExists(false)}
                className={`px-4 py-2 cursor-pointer rounded ${
                  directionFrameExists === false ? 'bg-[#273042] text-white' : 'bg-[#F4F4F4] text-black'
                }`}
              >
                X
              </button>
            </div>
          </div>

          {/* 추세 분석 (드롭다운) */}
          <div>
            <label className="block mb-1 font-medium">추세 분석</label>
            <select
              value={trendAnalysis}
              onChange={(e) => setTrendAnalysis(e.target.value)}
              className="bg-[#F4F4F4] rounded p-2 w-full"
            >
              <option value="">선택하세요</option>
              <option value="강한 상승 추세">강한 상승 추세</option>
              <option value="약한 상승 추세">약한 상승 추세</option>
              <option value="횡보">횡보</option>
              <option value="약한 하락 추세">약한 하락 추세</option>
              <option value="강한 하락 추세">강한 하락 추세</option>
            </select>
          </div>

          {/* 진입 타점 */}
          <div>
            <label className="block mb-1 font-medium">진입 타점</label>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 border border-gray-300 text-black rounded text-sm cursor-pointer w-full text-left"
            >
              {displayEntryPoint1 && displayGrade1 ? `${displayEntryPoint1}, ${displayGrade1}` : '선택하세요'}
            </button>
            <EntryTable isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelect1} />
          </div>

          {/* 추가 매수 횟수 */}
          <div>
            <label className="block mb-1 font-medium">추가 매수 횟수</label>
            <input
              type="number"
              placeholder="선택사항"
              value={additionalBuyCount}
              onChange={(e) => setAdditionalBuyCount(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* 분할 매도 횟수 */}
          <div>
            <label className="block mb-1 font-medium">분할 매도 횟수</label>
            <input
              type="number"
              placeholder="선택사항"
              value={splitSellCount}
              onChange={(e) => setSplitSellCount(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* 레버리지 */}
          <div>
            <label className="block mb-1 font-medium">레버리지</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={leverage}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setLeverage(value);
                  if (typeof value === 'number' && value > 125) {
                    setLeverageError('레버리지는 125가 최대입니다.');
                  } else {
                    setLeverageError('');
                  }
                }}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="레버리지 입력"
                className="bg-[#F4F4F4] rounded p-2 flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-gray-600">배</span>
            </div>
            {leverageError && (
              <div className="text-right text-red-500 text-sm mt-1">{leverageError}</div>
            )}
          </div>

          {/* 비중 (운용 자금 대비) */}
          <div>
            <label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={operatingFundsRatio}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setOperatingFundsRatio(value);
                  if (typeof value === 'number' && value > 100) {
                    setOperatingFundsRatioError('비중은 100이 최대입니다.');
                  } else {
                    setOperatingFundsRatioError('');
                  }
                }}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="비중 입력"
                className="bg-[#F4F4F4] rounded p-2 flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-gray-600">%</span>
            </div>
            {operatingFundsRatioError && (
              <div className="text-right text-red-500 text-sm mt-1">{operatingFundsRatioError}</div>
            )}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300"></div>

        {/* B-div: 결과 */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="font-semibold text-lg">[결과]</h3>

          {/* 포지션 */}
          <div>
            <label className="block mb-1 font-medium">포지션</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPosition('LONG')}
                className={`flex-1 px-4 py-2 cursor-pointer rounded ${
                  position === 'LONG' ? 'bg-[#2AC287] text-white' : 'bg-[#F4F4F4] text-black'
                }`}
              >
                Long
              </button>
              <button
                type="button"
                onClick={() => setPosition('SHORT')}
                className={`flex-1 px-4 py-2 cursor-pointer rounded ${
                  position === 'SHORT' ? 'bg-[#F74C5F] text-white' : 'bg-[#F4F4F4] text-black'
                }`}
              >
                Short
              </button>
            </div>
          </div>

          {/* P&L */}
          <div className="flex items-center gap-3">
            <span className="font-semibold">P&L:</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1 border rounded ${
                  isPositive ? 'bg-[#2AC287] text-white' : 'bg-white text-[#2AC287] border-[#2AC287]'
                }`}
                onClick={() => setIsPositive(true)}
              >
                +
              </button>
              <button
                type="button"
                className={`px-3 py-1 border rounded ${
                  !isPositive ? 'bg-[#F74C5F] text-white' : 'bg-white text-[#F74C5F] border-[#F74C5F]'
                }`}
                onClick={() => setIsPositive(false)}
              >
                -
              </button>
            </div>
            <input
              type="number"
              value={pl}
              onChange={(e) => setPl(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="P&L"
              className="w-20 border rounded p-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span>%</span>
          </div>

          {/* Entry Price */}
          <div>
            <label className="block mb-1 font-medium">Entry Price</label>
            <input
              type="number"
              placeholder="진입가"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* Exit Price */}
          <div>
            <label className="block mb-1 font-medium">Exit Price</label>
            <input
              type="number"
              placeholder="탈출가"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* 스탑로스 */}
          <div>
            <label className="block mb-1 font-medium">스탑로스</label>
            <input
              type="number"
              placeholder="손절가"
              value={settingStopLoss}
              onChange={(e) => setSettingStopLoss(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* 설정 익절가 */}
          <div>
            <label className="block mb-1 font-medium">설정 익절가</label>
            <input
              type="number"
              placeholder="선택 사항"
              value={settingTakeProfit}
              onChange={(e) => setSettingTakeProfit(e.target.value === '' ? '' : Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-[#F4F4F4] rounded p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* 리스크 테이킹 (자동 계산) */}
          <div>
            <label className="block mb-1 font-medium">리스크 테이킹</label>
            <div className="bg-gray-100 rounded p-2 w-full text-gray-700">
              {riskTakingValue.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <CustomDivider variant="horizontal" />

      {/* === Row: 전체 자산 기준 P&L | R&R 값 === */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 전체 자산 기준 P&L */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">전체 자산 기준 P&L</label>
          <div className="bg-gray-100 rounded p-2 w-full text-gray-700">
            {totalAssetPnl.toFixed(2)}%
          </div>
        </div>

        {/* R&R 값 */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">R&R (손익비 및 리스크 테이킹 성공 여부)</label>
          <div className="bg-gray-100 rounded p-2 w-full text-gray-700">
            {rr}
          </div>
        </div>
      </div>

      {/* R&R 게이지바 - 별도 행 (전체 너비) */}
      <div className="relative w-full h-32">
        {/* 점선 포물선 SVG */}
        <svg className="absolute top-0 left-0 w-full h-20" viewBox="0 0 600 80" preserveAspectRatio="none">
          {/* 빨간색 포물선 (-3 ~ -1, 왼쪽 1/3 영역) */}
          <path
            d="M 0 75 Q 100 0, 200 75"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          {/* 초록색 포물선 (-1 ~ 3, 오른쪽 2/3 영역) */}
          <path
            d="M 200 75 Q 400 0, 600 75"
            fill="none"
            stroke="#16A34A"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </svg>

        {/* 포물선 중앙 텍스트 */}
        <span className="absolute text-red-500 font-semibold text-sm" style={{ left: '16.67%', top: '12px', transform: 'translateX(-50%)' }}>
          Fail
        </span>
        <span className="absolute text-green-600 font-semibold text-sm" style={{ left: '66.67%', top: '12px', transform: 'translateX(-50%)' }}>
          Success
        </span>

        {/* 기준선 */}
        <div className="absolute top-[76px] w-full border-t border-gray-300" />

        {/* 숫자 눈금 */}
        <div className="absolute top-[82px] w-full flex justify-between text-xs text-gray-500">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}>{-3 + i}</span>
          ))}
        </div>

        {/* 삼각형 마커 */}
        <div
          className={`absolute ${
            (() => {
              const gaugeMin = -3;
              const gaugeMax = 3;
              const normalized = Math.min(Math.max(rr, gaugeMin), gaugeMax);
              if (normalized <= -1) return 'text-red-500';
              if (normalized >= 1) return 'text-green-600';
              return 'text-gray-500';
            })()
          }`}
          style={{
            top: '60px',
            left: `${(() => {
              const gaugeMin = -3;
              const gaugeMax = 3;
              const normalized = Math.min(Math.max(rr, gaugeMin), gaugeMax);
              return ((normalized - gaugeMin) / (gaugeMax - gaugeMin)) * 100;
            })()}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ▼
        </div>
      </div>

      {/* 매매 복기 */}
      <div>
        <label className="block mb-1 font-medium">매매 복기</label>
        <textarea
          className="bg-[#F4F4F4] rounded p-2 w-full h-24"
          value={tradingReview}
          onChange={(e) => setTradingReview(e.target.value)}
        />
      </div>

      {/* 피드백 */}
      <div>
        <label className="block mb-1 font-medium">TPT 분석가 피드백 요청 사항</label>
        <textarea
          className="bg-[#F4F4F4] rounded p-2 w-full h-24"
          value={trainerFeedback}
          onChange={(e) => setTrainerFeedback(e.target.value)}
        />
      </div>

      {/* 제출 */}
      <div className="flex gap-3 mb-20">
        {isEditMode ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="w-1/3 bg-gray-300 text-gray-800 py-3 rounded cursor-pointer hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              className="w-2/3 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded cursor-pointer"
            >
              수정 완료
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleActualSubmit}
            className="w-full bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded cursor-pointer"
          >
            매매일지 기록하기
          </button>
        )}
      </div>

      {/* 날짜 수정 불가 모달 */}
      <CustomModal
        isOpen={isDateEditNotAllowedModalOpen}
        onClose={() => setIsDateEditNotAllowedModalOpen(false)}
        variant={2}
        width="w-96"
      >
        <div className="text-center">
          <p className="text-gray-900 font-medium">
            매매일지에서 날짜는 수정하실 수 없습니다.
          </p>
        </div>
      </CustomModal>
    </form>
  );
}
