import { useState, useEffect } from 'react';

/**
 * 리스크 테이킹 자동 계산 훅
 *
 * 계산 공식: |( Entry Price - 설정 손절가) / Entry Price| * 레버리지 * 100
 *
 * @param entryPrice - 진입 가격
 * @param settingStopLoss - 설정 손절가
 * @param leverage - 레버리지
 * @returns 계산된 리스크 테이킹 값 (소수점 2자리까지)
 */
export function useRiskTakingCalculation(
  entryPrice: number,
  settingStopLoss: number,
  leverage: number
): number {
  const [calculatedRiskTaking, setCalculatedRiskTaking] = useState<number>(0);

  useEffect(() => {
    console.log('[useRiskTakingCalculation] 입력값:', { entryPrice, settingStopLoss, leverage });

    // Entry Price가 0이면 계산할 수 없음
    if (entryPrice === 0) {
      console.log('[useRiskTakingCalculation] ⚠️ Entry Price가 0이므로 리스크 테이킹을 0으로 설정');
      setCalculatedRiskTaking(0);
      return;
    }

    // 리스크 테이킹 = |(Entry Price - 설정 손절가) / Entry Price| * 레버리지 * 100
    const riskTaking = Math.abs((entryPrice - settingStopLoss) / entryPrice) * leverage * 100;
    const rounded = Number(riskTaking.toFixed(2));

    console.log('[useRiskTakingCalculation] ✅ 리스크 테이킹 계산 완료:', {
      '계산식': `|(${entryPrice} - ${settingStopLoss}) / ${entryPrice}| * ${leverage} * 100`,
      '결과': rounded,
    });

    setCalculatedRiskTaking(rounded);
  }, [entryPrice, settingStopLoss, leverage]);

  return calculatedRiskTaking;
}

/**
 * 리스크 테이킹을 계산하는 순수 함수
 */
export function calculateRiskTaking(
  entryPrice: number,
  settingStopLoss: number,
  leverage: number
): number {
  if (entryPrice === 0) return 0;

  const riskTaking = Math.abs((entryPrice - settingStopLoss) / entryPrice) * leverage * 100;
  return Number(riskTaking.toFixed(2));
}
