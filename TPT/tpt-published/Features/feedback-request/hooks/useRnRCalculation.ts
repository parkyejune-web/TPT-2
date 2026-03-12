import { useState, useEffect } from 'react';

/**
 * R&R (Risk & Reward) 계산을 위한 커스텀 훅
 *
 * @param pl - P&L 값 (절대값)
 * @param isPositive - P&L이 양수인지 여부
 * @param risk - 리스크 테이킹 값
 * @returns 계산된 R&R 값 (소수점 2자리까지)
 */
export function useRnRCalculation(pl: number, isPositive: boolean, risk: number): number {
  const [calculatedRnR, setCalculatedRnR] = useState<number>(0);

  console.log('[useRnRCalculation] Hook 호출됨 - 입력값:', { pl, isPositive, risk, 'current calculatedRnR': calculatedRnR });

  useEffect(() => {
    console.log('[useRnRCalculation] useEffect 실행 시작 - 입력값:', { pl, isPositive, risk });

    // 리스크가 0이면 R&R을 계산할 수 없음
    if (risk === 0) {
      console.log('[useRnRCalculation] ⚠️ 리스크가 0이므로 R&R을 0으로 설정');
      setCalculatedRnR(0);
      return;
    }

    // 실제 P&L 값 계산 (부호 적용)
    const actualPl = isPositive ? pl : -pl;

    // R&R = P&L / Risk
    const rnr = Number((actualPl / risk).toFixed(2));

    console.log('[useRnRCalculation] ✅ R&R 계산 완료:', {
      pl,
      isPositive,
      actualPl,
      risk,
      '계산식': `${actualPl} / ${risk}`,
      '결과(rnr)': rnr,
      '이전 calculatedRnR': calculatedRnR,
    });

    setCalculatedRnR(rnr);
    console.log('[useRnRCalculation] 🔄 setCalculatedRnR 호출됨 - 새 값:', rnr);
  }, [pl, isPositive, risk]);

  console.log('[useRnRCalculation] Hook 반환값:', calculatedRnR);
  return calculatedRnR;
}

/**
 * P&L에 부호를 적용한 실제 값을 반환하는 유틸리티 함수
 *
 * @param pl - P&L 값 (절대값)
 * @param isPositive - P&L이 양수인지 여부
 * @returns 부호가 적용된 실제 P&L 값
 */
export function getActualPnL(pl: number, isPositive: boolean): number {
  return isPositive ? pl : -pl;
}

/**
 * R&R을 계산하는 순수 함수
 *
 * @param pl - P&L 값 (절대값)
 * @param isPositive - P&L이 양수인지 여부
 * @param risk - 리스크 테이킹 값
 * @returns 계산된 R&R 값 (소수점 2자리까지)
 */
export function calculateRnR(pl: number, isPositive: boolean, risk: number): number {
  if (risk === 0) return 0;

  const actualPl = getActualPnL(pl, isPositive);
  return Number((actualPl / risk).toFixed(2));
}
