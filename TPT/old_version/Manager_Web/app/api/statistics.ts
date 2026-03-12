import { apiCall } from './index';

// 월간 매매 일지 통계
export async function getMonthlyTradingSummary(
  customerId: number,
  year: number,
  month: number
) {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
    { method: 'POST' }
  );
}
