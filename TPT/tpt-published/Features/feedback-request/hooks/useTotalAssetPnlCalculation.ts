import { useState, useEffect } from 'react';

/**
 * 전체 자산 기준 P&L 자동 계산 훅
 *
 * 계산 공식: P&L * (비중 / 100)
 *
 * @param pl - P&L 값 (절대값)
 * @param isPositive - P&L이 양수인지 여부
 * @param operatingFundsRatio - 비중 (운용 자금 대비, %)
 * @returns 계산된 전체 자산 기준 P&L 값 (소수점 2자리까지)
 */
export function useTotalAssetPnlCalculation(
  pl: number,
  isPositive: boolean,
  operatingFundsRatio: number
): number {
  const [calculatedTotalAssetPnl, setCalculatedTotalAssetPnl] = useState<number>(0);

  useEffect(() => {
    console.log('[useTotalAssetPnlCalculation] 입력값:', { pl, isPositive, operatingFundsRatio });

    // 실제 P&L 값 (부호 적용)
    const actualPl = isPositive ? pl : -pl;

    // 전체 자산 기준 P&L = P&L * (비중 / 100)
    const totalAssetPnl = actualPl * (operatingFundsRatio / 100);
    const rounded = Number(totalAssetPnl.toFixed(2));

    console.log('[useTotalAssetPnlCalculation] ✅ 전체 자산 기준 P&L 계산 완료:', {
      actualPl,
      operatingFundsRatio,
      '계산식': `${actualPl} * (${operatingFundsRatio} / 100)`,
      '결과': rounded,
    });

    setCalculatedTotalAssetPnl(rounded);
  }, [pl, isPositive, operatingFundsRatio]);

  return calculatedTotalAssetPnl;
}

/**
 * 전체 자산 기준 P&L을 계산하는 순수 함수
 */
export function calculateTotalAssetPnl(
  pl: number,
  isPositive: boolean,
  operatingFundsRatio: number
): number {
  const actualPl = isPositive ? pl : -pl;
  const totalAssetPnl = actualPl * (operatingFundsRatio / 100);
  return Number(totalAssetPnl.toFixed(2));
}
