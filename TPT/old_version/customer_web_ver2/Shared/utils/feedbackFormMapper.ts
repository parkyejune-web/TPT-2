/**
 * 피드백 폼 데이터를 FormData로 변환하는 유틸리티 함수들
 *
 * Customer_Web에서 마이그레이션
 */

/**
 * 스윙 폼 데이터를 FormData로 변환
 */
export const mapSwingFormData = (formData: any): FormData => {
  const fd = new FormData();

  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');

  fd.append('feedbackYear', String(formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(formData.feedbackWeek || 1));
  fd.append(
    'feedbackRequestDate',
    formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );

  fd.append('category', formData.category || 'string');
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');
  if (formData.screenshot) fd.append('screenshotFiles', formData.screenshot);
  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('tradingReview', formData.tradingReview || '');
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  fd.append('settingTakeProfit', String(formData.settingTakeProfit || 0));
  fd.append('positionStartReason', formData.positionStartReason || 'string');
  fd.append('positionEndReason', formData.positionEndReason || 'string');

  fd.append('positionStartDate', formData.positionStartDate || '');
  fd.append('positionEndDate', formData.positionEndDate || '');
  fd.append('directionFrameExists', formData.directionFrameExists ? 'true' : 'false');
  fd.append('directionFrame', formData.directionFrame || '');

  fd.append('mainFrame', formData.mainFrame || '');
  fd.append('subFrame', formData.subFrame || '');
  fd.append('trendAnalysis', formData.trendAnalysis || '');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || '');

  fd.append('entryPoint1', formData.entryPoint1 || 'REVERSE');
  fd.append('entryPoint2', formData.entryPoint2 || new Date().toISOString());
  fd.append('entryPoint3', formData.entryPoint3 || new Date().toISOString());
  fd.append('grade', formData.grade || 'S_PLUS');

  return fd;
};

/**
 * 데이 폼 데이터를 FormData로 변환
 */
export const mapDayFormData = (formData: any): FormData => {
  const fd = new FormData();

  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  fd.append('requestDate', new Date().toISOString().split('T')[0]);
  fd.append('category', formData.category || 'string');
  fd.append('positionHoldingTime', formData.positionHoldingTime || 'string');
  if (formData.screenshot) fd.append('screenshotFiles', formData.screenshot);
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('position', formData.position || 'LONG');
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));
  fd.append('tradingReview', formData.tradingReview || 'string');
  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));

  fd.append('directionFrame', formData.directionFrame || 'string');
  fd.append('mainFrame', formData.mainFrame || 'string');
  fd.append('subFrame', formData.subFrame || 'string');
  fd.append('directionFrameExists', formData.directionFrameExists ? 'true' : 'false');

  fd.append('trendAnalysis', formData.trendAnalysis || 'string');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || 'string');

  fd.append('entryPoint1', formData.entryPoint1 || 'REVERSE');
  fd.append('grade', formData.grade || 'S_PLUS');
  fd.append('entryPoint2', formData.entryPoint2 || '1H');

  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  fd.append('settingTakeProfit', String(formData.settingTakeProfit || 0));
  fd.append('positionStartReason', formData.positionStartReason || 'string');
  fd.append('positionEndReason', formData.positionEndReason || 'string');

  return fd;
};

/**
 * 스켈핑 폼 데이터를 FormData로 변환
 */
export const mapScalpingFormData = (formData: any): FormData => {
  const fd = new FormData();

  // 필수 필드
  fd.append('courseStatus', formData.courseStatus || 'AFTER_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'PREMIUM');
  fd.append('useToken', formData.useToken ? 'true' : 'false');
  fd.append('feedbackRequestDate', formData.requestDate || new Date().toISOString().split('T')[0]);
  fd.append('category', formData.category || 'string');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('position', formData.position || 'LONG');
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));

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
  if (formData.screenshot) fd.append('screenshotFiles', formData.screenshot);
  fd.append('tradingReview', formData.tradingReview || '');
  fd.append('trainerFeedbackRequestContent', formData.trainerFeedback || '');

  return fd;
};

/**
 * 무료 고객의 폼 데이터를 FormData로 변환
 * (데이, 스윙, 스켈핑 공통)
 */
export const mapFreeFormData = (formData: any): FormData => {
  const fd = new FormData();

  fd.append('courseStatus', formData.courseStatus || 'BEFORE_COMPLETION');
  fd.append('membershipLevel', formData.membershipLevel || 'BASIC');
  fd.append('useToken', formData.useToken ? 'true' : 'false');

  fd.append(
    'feedbackRequestDate',
    formData.feedbackRequestDate || new Date().toISOString().split('T')[0]
  );
  fd.append('feedbackYear', String(formData.feedbackYear || new Date().getFullYear()));
  fd.append('feedbackMonth', String(formData.feedbackMonth || new Date().getMonth() + 1));
  fd.append('feedbackWeek', String(formData.feedbackWeek || 1));

  fd.append('category', formData.category || 'string');
  fd.append('positionHoldingTime', formData.positionHoldingTime || '');
  if (formData.screenshot) fd.append('screenshotFiles', formData.screenshot);

  fd.append('position', formData.position || 'LONG');
  fd.append('riskTaking', String(formData.riskTaking || formData.risk || 0));
  fd.append('leverage', String(formData.leverage || 0));
  fd.append('pnl', String(formData.pl !== undefined && formData.pl !== null ? formData.pl : 0));
  fd.append('rnr', String(formData.rr || formData.rnr || 0));

  fd.append('operatingFundsRatio', String(formData.operatingFundsRatio || 0));
  fd.append('entryPrice', String(formData.entryPrice || 0));
  fd.append('exitPrice', String(formData.exitPrice || 0));
  fd.append('settingStopLoss', String(formData.settingStopLoss || 0));
  fd.append('settingTakeProfit', String(formData.settingTakeProfit || 0));

  fd.append('positionStartReason', formData.positionStartReason || 'string');
  fd.append('positionEndReason', formData.positionEndReason || 'string');
  fd.append('tradingReview', formData.tradingReview || '');

  return fd;
};

/**
 * 투자 유형과 회원 등급에 따라 적절한 mapper 선택
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
