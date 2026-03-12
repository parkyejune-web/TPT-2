'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { adminLogout } from '../../api/auth';
import { clearXsrfToken } from '../../utils/xsrfToken';
import {
  getMyCustomerNewFeedbackRequests,
  deleteFeedbackRequestByAdmin,
  type MyCustomerNewFeedbackListItem,
  getInvestmentTypeLabel,
  getCourseStatusLabel,
} from '../../api/feedback';
import {
  getMyManagedCustomerEvaluations,
  upsertMonthlyEvaluation,
  upsertWeeklyEvaluation,
  getAdminMonthlySummary,
  getAdminWeeklySummary,
  getPendingEvaluations,
  type CustomerEvaluation,
  type MonthlySummaryResponseDTO,
  type WeeklySummaryResponseDTO,
  type PendingEvaluationItemDTO,
} from '../../api/statistics';
import FeedbackStatisticsView from './FeedbackStatisticsView';
import CustomerHomeworkModal from './CustomerHomeworkModal';
import TradingHistoryModal from './TradingHistoryModal';
import { useAuth } from '../../contexts/AuthContext';

// 관리자 전용 테이블 컴포넌트 (고객관리 탭에서 재사용)
import SubscriptionCustomersTable from '../customers/SubscriptionCustomersTable';
import NewSubscriptionCustomersTable from '../customers/NewSubscriptionCustomersTable';
import FreeCustomersTable from '../customers/FreeCustomersTable';

// 피드백 타입
type FeedbackType = 'monthly' | 'weekly';

// 피드백 모달 상태 인터페이스
interface FeedbackModalState {
  isOpen: boolean;
  type: FeedbackType;
  customer: CustomerEvaluation | null;
}

export default function MyPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [feedbackRequests, setFeedbackRequests] = useState<MyCustomerNewFeedbackListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // 내 담당 고객 평가 목록 상태
  const [customerEvaluations, setCustomerEvaluations] = useState<CustomerEvaluation[]>([]);
  const [evaluationsLoading, setEvaluationsLoading] = useState(false);
  const [evaluationsPage, setEvaluationsPage] = useState(0);
  const [evaluationsTotalPages, setEvaluationsTotalPages] = useState(0);

  // 피드백 작성 모달 상태
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    type: 'monthly',
    customer: null,
  });
  const [submitting, setSubmitting] = useState(false);

  // 월간 피드백 필드 (2개)
  const [monthlyEvaluation, setMonthlyEvaluation] = useState(''); // 트레이너의 한달간 회원님 매매 최종 평가
  const [nextMonthGoal, setNextMonthGoal] = useState(''); // 다음달 회원님의 목표 성과

  // 주간 피드백 필드 (3개)
  const [weeklyLossTradingAnalysis, setWeeklyLossTradingAnalysis] = useState(''); // 회원님의 손실난 매매 분석
  const [weeklyProfitableTradingAnalysis, setWeeklyProfitableTradingAnalysis] = useState(''); // 회원님의 수익난 매매 분석
  const [weeklyEvaluation, setWeeklyEvaluation] = useState(''); // 회원님의 주간 매매 최종 평가 및 개선점

  // 기존 피드백 존재 여부 (수정 모드 판별)
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingExistingFeedback, setLoadingExistingFeedback] = useState(false);

  // 피드백 기간 선택 상태
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // 과제 현황 모달 상태
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [homeworkCustomer, setHomeworkCustomer] = useState<CustomerEvaluation | null>(null);

  // 매매일지 전체 내역 모달 상태
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState<CustomerEvaluation | null>(null);

  // 미작성 평가 목록 상태
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluationItemDTO[]>([]);
  const [pendingEvaluationsLoading, setPendingEvaluationsLoading] = useState(false);
  const [pendingEvaluationsPage, setPendingEvaluationsPage] = useState(0);
  const [pendingEvaluationsHasNext, setPendingEvaluationsHasNext] = useState(false);

  useEffect(() => {
    loadFeedbackRequests();
  }, [currentPage]);

  useEffect(() => {
    loadCustomerEvaluations();
  }, [evaluationsPage]);

  useEffect(() => {
    loadPendingEvaluations();
  }, [pendingEvaluationsPage]);

  const loadFeedbackRequests = async () => {
    setLoading(true);
    try {
      const response = await getMyCustomerNewFeedbackRequests({
        page: currentPage,
        size: 12,
      });

      if (response.success && response.data) {
        setFeedbackRequests(response.data.feedbacks);
        setHasNext(response.data.sliceInfo.hasNext);
      } else {
        console.error('피드백 요청 목록 로드 실패:', response.error);
      }
    } catch (error) {
      console.error('피드백 요청 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return;

    const response = await adminLogout();
    if (response.success) {
      clearXsrfToken();
      alert('로그아웃되었습니다.');
      router.push('/login');
    } else {
      alert(`로그아웃 실패: ${response.error}`);
    }
  };

  const handleFeedbackClick = (feedbackId: number) => {
    router.push(`/admin/feedback/${feedbackId}`);
  };

  // 피드백 요청 삭제 (관리자 전용)
  const handleDeleteFeedbackRequest = async (e: React.MouseEvent, feedbackId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!confirm('이 피드백 요청을 삭제하시겠습니까?\n관련 응답도 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await deleteFeedbackRequestByAdmin(feedbackId);
      if (response.success) {
        alert('피드백 요청이 삭제되었습니다.');
        setFeedbackRequests((prev) => prev.filter((f) => f.id !== feedbackId));
      } else {
        alert(`삭제 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const loadCustomerEvaluations = async () => {
    setEvaluationsLoading(true);
    try {
      const response = await getMyManagedCustomerEvaluations(evaluationsPage, 12);

      if (response.success && response.data) {
        setCustomerEvaluations(response.data.content || []);
        setEvaluationsTotalPages(response.data.totalPages);
      } else {
        console.error('담당 고객 평가 목록 로드 실패:', response.error);
      }
    } catch (error) {
      console.error('담당 고객 평가 목록 로드 오류:', error);
    } finally {
      setEvaluationsLoading(false);
    }
  };

  // 미작성 평가 목록 로드
  const loadPendingEvaluations = async () => {
    setPendingEvaluationsLoading(true);
    try {
      const response = await getPendingEvaluations(pendingEvaluationsPage, 20);

      if (response.success && response.data) {
        setPendingEvaluations(response.data.evaluations || []);
        setPendingEvaluationsHasNext(response.data.sliceInfo.hasNext);
      } else {
        console.error('미작성 평가 목록 로드 실패:', response.error);
      }
    } catch (error) {
      console.error('미작성 평가 목록 로드 오류:', error);
    } finally {
      setPendingEvaluationsLoading(false);
    }
  };

  // 기존 피드백 데이터 로드
  const loadExistingFeedback = async (
    customerId: number,
    type: FeedbackType,
    year: number,
    month: number,
    week?: number
  ) => {
    setLoadingExistingFeedback(true);
    setIsEditMode(false);

    try {
      if (type === 'monthly') {
        const response = await getAdminMonthlySummary(customerId, year, month);
        if (response.success && response.data) {
          const data = response.data as MonthlySummaryResponseDTO;
          // 완강 후 고객 데이터인지 확인
          if ('isTrainerEvaluated' in data && data.isTrainerEvaluated) {
            setMonthlyEvaluation(data.monthlyEvaluation || '');
            setNextMonthGoal(data.nextMonthGoal || '');
            setIsEditMode(true);
          } else if ('monthlyEvaluation' in data && data.monthlyEvaluation) {
            setMonthlyEvaluation(data.monthlyEvaluation || '');
            setNextMonthGoal('nextMonthGoal' in data ? (data.nextMonthGoal || '') : '');
            setIsEditMode(true);
          } else {
            // 기존 피드백 없음
            setMonthlyEvaluation('');
            setNextMonthGoal('');
            setIsEditMode(false);
          }
        }
      } else if (type === 'weekly' && week) {
        const response = await getAdminWeeklySummary(customerId, year, month, week);
        if (response.success && response.data) {
          const data = response.data;
          // 완강 후 DAY 트레이딩 고객 데이터인지 확인 (AfterCompletedDayWeeklySummaryDTO 타입)
          if ('weeklyLossTradingAnalysis' in data && 'weeklyProfitableTradingAnalysis' in data && 'weeklyEvaluation' in data) {
            const dayData = data as { weeklyLossTradingAnalysis: string | null; weeklyProfitableTradingAnalysis: string | null; weeklyEvaluation: string | null };
            const hasExisting = !!(dayData.weeklyLossTradingAnalysis || dayData.weeklyProfitableTradingAnalysis || dayData.weeklyEvaluation);
            setWeeklyLossTradingAnalysis(dayData.weeklyLossTradingAnalysis || '');
            setWeeklyProfitableTradingAnalysis(dayData.weeklyProfitableTradingAnalysis || '');
            setWeeklyEvaluation(dayData.weeklyEvaluation || '');
            setIsEditMode(hasExisting);
          } else {
            // 기존 피드백 없음
            setWeeklyLossTradingAnalysis('');
            setWeeklyProfitableTradingAnalysis('');
            setWeeklyEvaluation('');
            setIsEditMode(false);
          }
        }
      }
    } catch (error) {
      console.error('기존 피드백 로드 오류:', error);
      // 오류 시 빈 값으로 초기화
      if (type === 'monthly') {
        setMonthlyEvaluation('');
        setNextMonthGoal('');
      } else {
        setWeeklyLossTradingAnalysis('');
        setWeeklyProfitableTradingAnalysis('');
        setWeeklyEvaluation('');
      }
      setIsEditMode(false);
    } finally {
      setLoadingExistingFeedback(false);
    }
  };

  // 피드백 모달 열기
  const openFeedbackModal = (
    customer: CustomerEvaluation,
    type: FeedbackType,
    targetPeriod?: { year: number; month: number; week?: number }
  ) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 현재 주차 계산 (해당 월의 몇 번째 주인지)
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const currentWeek = Math.ceil((now.getDate() + firstDayOfMonth.getDay()) / 7);

    // targetPeriod가 있으면 해당 값을 사용, 없으면 현재 날짜 기준
    const yearToUse = targetPeriod?.year ?? currentYear;
    const monthToUse = targetPeriod?.month ?? currentMonth;
    const weekToUse = targetPeriod?.week ?? Math.min(currentWeek, 5);

    // 상태 초기화
    setMonthlyEvaluation('');
    setNextMonthGoal('');
    setWeeklyLossTradingAnalysis('');
    setWeeklyProfitableTradingAnalysis('');
    setWeeklyEvaluation('');
    setIsEditMode(false);

    setFeedbackModal({
      isOpen: true,
      type,
      customer,
    });
    setSelectedYear(yearToUse);
    setSelectedMonth(monthToUse);
    setSelectedWeek(weekToUse);

    // 기존 피드백 데이터 로드
    loadExistingFeedback(
      customer.customerId,
      type,
      yearToUse,
      monthToUse,
      type === 'weekly' ? weekToUse : undefined
    );
  };

  // 피드백 모달 닫기
  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      type: 'monthly',
      customer: null,
    });
    setMonthlyEvaluation('');
    setNextMonthGoal('');
    setWeeklyLossTradingAnalysis('');
    setWeeklyProfitableTradingAnalysis('');
    setWeeklyEvaluation('');
    setIsEditMode(false);
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedWeek(1);
  };

  // 기간 변경 시 기존 피드백 다시 로드
  const handlePeriodChange = (year: number, month: number, week?: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    if (week !== undefined) {
      setSelectedWeek(week);
    }

    if (feedbackModal.customer) {
      loadExistingFeedback(
        feedbackModal.customer.customerId,
        feedbackModal.type,
        year,
        month,
        feedbackModal.type === 'weekly' ? (week ?? selectedWeek) : undefined
      );
    }
  };

  // 피드백 제출
  const handleSubmitFeedback = async () => {
    if (!feedbackModal.customer) {
      return;
    }

    const { customer, type } = feedbackModal;

    // 유효성 검사
    if (type === 'monthly') {
      if (!monthlyEvaluation.trim() || !nextMonthGoal.trim()) {
        alert('모든 피드백 내용을 입력해주세요.');
        return;
      }
    } else {
      if (!weeklyLossTradingAnalysis.trim() || !weeklyProfitableTradingAnalysis.trim() || !weeklyEvaluation.trim()) {
        alert('모든 피드백 내용을 입력해주세요.');
        return;
      }
    }

    setSubmitting(true);
    try {
      let response;
      if (type === 'monthly') {
        response = await upsertMonthlyEvaluation(
          customer.customerId,
          selectedYear,
          selectedMonth,
          {
            monthlyEvaluation: monthlyEvaluation.trim(),
            nextMonthGoal: nextMonthGoal.trim(),
          }
        );
      } else {
        response = await upsertWeeklyEvaluation(
          customer.customerId,
          selectedYear,
          selectedMonth,
          selectedWeek,
          {
            weeklyLossTradingAnalysis: weeklyLossTradingAnalysis.trim(),
            weeklyProfitableTradingAnalysis: weeklyProfitableTradingAnalysis.trim(),
            weeklyEvaluation: weeklyEvaluation.trim(),
          }
        );
      }

      if (response.success) {
        const actionText = isEditMode ? '수정' : '작성';
        alert(`${type === 'monthly' ? '월간' : '주간'} 피드백이 성공적으로 ${actionText}되었습니다.`);
        closeFeedbackModal();
        loadCustomerEvaluations(); // 목록 새로고침
      } else {
        alert(`피드백 ${isEditMode ? '수정' : '작성'} 실패: ${response.error}`);
      }
    } catch (error) {
      console.error('피드백 제출 오류:', error);
      alert('피드백 제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 투자 유형에 따른 피드백 버튼 표시 여부
  // 완강 여부와 관계없이 투자 유형에 따라 버튼 표시
  const shouldShowFeedbackButton = (
    investmentType: string | null,
    feedbackType: FeedbackType,
    courseStatus: string
  ): boolean => {
    if (!investmentType) return false;

    switch (investmentType) {
      case 'DAY':
        return true; // 데이: 월간, 주간 모두 표시
      case 'SWING':
        return feedbackType === 'monthly'; // 스윙: 월간만 표시
      case 'SCALPING':
        return false; // 스켈핑: 둘 다 미표시
      default:
        return false;
    }
  };

  // 평가 상태에 따른 버튼 스타일/텍스트
  const getEvaluationButtonStyle = (evaluated: boolean) => {
    if (evaluated) {
      return {
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
        text: '작성완료',
      };
    }
    return {
      className: 'bg-blue-500 text-white hover:bg-blue-600',
      text: '작성하기',
    };
  };

  // 과제 현황 모달 열기
  const openHomeworkModal = (customer: CustomerEvaluation) => {
    setHomeworkCustomer(customer);
    setShowHomeworkModal(true);
  };

  // 매매일지 전체 내역 모달 열기
  const openHistoryModal = (customer: CustomerEvaluation) => {
    setHistoryCustomer(customer);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <CustomButton variant="secondary" onClick={handleLogout}>
            로그아웃
          </CustomButton>
        </div>

        {/* 내 담당 고객의 새로운 피드백 요청 리스트 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isAdmin ? '모든 고객의 피드백 요청 목록 (admin-모두 피드백 제공 가능)' : '담당 고객의 새로운 피드백 요청'}
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : feedbackRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              새로운 피드백 요청이 없습니다.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbackRequests.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => handleFeedbackClick(feedback.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {feedback.customerName}
                        {feedback.uid && (
                          <span className="text-gray-500 font-normal">({feedback.uid})</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          신규
                        </span>
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDeleteFeedbackRequest(e, feedback.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feedback.title}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {getInvestmentTypeLabel(feedback.investmentType)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {getCourseStatusLabel(feedback.courseStatus)}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {(currentPage > 0 || hasNext) && (
                <div className="flex justify-center gap-2 mt-6">
                  <CustomButton
                    variant="secondary"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    이전
                  </CustomButton>
                  <CustomButton
                    variant="secondary"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!hasNext}
                  >
                    다음
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </div>

        {/* 내 담당 고객 목록 - ROLE_ADMIN이 아닌 경우에만 표시 */}
        {!isAdmin && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            내 담당 고객 목록
          </h2>

          {evaluationsLoading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : customerEvaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              담당 고객이 없습니다.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['고객 ID', '이름', '전화번호', '투자유형', '완강여부', '강의 과제', '모든 내역', '월간피드백', '주간피드백'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerEvaluations.map((customer) => {
                      const showMonthly = shouldShowFeedbackButton(customer.primaryInvestmentType, 'monthly', customer.courseStatus);
                      const showWeekly = shouldShowFeedbackButton(customer.primaryInvestmentType, 'weekly', customer.courseStatus);
                      const monthlyStyle = customer.monthlyEvaluation
                        ? getEvaluationButtonStyle(customer.monthlyEvaluation.evaluated)
                        : null;
                      const weeklyStyle = customer.weeklyEvaluation
                        ? getEvaluationButtonStyle(customer.weeklyEvaluation.evaluated)
                        : null;

                      return (
                        <tr key={customer.customerId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{customer.customerId}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{customer.phoneNumber}</td>
                          <td className="px-4 py-3 text-sm">
                            {customer.primaryInvestmentType ? (
                              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                {getInvestmentTypeLabel(customer.primaryInvestmentType)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded ${
                              customer.courseStatus === 'AFTER_COMPLETION'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {customer.courseStatus === 'AFTER_COMPLETION' ? '완강' : '진행중'}
                            </span>
                          </td>
                          {/* 강의 과제 */}
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => openHomeworkModal(customer)}
                              className="px-3 py-1.5 text-xs rounded-md font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            >
                              과제 현황
                            </button>
                          </td>
                          {/* 모든 내역 (매매일지 전체 내역) */}
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => openHistoryModal(customer)}
                              className="px-3 py-1.5 text-xs rounded-md font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                            >
                              매매일지 내역 모두 보기
                            </button>
                          </td>
                          {/* 월간 피드백 */}
                          <td className="px-4 py-3 text-sm">
                            {showMonthly && monthlyStyle ? (
                              <button
                                onClick={() => openFeedbackModal(customer, 'monthly')}
                                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${monthlyStyle.className}`}
                              >
                                {customer.monthlyEvaluation?.label || monthlyStyle.text}
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          {/* 주간 피드백 */}
                          <td className="px-4 py-3 text-sm">
                            {showWeekly && weeklyStyle ? (
                              <button
                                onClick={() => openFeedbackModal(customer, 'weekly')}
                                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${weeklyStyle.className}`}
                              >
                                {customer.weeklyEvaluation?.label || weeklyStyle.text}
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {evaluationsTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <CustomButton
                    variant="secondary"
                    onClick={() => setEvaluationsPage((p) => Math.max(0, p - 1))}
                    disabled={evaluationsPage === 0}
                  >
                    이전
                  </CustomButton>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    {evaluationsPage + 1} / {evaluationsTotalPages}
                  </span>
                  <CustomButton
                    variant="secondary"
                    onClick={() => setEvaluationsPage((p) => p + 1)}
                    disabled={evaluationsPage >= evaluationsTotalPages - 1}
                  >
                    다음
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </div>
        )}

        {/* 월간/주간 평가 필요 고객 목록 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            월간/주간 평가 필요 고객 목록
          </h2>

          {pendingEvaluationsLoading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : pendingEvaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              평가가 필요한 고객이 없습니다.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['고객 ID', '이름', '전화번호', '투자유형', '평가유형', '평가대상 기간', '작성'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingEvaluations.map((evaluation, index) => {
                      // 미작성 평가 항목에서 고객 정보를 변환하여 모달 열기
                      const handleEvaluationClick = () => {
                        // PendingEvaluationItemDTO에서 CustomerEvaluation 형태로 변환
                        const customerFromEvaluation: CustomerEvaluation = {
                          customerId: evaluation.customerId,
                          name: evaluation.customerName,
                          phoneNumber: evaluation.phoneNumber,
                          primaryInvestmentType: evaluation.investmentType,
                          courseStatus: 'IN_PROGRESS', // 미작성 평가 대상이므로 진행중으로 간주
                          monthlyEvaluation: null,
                          weeklyEvaluation: null,
                        };

                        // 평가 대상 기간을 targetPeriod로 전달하여 모달 열기
                        openFeedbackModal(
                          customerFromEvaluation,
                          evaluation.evaluationType === 'MONTHLY' ? 'monthly' : 'weekly',
                          {
                            year: evaluation.targetYear,
                            month: evaluation.targetMonth,
                            week: evaluation.targetWeek ?? undefined,
                          }
                        );
                      };

                      return (
                        <tr key={`${evaluation.customerId}-${evaluation.evaluationType}-${evaluation.targetYear}-${evaluation.targetMonth}-${evaluation.targetWeek || 0}-${index}`} className="hover:bg-yellow-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{evaluation.customerId}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{evaluation.customerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{evaluation.phoneNumber}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                              {getInvestmentTypeLabel(evaluation.investmentType)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded ${
                              evaluation.evaluationType === 'MONTHLY'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {evaluation.evaluationType === 'MONTHLY' ? '월간' : '주간'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {evaluation.targetPeriodDisplay}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={handleEvaluationClick}
                              className="px-3 py-1.5 text-xs rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              작성 필요
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {(pendingEvaluationsPage > 0 || pendingEvaluationsHasNext) && (
                <div className="flex justify-center gap-2 mt-6">
                  <CustomButton
                    variant="secondary"
                    onClick={() => setPendingEvaluationsPage((p) => Math.max(0, p - 1))}
                    disabled={pendingEvaluationsPage === 0}
                  >
                    이전
                  </CustomButton>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    {pendingEvaluationsPage + 1} 페이지
                  </span>
                  <CustomButton
                    variant="secondary"
                    onClick={() => setPendingEvaluationsPage((p) => p + 1)}
                    disabled={!pendingEvaluationsHasNext}
                  >
                    다음
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </div>

        {/* 관리자 전용 섹션 - 고객관리 탭과 동일한 테이블들 */}
        {isAdmin && (
          <div className="mt-8 space-y-6">
            <div className="border-t-4 border-blue-500 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">관리자 전용</span>
                전체 고객 관리
              </h2>
              <p className="text-gray-600 mb-6">
                모든 구독 고객, 신규 구독 고객, 무료 고객을 관리할 수 있습니다.
              </p>
            </div>

            {/* 모든 구독 고객 목록 */}
            <SubscriptionCustomersTable showDeleteButton={true} />

            {/* 신규 구독 고객 목록 */}
            <NewSubscriptionCustomersTable showDeleteButton={true} />

            {/* 모든 무료(미구독) 고객 목록 */}
            <FreeCustomersTable showDeleteButton={true} />
          </div>
        )}

        {/* 과제 현황 모달 */}
        {showHomeworkModal && homeworkCustomer && (
          <CustomerHomeworkModal
            customerId={homeworkCustomer.customerId}
            customerName={homeworkCustomer.name}
            onClose={() => setShowHomeworkModal(false)}
          />
        )}

        {/* 매매일지 전체 내역 모달 */}
        {showHistoryModal && historyCustomer && (
          <TradingHistoryModal
            customerId={historyCustomer.customerId}
            customerName={historyCustomer.name}
            onClose={() => setShowHistoryModal(false)}
          />
        )}

        {/* 피드백 작성 모달 */}
        {feedbackModal.isOpen && feedbackModal.customer && (
          <CustomModal
            title={`${feedbackModal.type === 'monthly' ? '월간' : '주간'} 피드백 작성`}
            onClose={closeFeedbackModal}
            size="6xl"
          >
            <div className="space-y-4">
              {/* 고객 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">고객 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">이름:</span>
                    <span className="ml-2 font-medium">{feedbackModal.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">투자유형:</span>
                    <span className="ml-2 font-medium">
                      {feedbackModal.customer.primaryInvestmentType
                        ? getInvestmentTypeLabel(feedbackModal.customer.primaryInvestmentType)
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 기간 선택 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  피드백 기간 선택 <span className="text-red-500">*</span>
                </h3>
                <div className="flex items-center gap-3">
                  {/* 년도 선택 */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => handlePeriodChange(Number(e.target.value), selectedMonth, feedbackModal.type === 'weekly' ? selectedWeek : undefined)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}년
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* 월 선택 */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => handlePeriodChange(selectedYear, Number(e.target.value), feedbackModal.type === 'weekly' ? selectedWeek : undefined)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {month}월
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 주차 선택 (주간 피드백인 경우만) */}
                  {feedbackModal.type === 'weekly' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedWeek}
                        onChange={(e) => handlePeriodChange(selectedYear, selectedMonth, Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                      >
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((week) => (
                          <option key={week} value={week}>
                            {week}주차
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 로딩 인디케이터 */}
                  {loadingExistingFeedback && (
                    <span className="text-sm text-blue-600">기존 피드백 로딩 중...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {feedbackModal.type === 'monthly'
                    ? `${selectedYear}년 ${selectedMonth}월에 대한 월간 피드백을 ${isEditMode ? '수정' : '작성'}합니다.`
                    : `${selectedYear}년 ${selectedMonth}월 ${selectedWeek}주차에 대한 주간 피드백을 ${isEditMode ? '수정' : '작성'}합니다.`}
                </p>
                {isEditMode && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    * 이미 작성된 피드백이 있습니다. 기존 내용이 입력란에 표시됩니다.
                  </p>
                )}
              </div>

              {/* 고객의 월간/주간 피드백 통계 조회 */}
              <FeedbackStatisticsView
                customerId={feedbackModal.customer.customerId}
                type={feedbackModal.type}
                year={selectedYear}
                month={selectedMonth}
                week={feedbackModal.type === 'weekly' ? selectedWeek : undefined}
              />

              {/* 피드백 입력 - 월간 피드백 (2개 필드) */}
              {feedbackModal.type === 'monthly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      트레이너의 한달간 회원님 매매 최종 평가 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={monthlyEvaluation}
                      onChange={(e) => setMonthlyEvaluation(e.target.value)}
                      placeholder="이번 달 회원님의 매매에 대한 종합적인 평가를 작성해주세요..."
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      disabled={loadingExistingFeedback}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      다음달 회원님의 목표 성과 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={nextMonthGoal}
                      onChange={(e) => setNextMonthGoal(e.target.value)}
                      placeholder="다음 달 회원님이 달성해야 할 목표 성과를 작성해주세요..."
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      disabled={loadingExistingFeedback}
                    />
                  </div>
                </div>
              )}

              {/* 피드백 입력 - 주간 피드백 (3개 필드) */}
              {feedbackModal.type === 'weekly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      회원님의 손실난 매매 분석 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={weeklyLossTradingAnalysis}
                      onChange={(e) => setWeeklyLossTradingAnalysis(e.target.value)}
                      placeholder="이번 주 회원님의 손실난 매매에 대한 분석을 작성해주세요..."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      disabled={loadingExistingFeedback}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      회원님의 수익난 매매 분석 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={weeklyProfitableTradingAnalysis}
                      onChange={(e) => setWeeklyProfitableTradingAnalysis(e.target.value)}
                      placeholder="이번 주 회원님의 수익난 매매에 대한 분석을 작성해주세요..."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      disabled={loadingExistingFeedback}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      회원님의 주간 매매 최종 평가 및 개선점 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={weeklyEvaluation}
                      onChange={(e) => setWeeklyEvaluation(e.target.value)}
                      placeholder="이번 주 회원님의 매매에 대한 최종 평가와 개선점을 작성해주세요..."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      disabled={loadingExistingFeedback}
                    />
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex justify-end gap-3">
                <CustomButton variant="secondary" onClick={closeFeedbackModal}>
                  취소
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleSubmitFeedback}
                  disabled={
                    submitting ||
                    loadingExistingFeedback ||
                    (feedbackModal.type === 'monthly'
                      ? !monthlyEvaluation.trim() || !nextMonthGoal.trim()
                      : !weeklyLossTradingAnalysis.trim() || !weeklyProfitableTradingAnalysis.trim() || !weeklyEvaluation.trim())
                  }
                >
                  {submitting ? (isEditMode ? '수정 중...' : '제출 중...') : (isEditMode ? '피드백 수정' : '피드백 제출')}
                </CustomButton>
              </div>
            </div>
          </CustomModal>
        )}
      </main>
    </div>
  );
}
