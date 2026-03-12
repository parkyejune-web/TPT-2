'use client';

import { useState } from 'react';
import { Coins, X } from 'lucide-react';
import { useRnRCalculation } from './hooks/useRnRCalculation';
import { useRiskTakingCalculation } from './hooks/useRiskTakingCalculation';
import { useTotalAssetPnlCalculation } from './hooks/useTotalAssetPnlCalculation';
import { User } from '../../Shared/store/authStore';
import CustomModal from '../../Shared/ui/CustomModal';
import { getDateInfo } from '../../Shared/utils/dateFormatter';

/** 수정 모드에서 기존 이미지 정보 타입 */
interface ExistingImageInfo {
  id: number;
  url: string;
}

type Props = {
  onSubmit: (data: any) => void;
  currentUser: User;
  riskTaking?: number;
  isEditMode?: boolean;
  initialData?: any;
  onCancel?: () => void;
};

/**
 * 무료 회원 또는 완강 전 회원용 피드백 요청 폼
 * isEditMode가 true인 경우 수정 모드로 동작
 */
export default function BasicOrBeforeForm({ onSubmit, currentUser, riskTaking = 5, isEditMode = false, initialData, onCancel }: Props) {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);
  const [isDateEditNotAllowedModalOpen, setIsDateEditNotAllowedModalOpen] = useState(false);

  const defaultDate = new Date().toISOString().split('T')[0];

  // 기본 정보 상태 (수정 모드일 경우 initialData에서 초기값 가져옴)
  const [feedbackRequestDate, setFeedbackRequestDate] = useState(
    initialData?.feedbackRequestDate || defaultDate
  );

  // feedbackRequestDate 기반으로 연도, 월, 주차 계산 (매매 날짜 변경 시 자동 업데이트)
  const dateInfo = getDateInfo(feedbackRequestDate);
  const feedbackYear = dateInfo.year;
  const feedbackMonth = dateInfo.month;
  const feedbackWeek = dateInfo.week;
  const [category, setCategory] = useState(initialData?.category || '');
  const [positionHoldingTime, setPositionHoldingTime] = useState(initialData?.positionHoldingTime || '');

  // 스크린샷 관련 (multiple files)
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]); // 새로 추가할 파일들
  // 기존 이미지 정보 (수정 모드용 - id와 url 포함)
  const [existingImages, setExistingImages] = useState<ExistingImageInfo[]>(() => {
    if (isEditMode && initialData?.screenshotImages) {
      return initialData.screenshotImages.map((img: { imageId: number; imageUrl: string }) => ({
        id: img.imageId,
        url: img.imageUrl,
      }));
    }
    return [];
  });
  // 미리보기 URL (기존 이미지 URL + 새 파일 미리보기)
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]); // 새 파일의 미리보기 URL
  // 구버전 호환을 위한 screenshotPreviews (신규 생성 모드에서만 사용)
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>(
    !isEditMode ? (initialData?.screenshotImageUrls || []) : []
  );

  // 레버리지 및 비중
  const [leverage, setLeverage] = useState<number | ''>(initialData?.leverage ?? '');
  const [leverageError, setLeverageError] = useState<string>('');
  const [operatingFundsRatio, setOperatingFundsRatio] = useState<number | ''>(initialData?.operatingFundsRatio ?? '');
  const [operatingFundsRatioError, setOperatingFundsRatioError] = useState<string>('');

  // 포지션
  const [position, setPosition] = useState<'LONG' | 'SHORT' | null>(initialData?.position || null);

  // P&L (수정 모드에서는 음수/양수 분리)
  const initialPl = initialData?.pnl ?? '';
  const [isPositive, setIsPositive] = useState(initialPl >= 0);
  const [pl, setPl] = useState<number | ''>(initialPl !== '' ? Math.abs(initialPl) : '');

  // Entry/Exit/StopLoss/TakeProfit
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

  // 복기 및 근거
  const [positionStartReason, setPositionStartReason] = useState(initialData?.positionStartReason || '');
  const [positionEndReason, setPositionEndReason] = useState(initialData?.positionEndReason || '');
  const [tradingReview, setTradingReview] = useState(initialData?.tradingReview || '');

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

  // 저장하기 버튼 클릭 시 확인 모달 표시 (무료/유료 회원 모두 동일)
  const handleSaveButtonClick = () => {
    // Entry/Exit Price 검증
    if (!validatePrices()) {
      return;
    }

    // 무료/유료 회원 모두 확인 모달 표시
    setIsSaveConfirmModalOpen(true);
  };

  // 저장 확인 후 실제 제출 (useToken: false)
  const handleSaveConfirm = () => {
    setIsSaveConfirmModalOpen(false);

    const userLevel = currentUser.isPremium ? 'PREMIUM' : 'BASIC';
    const completion = currentUser.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

    const formData = {
      feedbackRequestDate,
      feedbackYear,
      feedbackMonth,
      feedbackWeek,
      category,
      positionHoldingTime,
      screenshotFiles,
      leverage: typeof leverage === 'number' ? leverage : 0,
      operatingFundsRatio: typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0,
      position,
      pl: typeof pl === 'number' ? (isPositive ? pl : -pl) : 0,
      entryPrice: typeof entryPrice === 'number' ? entryPrice : 0,
      exitPrice: typeof exitPrice === 'number' ? exitPrice : 0,
      settingStopLoss: typeof settingStopLoss === 'number' ? settingStopLoss : 0,
      settingTakeProfit: typeof settingTakeProfit === 'number' ? settingTakeProfit : 0,
      riskTaking: riskTakingValue,
      totalAssetPnl,
      rr,
      positionStartReason,
      positionEndReason,
      tradingReview,
      membershipLevel: userLevel,
      courseStatus: completion,
      isEditMode,
      useToken: false,
    };

    console.log('[BasicOrBeforeForm] 제출 데이터:', formData);
    onSubmit(formData);
  };

  // 수정 모드에서 직접 제출 (확인 모달 없이)
  const handleEditSubmit = () => {
    if (!validatePrices()) {
      return;
    }

    const userLevel = currentUser.isPremium ? 'PREMIUM' : 'BASIC';
    const completion = currentUser.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

    // 수정 모드에서 유지할 기존 이미지 ID 목록
    const remainingImageIds = existingImages.map((img) => img.id);

    const formData = {
      feedbackRequestDate,
      feedbackYear,
      feedbackMonth,
      feedbackWeek,
      category,
      positionHoldingTime,
      screenshotFiles, // 새로 추가할 파일들
      remainingImageIds, // 유지할 기존 이미지 ID 목록 (삭제된 이미지는 제외됨)
      leverage: typeof leverage === 'number' ? leverage : 0,
      operatingFundsRatio: typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0,
      position,
      pnl: typeof pl === 'number' ? (isPositive ? pl : -pl) : 0,
      entryPrice: typeof entryPrice === 'number' ? entryPrice : 0,
      exitPrice: typeof exitPrice === 'number' ? exitPrice : 0,
      settingStopLoss: typeof settingStopLoss === 'number' ? settingStopLoss : 0,
      settingTakeProfit: typeof settingTakeProfit === 'number' ? settingTakeProfit : undefined,
      riskTaking: riskTakingValue,
      totalAssetPnl,
      rnr: rr,
      positionStartReason: positionStartReason || undefined,
      positionEndReason: positionEndReason || undefined,
      tradingReview: tradingReview || undefined,
      membershipLevel: userLevel,
      courseStatus: completion,
      isEditMode: true,
    };

    console.log('[BasicOrBeforeForm] 수정 제출 데이터:', formData);
    console.log('[BasicOrBeforeForm] 유지할 이미지 ID:', remainingImageIds);
    console.log('[BasicOrBeforeForm] 새로 추가할 파일 수:', screenshotFiles.length);
    onSubmit(formData);
  };

  // 토큰 사용 버튼 클릭
  const handleTokenButtonClick = () => {
    setIsTokenModalOpen(true);
  };

  // 토큰 사용 확인 - 폼 데이터와 함께 제출
  const handleTokenConfirm = () => {
    setIsTokenModalOpen(false);

    // Entry/Exit Price 검증
    if (!validatePrices()) {
      return;
    }

    const userLevel = currentUser.isPremium ? 'PREMIUM' : 'BASIC';
    const completion = currentUser.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

    const formData = {
      feedbackRequestDate,
      feedbackYear,
      feedbackMonth,
      feedbackWeek,
      category,
      positionHoldingTime,
      screenshotFiles,
      leverage: typeof leverage === 'number' ? leverage : 0,
      operatingFundsRatio: typeof operatingFundsRatio === 'number' ? operatingFundsRatio : 0,
      position,
      pl: typeof pl === 'number' ? (isPositive ? pl : -pl) : 0,
      entryPrice: typeof entryPrice === 'number' ? entryPrice : 0,
      exitPrice: typeof exitPrice === 'number' ? exitPrice : 0,
      settingStopLoss: typeof settingStopLoss === 'number' ? settingStopLoss : 0,
      settingTakeProfit: typeof settingTakeProfit === 'number' ? settingTakeProfit : 0,
      riskTaking: riskTakingValue,
      totalAssetPnl,
      rr,
      positionStartReason,
      positionEndReason,
      tradingReview,
      membershipLevel: userLevel,
      courseStatus: completion,
      useToken: true,
      tokenAmount: 3,
    };

    console.log('[BasicOrBeforeForm] 토큰 사용 제출 데이터:', formData);
    onSubmit(formData);
  };

  // 파일 업로드 핸들러 (multiple files)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setScreenshotFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      if (isEditMode) {
        setNewFilePreviews((prev) => [...prev, ...newPreviews]);
      } else {
        setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  // 스크린샷 삭제 (수정 모드에서는 기존 이미지와 새 파일 구분)
  const handleRemoveScreenshot = (index: number) => {
    if (isEditMode) {
      // 수정 모드: 기존 이미지와 새 파일 구분
      const totalExistingCount = existingImages.length;
      if (index < totalExistingCount) {
        // 기존 이미지 삭제
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        // 새 파일 삭제
        const newFileIndex = index - totalExistingCount;
        setScreenshotFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
        setNewFilePreviews((prev) => prev.filter((_, i) => i !== newFileIndex));
      }
    } else {
      // 신규 생성 모드
      setScreenshotFiles((prev) => prev.filter((_, i) => i !== index));
      setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 수정 모드에서 모든 이미지 미리보기 합산
  const allPreviews = isEditMode
    ? [...existingImages.map((img) => img.url), ...newFilePreviews]
    : screenshotPreviews;

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
      if (isEditMode) {
        setNewFilePreviews((prev) => [...prev, ...newPreviews]);
      } else {
        setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  const userLevel = currentUser.isPremium ? 'PREMIUM' : 'BASIC';
  const completion = currentUser.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

  // 투자유형 라벨
  const investmentTypeMap: Record<string, string> = {
    SWING: '스윙',
    DAY: '데이',
    SCALPING: '스켈핑',
  };
  const investmentTypeLabel = investmentTypeMap[currentUser.investmentType || 'SCALPING'] || '스켈핑';

  // 완강 여부 라벨
  const completionLabel = completion === 'AFTER_COMPLETION' ? '완강 후' : '완강 전';

  // 유료/무료 라벨
  const membershipLabel = userLevel === 'PREMIUM' ? 'Pro' : '무료';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        {/* 투자유형 뱃지 - 현재 데이 유형만 사용하므로 주석처리 */}
        {/* <span
          className={`px-3 py-1 text-white rounded ${
            currentUser.investmentType === 'SWING'
              ? 'bg-orange-400'
              : currentUser.investmentType === 'DAY'
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

      {/* 안내 문구 */}
      <div className="text-sm text-gray-600 -mt-3">TPT 분석가에게 피드백을 요청해보세요.</div>

      {/* === 기본 정보 입력 섹션 === */}
      {/* 날짜 */}
      <div>
        <label className="block mb-1 font-medium">매매 날짜</label>
        {isEditMode ? (
          <div
            onClick={() => setIsDateEditNotAllowedModalOpen(true)}
            className="border border-gray-300 rounded p-2 w-full cursor-not-allowed bg-gray-100 text-gray-600"
          >
            {feedbackRequestDate}
          </div>
        ) : (
          <input
            type="date"
            value={feedbackRequestDate}
            onChange={(e) => setFeedbackRequestDate(e.target.value)}
            min={currentUser.signedAt}
            className="border border-gray-300 rounded p-2 w-full bg-[#F4F4F4]"
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

      {/* 포지션 홀딩 시간 */}
      <div>
        <label className="block mb-1 font-medium">포지션 홀딩 시간</label>
        <input
          type="text"
          placeholder="내용 입력"
          value={positionHoldingTime}
          onChange={(e) => setPositionHoldingTime(e.target.value)}
          className="bg-[#F4F4F4] rounded p-2 w-full"
        />
      </div>

      {/* 스크린샷 업로드 (multiple) */}
      <div>
        <label className="block mb-1 font-medium">스크린샷 업로드</label>
        <div
          className="w-full min-h-40 rounded bg-[#F4F4F4] flex items-center justify-center cursor-pointer p-4 focus:outline-none focus:ring-2 focus:ring-[#B9AB70]"
          onClick={() => document.getElementById('screenshotInput')?.click()}
          onPaste={handlePaste}
          tabIndex={0}
        >
          {allPreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              {allPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`screenshot ${index + 1}`}
                    className="object-contain w-full h-32 rounded"
                  />
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
                  {/* 수정 모드에서 기존 이미지 표시 */}
                  {isEditMode && index < existingImages.length && (
                    <div className="absolute bottom-1 left-1 bg-blue-500 bg-opacity-75 text-white text-xs px-1 rounded">
                      기존
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">클릭하여 업로드하거나 Ctrl+V로 붙여넣기</span>
          )}
        </div>
        <input
          type="file"
          id="screenshotInput"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* === 포지션 설정 섹션 === */}
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

      {/* 포지션 선택 */}
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

      {/* === 손익 및 리스크 섹션 === */}
      {/* P&L */}
      <div className="flex items-center gap-3">
        <span className="font-semibold">P&L:</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-1 border rounded ${
              isPositive
                ? 'bg-[#2AC287] text-white'
                : 'bg-white text-[#2AC287] border-[#2AC287]'
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

      {/* Entry / Exit / StopLoss / TakeProfit Grid */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* 리스크 테이킹 (자동 계산) */}
      <div>
        <label className="block mb-1 font-medium">리스크 테이킹</label>
        <div className="bg-gray-100 rounded p-2 w-full text-gray-700">
          {riskTakingValue.toFixed(2)}%
        </div>
      </div>

      {/* R&R */}
      <div className="flex items-center gap-3">
        <span className="font-semibold">R&R:</span>
        <span>{rr}</span>
      </div>

      {/* R&R 게이지바 */}
      <div className="relative w-full h-32 mt-4">
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

      {/* 전체 자산 기준 P&L */}
      <div>
        <label className="block mb-1 font-medium">전체 자산 기준 P&L</label>
        <div className="bg-gray-100 rounded p-2 w-full text-gray-700">
          {totalAssetPnl.toFixed(2)}%
        </div>
      </div>

      {/* === 피드백 참고 입력 섹션 === */}
      <div>
        <label className="block mb-1 font-medium">포지션 진입 근거</label>
        <textarea
          placeholder="포지션 진입 이유를 작성해주세요."
          value={positionStartReason}
          onChange={(e) => setPositionStartReason(e.target.value)}
          className="bg-[#F4F4F4] rounded p-2 w-full h-24"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">포지션 탈출 근거</label>
        <textarea
          placeholder="포지션 탈출 이유를 작성해주세요."
          value={positionEndReason}
          onChange={(e) => setPositionEndReason(e.target.value)}
          className="bg-[#F4F4F4] rounded p-2 w-full h-24"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">최종 복기</label>
        <textarea
          placeholder="매매에 대한 종합적인 복기를 작성해주세요."
          value={tradingReview}
          onChange={(e) => setTradingReview(e.target.value)}
          className="bg-[#F4F4F4] rounded p-2 w-full h-24"
        />
      </div>

      {/* 제출 버튼 */}
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
          <>
            <button
              type="button"
              onClick={handleSaveButtonClick}
              className="w-1/2 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded cursor-pointer"
            >
              저장하기
            </button>
            <button
              type="button"
              onClick={handleTokenButtonClick}
              className="w-1/2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded cursor-pointer hover:from-gray-400 hover:to-gray-600 transition-all"
            >
              <Coins size={20} />
              저장하기 및 피드백 요청하기
            </button>
          </>
        )}
      </div>

      {/* 일반 저장 확인 모달 */}
      <CustomModal variant={3} isOpen={isSaveConfirmModalOpen} onClose={() => setIsSaveConfirmModalOpen(false)} onConfirm={handleSaveConfirm} width='max-w-lg'>
        <div className="p-4 flex flex-col items-center gap-4">
          <p className="text-center text-gray-700">
            저장 시 해당 매매일지는 이후 피드백 요청이 불가합니다.
            <br />
            그래도 저장하시겠습니까?
          </p>
        </div>
      </CustomModal>

      {/* 토큰 사용 확인 모달 */}
      <CustomModal variant={1} isOpen={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)} width='w-lg'>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Coins size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-center">피드백 요청 확인</h3>
          <p className="text-center text-gray-700">
            {currentUser.isPremium ? (
              <>
                매매일지를 저장하고
                <br />
                피드백을 요청합니다.
              </>
            ) : (
              <>
                토큰 3개를 차감하여 매매일지를 작성하고,
                <br />
                이에 대한 피드백을 요청합니다.
                <br />
                <p className='font-bold'>실거래 매매가 아닐 시, 피드백 이용에 제한이 있을 수 있습니다.</p>
              </>
            )}
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              onClick={() => setIsTokenModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleTokenConfirm}
              className="flex-1 px-4 py-2 bg-[#B9AB70] text-white rounded-md hover:bg-[#8B7E50] transition"
            >
              확인
            </button>
          </div>
        </div>
      </CustomModal>

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
