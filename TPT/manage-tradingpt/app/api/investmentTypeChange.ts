import { apiCall, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';

// Types
export type InvestmentType = 'SWING' | 'DAY' | 'SCALPING';
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface ChangeRequest {
  id: number;
  customerId: number;
  customerName: string;
  currentType: InvestmentType;
  requestedType: InvestmentType;
  status: ChangeRequestStatus;
  reason: string;
  requestedDate: string;
  targetChangeDate: string;
  processedAt?: string;
  approvedByName?: string;
  rejectionReason?: string;
}

export interface ProcessChangeRequestData {
  approved: boolean;
  rejectionReason?: string;
}

// 모든 변경 신청 목록 조회
export async function getAllChangeRequests(): Promise<ApiResponse<ChangeRequest[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: mockData.mockInvestmentChangeRequests || [] }),
        300
      )
    );
  }

  return apiCall<ChangeRequest[]>('/api/v1/admin/investment-type-change-requests', {
    method: 'GET',
  });
}

// 대기 중인 변경 신청 목록 조회
export async function getPendingChangeRequests(): Promise<ApiResponse<ChangeRequest[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) => {
      const pending = (mockData.mockInvestmentChangeRequests || []).filter(
        (req: ChangeRequest) => req.status === 'PENDING'
      );
      setTimeout(() => resolve({ success: true, data: pending }), 300);
    });
  }

  return apiCall<ChangeRequest[]>('/api/v1/admin/investment-type-change-requests/pending', {
    method: 'GET',
  });
}

// 변경 신청 상세 조회
export async function getChangeRequestDetail(
  requestId: number
): Promise<ApiResponse<ChangeRequest>> {
  if (getIsMockMode()) {
    return new Promise((resolve) => {
      const request = (mockData.mockInvestmentChangeRequests || []).find(
        (req: ChangeRequest) => req.id === requestId
      );
      setTimeout(
        () =>
          resolve(
            request
              ? { success: true, data: request }
              : { success: false, error: 'Not found' }
          ),
        300
      );
    });
  }

  return apiCall<ChangeRequest>(
    `/api/v1/admin/investment-type-change-requests/${requestId}`,
    {
      method: 'GET',
    }
  );
}

// 변경 신청 승인/거부
export async function processChangeRequest(
  requestId: number,
  data: ProcessChangeRequestData
): Promise<ApiResponse<ChangeRequest>> {
  return apiCall<ChangeRequest>(
    `/api/v1/admin/investment-type-change-requests/${requestId}/process`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
}
