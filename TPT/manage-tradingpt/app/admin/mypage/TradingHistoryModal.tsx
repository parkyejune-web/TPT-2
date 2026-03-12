'use client';

import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import RichTextEditor from '../../components/RichTextEditor';
import BasicDetailView from '../../components/feedback/BasicDetailView';
import SwingDetailView from '../../components/feedback/SwingDetailView';
import DayDetailView from '../../components/feedback/DayDetailView';
import {
  getYearlyMonthList,
  getMonthlyWeekFeedbacks,
  getWeeklyDayFeedbacks,
  getDailyFeedbackList,
  type YearlySummaryResponse,
  type MonthlyWeekFeedbackResponse,
  type WeeklyDayFeedbackResponse,
  type DailyFeedbackListResponse,
} from '../../api/statistics';
import {
  getAdminFeedbackRequestDetail,
  createFeedbackResponse,
  updateFeedbackResponse,
  deleteFeedbackRequestByAdmin,
  type FeedbackRequestDetail,
  getInvestmentTypeLabel,
  getFeedbackStatusLabel,
  getFeedbackStatusColor,
} from '../../api/feedback';
import { useAuth } from '../../contexts/AuthContext';

interface TradingHistoryModalProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

type ViewStep = 'year' | 'month' | 'week' | 'day' | 'feedbackList' | 'feedbackDetail';

export default function TradingHistoryModal({
  customerId,
  customerName,
  onClose,
}: TradingHistoryModalProps) {
  const { isAdmin } = useAuth();

  // 네비게이션 상태
  const [currentStep, setCurrentStep] = useState<ViewStep>('year');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);

  // 데이터 상태
  const [yearlyData, setYearlyData] = useState<YearlySummaryResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyWeekFeedbackResponse | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyDayFeedbackResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyFeedbackListResponse | null>(null);
  const [feedbackDetail, setFeedbackDetail] = useState<FeedbackRequestDetail | null>(null);

  // 피드백 답변 작성/수정 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [responseTitle, setResponseTitle] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 연도 선택 옵션 (최근 5년)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // 연도 데이터 로드
  useEffect(() => {
    loadYearlyData();
  }, [selectedYear, customerId]);

  const loadYearlyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getYearlyMonthList(customerId, selectedYear);
      if (response.success && response.data) {
        setYearlyData(response.data);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 월 선택 시 주차 데이터 로드
  const handleMonthSelect = async (month: number) => {
    setSelectedMonth(month);
    setLoading(true);
    setError(null);
    try {
      const response = await getMonthlyWeekFeedbacks(customerId, selectedYear, month);
      if (response.success && response.data) {
        setMonthlyData(response.data);
        setCurrentStep('week');
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주 선택 시 일별 데이터 로드
  const handleWeekSelect = async (week: number) => {
    if (selectedMonth === null) return;
    setSelectedWeek(week);
    setLoading(true);
    setError(null);
    try {
      const response = await getWeeklyDayFeedbacks(customerId, selectedYear, selectedMonth, week);
      if (response.success && response.data) {
        setWeeklyData(response.data);
        setCurrentStep('day');
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 일 선택 시 피드백 목록 로드
  const handleDaySelect = async (day: number) => {
    if (selectedMonth === null || selectedWeek === null) return;
    setSelectedDay(day);
    setLoading(true);
    setError(null);
    try {
      const response = await getDailyFeedbackList(customerId, selectedYear, selectedMonth, selectedWeek, day);
      if (response.success && response.data) {
        setDailyData(response.data);
        setCurrentStep('feedbackList');
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 피드백 상세 조회
  const handleFeedbackSelect = async (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId);
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminFeedbackRequestDetail(feedbackId);
      if (response.success && response.data) {
        setFeedbackDetail(response.data);
        setCurrentStep('feedbackDetail');
        // 피드백 응답이 있으면 폼 초기화
        if (response.data.feedbackResponse) {
          setResponseTitle(response.data.feedbackResponse.title);
          setResponseContent(response.data.feedbackResponse.content);
        } else {
          setResponseTitle('');
          setResponseContent('');
        }
        setIsEditMode(false);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 피드백 답변 저장 (생성 또는 수정)
  const handleSubmitResponse = async () => {
    if (!selectedFeedbackId) return;

    if (!responseContent.trim() || responseContent === '<p><br></p>') {
      alert('피드백 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        title: responseTitle,
        content: responseContent,
      };

      let response;
      if (feedbackDetail?.feedbackResponse) {
        response = await updateFeedbackResponse(selectedFeedbackId, data);
      } else {
        response = await createFeedbackResponse(selectedFeedbackId, data);
      }

      if (response.success) {
        alert(feedbackDetail?.feedbackResponse ? '피드백이 수정되었습니다.' : '피드백이 작성되었습니다.');
        setIsEditMode(false);
        handleFeedbackSelect(selectedFeedbackId);
      } else {
        alert(`피드백 저장 실패: ${response.error}`);
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (feedbackDetail?.feedbackResponse) {
      setResponseTitle(feedbackDetail.feedbackResponse.title);
      setResponseContent(feedbackDetail.feedbackResponse.content);
    } else {
      setResponseTitle('');
      setResponseContent('');
    }
    setIsEditMode(false);
  };

  // 피드백 요청 삭제 (관리자 전용)
  const handleDeleteFeedbackRequest = async () => {
    if (!selectedFeedbackId) return;

    if (!confirm('이 매매일지를 삭제하시겠습니까?\n관련 응답도 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteFeedbackRequestByAdmin(selectedFeedbackId);
      if (response.success) {
        alert('매매일지가 삭제되었습니다.');
        // 피드백 목록으로 돌아가서 새로고침
        setCurrentStep('feedbackList');
        setSelectedFeedbackId(null);
        setFeedbackDetail(null);
        // 일별 데이터 다시 로드
        if (selectedMonth !== null && selectedWeek !== null && selectedDay !== null) {
          handleDaySelect(selectedDay);
        }
      } else {
        alert(`삭제 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (err) {
      alert(`오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    switch (currentStep) {
      case 'month':
        setCurrentStep('year');
        setSelectedMonth(null);
        break;
      case 'week':
        setCurrentStep('month');
        setSelectedWeek(null);
        break;
      case 'day':
        setCurrentStep('week');
        setSelectedDay(null);
        break;
      case 'feedbackList':
        setCurrentStep('day');
        break;
      case 'feedbackDetail':
        setCurrentStep('feedbackList');
        setSelectedFeedbackId(null);
        setFeedbackDetail(null);
        setIsEditMode(false);
        setResponseTitle('');
        setResponseContent('');
        break;
      default:
        break;
    }
  };

  // 상태 뱃지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FR':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">읽음</span>;
      case 'FN':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">답변완료</span>;
      case 'N':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">미답변</span>;
      default:
        return null;
    }
  };

  // 브레드크럼
  const renderBreadcrumb = () => {
    const parts: string[] = [`${selectedYear}년`];
    if (selectedMonth !== null) parts.push(`${selectedMonth}월`);
    if (selectedWeek !== null) parts.push(`${selectedWeek}주차`);
    if (selectedDay !== null) parts.push(`${selectedDay}일`);

    return (
      <div className="text-sm text-gray-500 mb-4">
        {parts.join(' > ')}
      </div>
    );
  };

  // 연도 선택 화면
  const renderYearView = () => (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">연도 선택</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </select>
      </div>

      <h3 className="font-semibold text-gray-900 mb-3">{selectedYear}년 월별 매매일지</h3>

      {loading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : !yearlyData || yearlyData.months.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{selectedYear}년에 작성된 매매일지가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {yearlyData.months.map((item) => (
            <button
              key={item.month}
              onClick={() => handleMonthSelect(item.month)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-semibold text-gray-900">{item.month}월</div>
              <div className="text-sm text-gray-500">{item.totalCount}건</div>
              <div className="mt-1">{getStatusBadge(item.status)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // 주차 선택 화면
  const renderWeekView = () => (
    <div>
      {renderBreadcrumb()}
      <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1">
        &larr; 뒤로
      </button>

      <h3 className="font-semibold text-gray-900 mb-3">{selectedYear}년 {selectedMonth}월 주차별 매매일지</h3>

      {loading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : !monthlyData || monthlyData.weeks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">해당 월에 작성된 매매일지가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {monthlyData.weeks.map((week) => (
            <button
              key={week}
              onClick={() => handleWeekSelect(week)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900">{week}주차</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // 일 선택 화면
  const renderDayView = () => (
    <div>
      {renderBreadcrumb()}
      <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1">
        &larr; 뒤로
      </button>

      <h3 className="font-semibold text-gray-900 mb-3">{selectedYear}년 {selectedMonth}월 {selectedWeek}주차 일별 매매일지</h3>

      {loading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : !weeklyData || weeklyData.days.length === 0 ? (
        <div className="text-center py-8 text-gray-500">해당 주차에 작성된 매매일지가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {weeklyData.days.map((day) => (
            <button
              key={day}
              onClick={() => handleDaySelect(day)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900">{day}일</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // 피드백 목록 화면
  const renderFeedbackListView = () => (
    <div>
      {renderBreadcrumb()}
      <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1">
        &larr; 뒤로
      </button>

      <h3 className="font-semibold text-gray-900 mb-3">
        {selectedYear}년 {selectedMonth}월 {selectedDay}일 매매일지 목록
      </h3>

      {loading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : !dailyData || dailyData.feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">해당 날짜에 작성된 매매일지가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {dailyData.feedbacks.map((feedback) => (
            <button
              key={feedback.feedbackId}
              onClick={() => handleFeedbackSelect(feedback.feedbackId)}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{feedback.title}</span>
                {getStatusBadge(feedback.status)}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded ${
                  feedback.investmentType === 'DAY' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {feedback.investmentType === 'DAY' ? '데이' : '스윙'}
                </span>
                <span>{new Date(feedback.createdAt).toLocaleString('ko-KR')}</span>
                {feedback.hasResponse && (
                  <span className="text-green-600">답변 있음</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // 진입 타점 라벨 변환
  const getEntryPointLabel = (entryPoint?: string) => {
    const labels: Record<string, string> = {
      REVERSE: '리버스',
      PULL_BACK: '풀백',
      BREAK_OUT: '돌파',
    };
    return entryPoint ? labels[entryPoint] || entryPoint : undefined;
  };

  // 등급 라벨 변환
  const getGradeLabel = (grade?: string) => {
    const labels: Record<string, string> = {
      S_PLUS: 'S+',
      S: 'S',
      A: 'A',
      B: 'B',
      NONE: '-',
    };
    return grade ? labels[grade] || grade : undefined;
  };

  // 투자 유형 및 멤버십에 따른 상세 뷰 렌더링
  const renderDetailView = () => {
    if (!feedbackDetail) return null;

    const { investmentType, membershipLevel, courseStatus } = feedbackDetail;
    const isBasicMember = membershipLevel === 'BASIC';
    const isBeforeCompletion = courseStatus === 'BEFORE_COMPLETION';

    // 스크린샷 URL 배열 추출 (새로운 구조 우선, 기존 구조 fallback)
    const screenshotImageUrls = feedbackDetail.screenshotImages?.map(img => img.imageUrl)
      ?? feedbackDetail.screenshotImageUrls
      ?? [];
    const screenshotUrl = screenshotImageUrls[0];

    // 무료(BASIC) 회원 또는 완강 전
    if (isBasicMember || isBeforeCompletion) {
      const basicData = {
        feedbackRequestDate: feedbackDetail.feedbackRequestDate,
        category: feedbackDetail.category,
        positionHoldingTime: feedbackDetail.positionHoldingTime,
        screenshotUrl,
        screenshotImageUrls,
        leverage: feedbackDetail.leverage,
        position: feedbackDetail.position,
        operatingFundsRatio: feedbackDetail.operatingFundsRatio,
        entryPrice: feedbackDetail.entryPrice,
        exitPrice: feedbackDetail.exitPrice,
        riskTaking: feedbackDetail.riskTaking,
        settingStopLoss: feedbackDetail.settingStopLoss,
        settingTakeProfit: feedbackDetail.settingTakeProfit,
        pl: feedbackDetail.pnl,
        totalAssetPnl: feedbackDetail.totalAssetPnl,
        rr: feedbackDetail.rnr,
        positionStartReason: feedbackDetail.positionStartReason,
        positionEndReason: feedbackDetail.positionEndReason,
        tradingReview: feedbackDetail.tradingReview,
      };
      return <BasicDetailView data={basicData} />;
    }

    // 프리미엄 완강 후 회원 - 스윙 투자
    if (investmentType === 'SWING') {
      const swingData = {
        category: feedbackDetail.category,
        entryDate: feedbackDetail.positionStartDate,
        exitDate: feedbackDetail.positionEndDate,
        screenshotUrl,
        screenshotImageUrls,
        directionFrame: feedbackDetail.directionFrame,
        mainFrame: feedbackDetail.mainFrame,
        subFrame: feedbackDetail.subFrame,
        directionFrameExists: feedbackDetail.directionFrameExists,
        trendAnalysis: feedbackDetail.trendAnalysis,
        entryPoint1: getEntryPointLabel(feedbackDetail.entryPoint),
        grade1: getGradeLabel(feedbackDetail.grade),
        additionalBuyCount: feedbackDetail.additionalBuyCount,
        splitSellCount: feedbackDetail.splitSellCount,
        operatingFundsRatio: feedbackDetail.operatingFundsRatio,
        risk: feedbackDetail.riskTaking,
        leverage: feedbackDetail.leverage,
        position: feedbackDetail.position,
        entryPrice: feedbackDetail.entryPrice,
        exitPrice: feedbackDetail.exitPrice,
        settingStopLoss: feedbackDetail.settingStopLoss,
        settingTakeProfit: feedbackDetail.settingTakeProfit,
        pl: feedbackDetail.pnl,
        totalAssetPnl: feedbackDetail.totalAssetPnl,
        rr: feedbackDetail.rnr,
        tradingReview: feedbackDetail.tradingReview,
        trainerFeedback: feedbackDetail.trainerFeedbackRequestContent,
        selectedWeek: feedbackDetail.feedbackMonth && feedbackDetail.feedbackWeek
          ? { month: feedbackDetail.feedbackMonth, week: feedbackDetail.feedbackWeek }
          : undefined,
      };
      return <SwingDetailView data={swingData} />;
    }

    // 프리미엄 완강 후 회원 - 데이 투자
    if (investmentType === 'DAY') {
      const dayData = {
        category: feedbackDetail.category,
        positionHoldingTime: feedbackDetail.positionHoldingTime,
        screenshotUrl,
        screenshotImageUrls,
        directionFrame: feedbackDetail.directionFrame,
        mainFrame: feedbackDetail.mainFrame,
        subFrame: feedbackDetail.subFrame,
        directionFrameExists: feedbackDetail.directionFrameExists,
        trendAnalysis: feedbackDetail.trendAnalysis,
        entryPoint1: getEntryPointLabel(feedbackDetail.entryPoint),
        grade: getGradeLabel(feedbackDetail.grade),
        additionalBuyCount: feedbackDetail.additionalBuyCount,
        splitSellCount: feedbackDetail.splitSellCount,
        operatingFundsRatio: feedbackDetail.operatingFundsRatio,
        risk: feedbackDetail.riskTaking,
        leverage: feedbackDetail.leverage,
        position: feedbackDetail.position,
        entryPrice: feedbackDetail.entryPrice,
        exitPrice: feedbackDetail.exitPrice,
        settingStopLoss: feedbackDetail.settingStopLoss,
        settingTakeProfit: feedbackDetail.settingTakeProfit,
        pl: feedbackDetail.pnl,
        totalAssetPnl: feedbackDetail.totalAssetPnl,
        rr: feedbackDetail.rnr,
        tradingReview: feedbackDetail.tradingReview,
        trainerFeedback: feedbackDetail.trainerFeedbackRequestContent,
      };
      return <DayDetailView data={dayData} />;
    }

    // 스캘핑 (스윙과 동일한 폼 사용)
    if (investmentType === 'SCALPING') {
      const scalpingData = {
        category: feedbackDetail.category,
        entryDate: feedbackDetail.positionStartDate,
        exitDate: feedbackDetail.positionEndDate,
        screenshotUrl,
        screenshotImageUrls,
        directionFrame: feedbackDetail.directionFrame,
        mainFrame: feedbackDetail.mainFrame,
        subFrame: feedbackDetail.subFrame,
        directionFrameExists: feedbackDetail.directionFrameExists,
        trendAnalysis: feedbackDetail.trendAnalysis,
        entryPoint1: getEntryPointLabel(feedbackDetail.entryPoint),
        grade1: getGradeLabel(feedbackDetail.grade),
        additionalBuyCount: feedbackDetail.additionalBuyCount,
        splitSellCount: feedbackDetail.splitSellCount,
        operatingFundsRatio: feedbackDetail.operatingFundsRatio,
        risk: feedbackDetail.riskTaking,
        leverage: feedbackDetail.leverage,
        position: feedbackDetail.position,
        entryPrice: feedbackDetail.entryPrice,
        exitPrice: feedbackDetail.exitPrice,
        settingStopLoss: feedbackDetail.settingStopLoss,
        settingTakeProfit: feedbackDetail.settingTakeProfit,
        pl: feedbackDetail.pnl,
        totalAssetPnl: feedbackDetail.totalAssetPnl,
        rr: feedbackDetail.rnr,
        tradingReview: feedbackDetail.tradingReview,
        trainerFeedback: feedbackDetail.trainerFeedbackRequestContent,
      };
      return <SwingDetailView data={scalpingData} />;
    }

    return (
      <div className="text-center py-8 text-gray-500">
        매매일지 데이터를 불러올 수 없습니다.
      </div>
    );
  };

  // 피드백 상세 화면
  const renderFeedbackDetailView = () => {
    if (!feedbackDetail) return null;

    return (
      <div>
        {renderBreadcrumb()}
        <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1">
          &larr; 뒤로
        </button>

        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* 헤더 영역 */}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">매매일지 상세</h3>
              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded text-sm ${getFeedbackStatusColor(feedbackDetail.status)}`}>
                  {getFeedbackStatusLabel(feedbackDetail.status)}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {getInvestmentTypeLabel(feedbackDetail.investmentType)}
                </span>
                {isAdmin && (
                  <CustomButton
                    variant="danger"
                    onClick={handleDeleteFeedbackRequest}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </CustomButton>
                )}
              </div>
            </div>

            {/* 투자 유형별 상세 정보 표시 */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-4 border-b pb-2">매매일지 내용</h4>
              {renderDetailView()}
            </div>

            {/* 트레이너 피드백 답변 섹션 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg text-gray-900">트레이너 피드백</h4>
                {feedbackDetail.feedbackResponse && !isEditMode && (
                  <CustomButton variant="secondary" onClick={() => setIsEditMode(true)}>
                    수정
                  </CustomButton>
                )}
              </div>

              {isEditMode || !feedbackDetail.feedbackResponse ? (
                // 피드백 작성/수정 폼
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      피드백 제목
                    </label>
                    <input
                      type="text"
                      value={responseTitle}
                      onChange={(e) => setResponseTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="피드백 제목을 입력하세요 (선택사항)"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      피드백 내용 <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={responseContent}
                      onChange={setResponseContent}
                      placeholder="피드백 내용을 작성하세요..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <CustomButton variant="secondary" onClick={handleCancelEdit} disabled={isSubmitting}>
                      취소
                    </CustomButton>
                    <CustomButton variant="primary" onClick={handleSubmitResponse} disabled={isSubmitting}>
                      {isSubmitting
                        ? '저장 중...'
                        : feedbackDetail.feedbackResponse
                        ? '수정 완료'
                        : '작성 완료'}
                    </CustomButton>
                  </div>
                </div>
              ) : (
                // 피드백 보기 모드
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-lg mb-2">
                      {feedbackDetail.feedbackResponse.title}
                    </h5>
                    <div className="text-sm text-gray-500 mb-4">
                      작성자: {feedbackDetail.feedbackResponse.trainer.trainerName} |{' '}
                      {new Date(feedbackDetail.feedbackResponse.submittedAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: feedbackDetail.feedbackResponse.content,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 현재 단계에 맞는 뷰 렌더링
  const renderCurrentView = () => {
    switch (currentStep) {
      case 'year':
        return renderYearView();
      case 'month':
        return renderYearView(); // 월 선택도 연도 화면에서 함
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'feedbackList':
        return renderFeedbackListView();
      case 'feedbackDetail':
        return renderFeedbackDetailView();
      default:
        return renderYearView();
    }
  };

  return (
    <CustomModal title={`${customerName}님의 매매일지 전체 내역`} onClose={onClose} size="5xl">
      {renderCurrentView()}
    </CustomModal>
  );
}
