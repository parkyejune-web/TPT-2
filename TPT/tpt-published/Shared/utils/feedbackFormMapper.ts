/**
 * 피드백 폼 데이터를 FormData로 변환하는 유틸리티 함수들
 *
 * Customer_Web에서 마이그레이션
 *
 * 2025-11-28 변경사항:
 * - 스켈핑 투자 유형 삭제
 * - 스윙/데이 완강 후 매매일지 작성 시 동일한 통합 API 사용
 * - mapUnifiedFormData 함수 추가
 */

/**
 * 통합 API용 폼 데이터 변환 (DAY/SWING 공통)
 * 2025-11-28 기준 새로운 통합 API
 */
export const mapUnifiedFormData = (formData: any, investmentType: 'DAY' | 'SWING'): FormData => {
  const fd = new FormData();

  console.log('[mapUnifiedFormData] 입력 데이터:', formData, 'investmentType:', investmentType);

  // 투자 타입 (필수)
  fd.append('investmentType', investmentType);

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('useToken', formData.useToken ? 'true' : 'false');

  // 주차 정보
  const selectedWeek = formData.selectedWeek;
  fd.append('feedbackYear', String(selectedWeek?.year || formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(selectedWeek?.month || formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(selectedWeek?.week || formData.feedbackWeek || 1));

  // 기록 날짜
  fd.append(
    'feedbackRequestDate',
    formData.recordDate || formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );

  // 기본 정보
  fd.append('category', formData.category || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    fd.append('screenshotFiles', formData.screenshot);
  }

  // 포지션 정보
  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 5));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));

  // P&L 정보
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));

  // Entry/Exit/StopLoss/TakeProfit
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  if (formData.settingTakeProfit !== undefined && formData.settingTakeProfit !== '') {
    fd.append('settingTakeProfit', String(formData.settingTakeProfit));
  }

  // 디렉션 프레임 정보 (완강 후 필수)
  if (formData.directionFrameExists !== null && formData.directionFrameExists !== undefined) {
    fd.append('directionFrameExists', formData.directionFrameExists ? 'true' : 'false');
  }
  fd.append('directionFrame', formData.directionFrame || '');
  fd.append('mainFrame', formData.mainFrame || '');
  fd.append('subFrame', formData.subFrame || '');

  // 추세 분석
  fd.append('trendAnalysis', formData.trendAnalysis || '');
  fd.append('tradingReview', formData.tradingReview || '');

  // 트레이너 피드백 요청 (선택)
  if (formData.trainerFeedback || formData.trainerFeedbackRequestContent) {
    fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || formData.trainerFeedbackRequestContent || '');
  }

  // 진입 타점 (완강 후 필수)
  fd.append('entryPoint', formData.entryPoint1 || formData.entryPoint || 'REVERSE');
  if (formData.grade1 || formData.grade) {
    fd.append('grade', formData.grade1 || formData.grade || 'S_PLUS');
  }

  // 추가 매수/분할 매도 횟수 (선택)
  if (formData.additionalBuyCount !== undefined && formData.additionalBuyCount !== '') {
    fd.append('additionalBuyCount', String(formData.additionalBuyCount));
  }
  if (formData.splitSellCount !== undefined && formData.splitSellCount !== '') {
    fd.append('splitSellCount', String(formData.splitSellCount));
  }

  // SWING 전용 필드: 포지션 시작/종료 날짜
  if (investmentType === 'SWING') {
    fd.append('positionStartDate', formData.entryDate || formData.positionStartDate || '');
    fd.append('positionEndDate', formData.exitDate || formData.positionEndDate || '');
  }

  // DAY 전용 필드: 포지션 홀딩 시간
  if (investmentType === 'DAY') {
    fd.append('positionHoldingTime', formData.positionHoldingTime || '');
  }

  console.log('[mapUnifiedFormData] FormData 생성 완료');
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * 완강 전/무료 고객용 통합 폼 데이터 변환
 */
export const mapUnifiedBeforeFormData = (formData: any, investmentType: 'DAY' | 'SWING'): FormData => {
  const fd = new FormData();

  console.log('[mapUnifiedBeforeFormData] 입력 데이터:', formData, 'investmentType:', investmentType);

  // 투자 타입 (필수)
  fd.append('investmentType', investmentType);

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'BEFORE_COMPLETION');
  fd.append('useToken', formData.useToken ? 'true' : 'false');

  // 주차 정보
  fd.append('feedbackYear', String(formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(formData.feedbackWeek || 1));

  // 기록 날짜
  fd.append(
    'feedbackRequestDate',
    formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );

  // 기본 정보
  fd.append('category', formData.category || '');
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    fd.append('screenshotFiles', formData.screenshot);
  }

  // 포지션 정보
  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));

  // P&L 정보
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));

  // Entry/Exit/StopLoss/TakeProfit (완강 전 필수)
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  if (formData.settingTakeProfit !== undefined && formData.settingTakeProfit !== '') {
    fd.append('settingTakeProfit', String(formData.settingTakeProfit));
  }

  // 포지션 진입/탈출 근거 (완강 전 필수)
  fd.append('positionStartReason', formData.positionStartReason || '');
  fd.append('positionEndReason', formData.positionEndReason || '');

  // 매매 복기
  fd.append('tradingReview', formData.tradingReview || '');

  console.log('[mapUnifiedBeforeFormData] FormData 생성 완료');
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * @deprecated 스윙 폼 데이터를 FormData로 변환 - mapUnifiedFormData 사용 권장
 */
export const mapSwingFormData = (formData: any): FormData => {
  const fd = new FormData();

  console.log('[mapSwingFormData] 입력 데이터:', formData);

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  if (formData.useToken) {
    fd.append('tokenAmount', String(formData.tokenAmount || 3));
  }

  // 주차 정보 (selectedWeek에서 추출)
  const selectedWeek = formData.selectedWeek;
  fd.append('feedbackYear', String(selectedWeek?.year || new Date().getFullYear()));
  fd.append('feedbackMonth', String(selectedWeek?.month || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(selectedWeek?.week || 1));

  // 기록 날짜 (recordDate 사용)
  fd.append(
    'feedbackRequestDate',
    formData.recordDate || formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );

  // 기본 정보
  fd.append('category', formData.category || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    // 이전 단일 파일 방식 호환성
    fd.append('screenshotFiles', formData.screenshot);
  }

  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 5));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));
  fd.append('tradingReview', formData.tradingReview || '');

  // 완강 후 필수 필드 - 포지션 시작/종료 날짜 (entryDate, exitDate에서 매핑)
  fd.append('positionStartDate', formData.entryDate || formData.positionStartDate || '');
  fd.append('positionEndDate', formData.exitDate || formData.positionEndDate || '');

  // Entry/Exit/StopLoss/TakeProfit
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  if (formData.settingTakeProfit !== undefined && formData.settingTakeProfit !== '') {
    fd.append('settingTakeProfit', String(formData.settingTakeProfit));
  }

  // 디렉션 프레임 정보
  if (formData.directionFrameExists !== null && formData.directionFrameExists !== undefined) {
    fd.append('directionFrameExists', formData.directionFrameExists ? 'true' : 'false');
  }
  fd.append('directionFrame', formData.directionFrame || '');
  fd.append('mainFrame', formData.mainFrame || '');
  fd.append('subFrame', formData.subFrame || '');

  // 추세 분석
  fd.append('trendAnalysis', formData.trendAnalysis || '');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || '');

  // 진입 타점 (grade1을 grade로 매핑)
  fd.append('entryPoint', formData.entryPoint1 || 'REVERSE');
  fd.append('grade', formData.grade1 || formData.grade || 'S_PLUS');

  // 추가 매수/분할 매도 횟수 (선택 사항)
  if (formData.additionalBuyCount !== undefined && formData.additionalBuyCount !== '') {
    fd.append('additionalBuyCount', String(formData.additionalBuyCount));
  }
  if (formData.splitSellCount !== undefined && formData.splitSellCount !== '') {
    fd.append('splitSellCount', String(formData.splitSellCount));
  }

  console.log('[mapSwingFormData] FormData 생성 완료');
  // FormData 내용 로깅
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * @deprecated 데이 폼 데이터를 FormData로 변환 - mapUnifiedFormData 사용 권장
 */
export const mapDayFormData = (formData: any): FormData => {
  const fd = new FormData();

  console.log('[mapDayFormData] 입력 데이터:', formData);

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  if (formData.useToken) {
    fd.append('tokenAmount', String(formData.tokenAmount || 3));
  }

  // 기록 날짜 (recordDate 사용) - Day는 주차 정보 불필요
  fd.append(
    'feedbackRequestDate',
    formData.recordDate || formData.requestDate || new Date().toISOString().split('T')[0]
  );

  // 기본 정보
  fd.append('category', formData.category || '');
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    // 이전 단일 파일 방식 호환성
    fd.append('screenshotFiles', formData.screenshot);
  }

  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 5));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('position', formData.position || 'LONG');
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));
  fd.append('tradingReview', formData.tradingReview || '');

  // Entry/Exit/StopLoss/TakeProfit
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  if (formData.settingTakeProfit !== undefined && formData.settingTakeProfit !== '') {
    fd.append('settingTakeProfit', String(formData.settingTakeProfit));
  }

  // 디렉션 프레임 정보
  if (formData.directionFrameExists !== null && formData.directionFrameExists !== undefined) {
    fd.append('directionFrameExists', formData.directionFrameExists ? 'true' : 'false');
  }
  fd.append('directionFrame', formData.directionFrame || '');
  fd.append('mainFrame', formData.mainFrame || '');
  fd.append('subFrame', formData.subFrame || '');

  // 추세 분석
  fd.append('trendAnalysis', formData.trendAnalysis || '');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || '');

  // 진입 타점 (grade1을 grade로 매핑)
  fd.append('entryPoint', formData.entryPoint1 || 'REVERSE');
  fd.append('grade', formData.grade1 || formData.grade || 'S_PLUS');

  // 추가 매수/분할 매도 횟수 (선택 사항)
  if (formData.additionalBuyCount !== undefined && formData.additionalBuyCount !== '') {
    fd.append('additionalBuyCount', String(formData.additionalBuyCount));
  }
  if (formData.splitSellCount !== undefined && formData.splitSellCount !== '') {
    fd.append('splitSellCount', String(formData.splitSellCount));
  }

  console.log('[mapDayFormData] FormData 생성 완료');
  // FormData 내용 로깅
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * @deprecated 스켈핑 폼 데이터를 FormData로 변환 - 스켈핑 투자 유형 삭제됨
 */
export const mapScalpingFormData = (formData: any): FormData => {
  const fd = new FormData();

  console.log('[mapScalpingFormData] 입력 데이터:', formData);

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  if (formData.useToken) {
    fd.append('tokenAmount', String(formData.tokenAmount || 3));
  }

  // 기록 날짜
  fd.append(
    'feedbackRequestDate',
    formData.feedbackRequestDate || formData.recordDate || formData.requestDate || new Date().toISOString().split('T')[0]
  );

  // 주차 정보
  fd.append('feedbackYear', String(formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(formData.feedbackWeek || 1));

  fd.append('category', formData.category || 'string');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('position', formData.position || 'LONG');
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));

  // 항상 필수 필드 (스켈핑 API 스펙)
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  fd.append('settingTakeProfit', String(formData.settingTakeProfit || 0));
  fd.append('positionStartReason', formData.positionStartReason || 'string');
  fd.append('positionEndReason', formData.positionEndReason || 'string');

  // 선택 필드
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    // 이전 단일 파일 방식 호환성
    fd.append('screenshotFiles', formData.screenshot);
  }

  fd.append('tradingReview', formData.tradingReview || '');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || '');

  console.log('[mapScalpingFormData] FormData 생성 완료');
  // FormData 내용 로깅
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * @deprecated 무료 고객의 폼 데이터를 FormData로 변환 - mapUnifiedBeforeFormData 사용 권장
 * (데이, 스윙 공통 - 스켈핑 삭제됨)
 */
export const mapFreeFormData = (formData: any): FormData => {
  const fd = new FormData();

  console.log('[mapFreeFormData] 입력 데이터:', formData);

  fd.append('courseStatus', formData.courseStatus || 'BEFORE_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'BASIC');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  if (formData.useToken) {
    fd.append('tokenAmount', String(formData.tokenAmount || 3));
  }

  fd.append(
    'feedbackRequestDate',
    formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );
  fd.append('feedbackYear', String(formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(formData.feedbackWeek || 1));

  fd.append('category', formData.category || 'string');
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');

  // 다중 스크린샷 파일 처리
  if (formData.screenshotFiles && Array.isArray(formData.screenshotFiles)) {
    formData.screenshotFiles.forEach((file: File) => {
      fd.append('screenshotFiles', file);
    });
  } else if (formData.screenshot) {
    // 이전 단일 파일 방식 호환성
    fd.append('screenshotFiles', formData.screenshot);
  }

  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('totalAssetPnl', String(formData.totalAssetPnl || 0));

  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  fd.append('settingTakeProfit', String(formData.settingTakeProfit || 0));

  fd.append('positionStartReason', formData.positionStartReason || 'string');
  fd.append('positionEndReason', formData.positionEndReason || 'string');
  fd.append('tradingReview', formData.tradingReview || '');

  console.log('[mapFreeFormData] FormData 생성 완료');
  // FormData 내용 로깅
  for (const [key, value] of fd.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  return fd;
};

/**
 * 투자 유형과 회원 등급에 따라 적절한 mapper 선택 (통합 API용)
 * 2025-11-28 기준 새로운 통합 API 사용
 */
export const selectUnifiedFormMapper = (
  investmentType: 'SWING' | 'DAY' | '',
  isPremium: boolean,
  isCourseCompleted: boolean
): ((formData: any) => FormData) => {
  const type = (investmentType === 'SWING' || investmentType === 'DAY') ? investmentType : 'DAY';

  // 무료 회원 또는 완강 전
  if (!isPremium || !isCourseCompleted) {
    return (formData: any) => mapUnifiedBeforeFormData(formData, type);
  }

  // PREMIUM + 완강 후
  return (formData: any) => mapUnifiedFormData(formData, type);
};

/**
 * @deprecated 투자 유형과 회원 등급에 따라 적절한 mapper 선택 - selectUnifiedFormMapper 사용 권장
 */
export const selectFormMapper = (
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '',
  isPremium: boolean,
  isCourseCompleted: boolean
) => {
  // 무료 회원 또는 BASIC
  if (!isPremium) {
    return mapFreeFormData;
  }

  // 완강 전
  if (!isCourseCompleted) {
    return mapFreeFormData;
  }

  // PREMIUM + 완강 후
  switch (investmentType) {
    case 'SWING':
      return mapSwingFormData;
    case 'DAY':
      return mapDayFormData;
    case 'SCALPING':
      return mapScalpingFormData;
    default:
      return mapFreeFormData;
  }
};
