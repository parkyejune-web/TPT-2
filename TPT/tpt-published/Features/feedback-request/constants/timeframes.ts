/**
 * 투자 유형별 타임프레임 상수
 */

export type InvestmentType = 'SWING' | 'DAY' | 'SCALPING';
export type TimeframeType = 'direction' | 'main' | 'sub';

// 투자 유형별 타임프레임 정의
export const TIMEFRAMES_BY_INVESTMENT_TYPE: Record<InvestmentType, Record<TimeframeType, string[]>> = {
  SWING: {
    direction: ['4H', '1H', '15M'],
    main: ['4H', '1H', '15M'],
    sub: ['4H', '1H', '15M'],
  },
  DAY: {
    direction: ['1W', '1D', '4H', '1H', '15M'],
    main: ['1D', '4H', '1H', '15M', '5M'],
    sub: ['4H', '1H', '15M', '5M', '1M'],
  },
  SCALPING: {
    direction: ['15M', '5M', '1M'],
    main: ['15M', '5M', '1M'],
    sub: ['15M', '5M', '1M'],
  },
};

/**
 * 투자 유형에 따른 타임프레임 옵션 반환
 */
export function getTimeframeOptions(investmentType: InvestmentType, type: TimeframeType): string[] {
  return TIMEFRAMES_BY_INVESTMENT_TYPE[investmentType]?.[type] || [];
}
