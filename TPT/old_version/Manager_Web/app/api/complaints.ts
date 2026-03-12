import { apiCall, getIsMockMode, mockData } from './index';
import type { ApiResponse } from './index';

// 민원 목록
export async function getAdminComplaints(
  params?: { page?: number; size?: number }
): Promise<ApiResponse<any>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: mockData.mockComplaints }), 300)
    );
  }

  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiCall(`/api/v1/admin/complaints${query ? `?${query}` : ''}`, { method: 'GET' });
}

// 단건 조회
export async function getAdminComplaint(id: number): Promise<ApiResponse<any>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => {
        const complaint = mockData.mockComplaintDetail(id);
        resolve(
          complaint ? { success: true, data: complaint } : { success: false, error: 'Not found' }
        );
      }, 300)
    );
  }
  return apiCall(`/api/v1/admin/complaints/${id}`, { method: 'GET' });
}

// 답변 등록/수정/삭제
export const createComplaintReply = (id: number, reply: string): Promise<ApiResponse<any>> =>
  apiCall(`/api/v1/admin/complaints/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply }),
  });

export const updateComplaintReply = (id: number, reply: string): Promise<ApiResponse<any>> =>
  apiCall(`/api/v1/admin/complaints/${id}/reply`, {
    method: 'PUT',
    body: JSON.stringify({ reply }),
  });

export const deleteComplaintReply = (id: number): Promise<ApiResponse<any>> =>
  apiCall(`/api/v1/admin/complaints/${id}/reply`, { method: 'DELETE' });
