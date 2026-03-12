// import { getXsrfToken, updateXsrfTokenFromResponse } from '../utils/xsrfToken';
// import { getIsMockMode } from '../contexts/MockDataContext';
// import * as mockData from './mockData';

// const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

// interface LoginRequest {
//   username: string;
//   password: string;
// }

// interface LoginResponse {
//   accessToken?: string;
//   refreshToken?: string;
//   user?: any;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }

// // 공통 fetch 함수
// async function apiCall<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<ApiResponse<T>> {
//   try {
//     // XSRF-TOKEN 가져오기
//     const xsrfToken = getXsrfToken();

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       ...options,
//       credentials: 'include', // 쿠키를 포함하여 전송
//       headers: {
//         'Content-Type': 'application/json',
//         ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
//         ...options.headers,
//       },
//     });

//     // 응답에서 XSRF-TOKEN 업데이트 확인
//     updateXsrfTokenFromResponse(response);

//     if (!response.ok) {
//       console.log("오류! response는:", response);
//       const errorData = await response.json().catch(() => ({}));
//       return {
//         success: false,
//         error: errorData.message || `HTTP Error: ${response.status}`,
//       };
//     }

//     if (response.ok){
//      console.log("성공! reeponse는:", response);
//     }

//     const data = await response.json();
//     return {
//       success: true,
//       data: data.data || data,
//     };
//   } catch (error) {
//     console.log("에러:", error);
    
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error',
//     };
//   }
// }

// // ===== 인증 API =====

// // 관리자 로그인 (특별 처리: XSRF-TOKEN을 헤더/쿠키에서 추출)
// export async function adminLogin(
//   credentials: LoginRequest
// ): Promise<ApiResponse<LoginResponse>> {
//   try {
//     const response = await fetch(`${BASE_URL}/api/v1/admin/login`, {
//       method: 'POST',
//       credentials: 'include', // 쿠키를 포함하여 전송
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       return {
//         success: false,
//         error: errorData.message || `HTTP Error: ${response.status}`,
//       };
//     }

//     const data = await response.json();

//     // 응답 헤더에서 XSRF-TOKEN 추출 시도
//     updateXsrfTokenFromResponse(response);

//     return {
//       success: true,
//       data: data.data || data,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error',
//     };
//   }
// }

// // ===== 관리자 - 회원 관리 API =====

// // 신규 가입자 목록 조회 (UID 검토 중)
// export async function getPendingUsers(): Promise<ApiResponse<any>> {
//   if (getIsMockMode()) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           success: true,
//           data: mockData.mockPendingUsers,
//         });
//       }, 300);
//     });
//   }

//   return apiCall('/api/v1/admin/users/pending', {
//     method: 'GET',
//   });
// }

// // 신규 가입자 UID 승인 여부 처리
// export async function updateUserStatus(
//   userId: number,
//   status: 'APPROVED' | 'REJECTED'
// ): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/users/${userId}/status`, {
//     method: 'PATCH',
//     body: JSON.stringify({ status }),
//   });
// }

// // ===== 상담 관리 API (어드민) =====

// // 상담 목록 조회 (관리자)
// export async function getAdminConsultations(params?: {
//   page?: number;
//   size?: number;
// }): Promise<ApiResponse<any>> {
//   if (getIsMockMode()) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           success: true,
//           data: mockData.mockConsultations,
//         });
//       }, 300);
//     });
//   }

//   const queryParams = new URLSearchParams();
//   if (params?.page !== undefined) queryParams.append('page', String(params.page));
//   if (params?.size !== undefined) queryParams.append('size', String(params.size));

//   const query = queryParams.toString();
//   return apiCall(`/api/v1/admin/consultations${query ? `?${query}` : ''}`, {
//     method: 'GET',
//   });
// }

// // 상담 수락 (관리자)
// export async function acceptConsultation(consultationId: number): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/consultations/${consultationId}/accept`, {
//     method: 'PUT',
//   });
// }

// // 상담 메모 저장/수정 (관리자)
// export async function updateConsultationMemo(
//   consultationId: number,
//   memo: string
// ): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/consultations/${consultationId}/memo`, {
//     method: 'PUT',
//     body: JSON.stringify({ memo }),
//   });
// }

// // 상담 슬롯 차단 생성 (관리자)
// export async function createConsultationBlock(blockData: {
//   date: string;
//   time: string;
// }): Promise<ApiResponse<any>> {
//   return apiCall('/api/v1/admin/consultations/blocks', {
//     method: 'POST',
//     body: JSON.stringify(blockData),
//   });
// }

// // 상담 슬롯 차단 해제 (관리자)
// export async function deleteConsultationBlock(blockId: number): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/consultations/blocks?blockId=${blockId}`, {
//     method: 'DELETE',
//   });
// }

// // ===== 트레이너 관리 API =====

// // 트레이너가 담당하는 고객 조회
// // export async function getManagedCustomers(): Promise<ApiResponse<any>> {
// //   if (getIsMockMode()) {
// //     return new Promise((resolve) => {
// //       setTimeout(() => {
// //         resolve({
// //           success: true,
// //           data: mockData.mockManagedCustomers,
// //         });
// //       }, 300);
// //     });
// //   }

// //   return apiCall('/api/v1/trainers/me/managed_customers/evaluations', {
// //     method: 'GET',
// //   });
// // }

// // ===== 피드백 요청 API (어드민) =====

// // 전체 피드백 목록 조회 (어드민)
// export async function getAdminFeedbackRequests(params?: {
//   page?: number;
//   size?: number;
// }): Promise<ApiResponse<any>> {
//   const queryParams = new URLSearchParams();
//   if (params?.page !== undefined) queryParams.append('page', String(params.page));
//   if (params?.size !== undefined) queryParams.append('size', String(params.size));

//   const query = queryParams.toString();
//   return apiCall(`/api/v1/admin/feedback-requests${query ? `?${query}` : ''}`, {
//     method: 'GET',
//   });
// }

// // 베스트 피드백 일괄 업데이트 (어드민)
// export async function updateBestFeedbacks(
//   feedbackIds: number[]
// ): Promise<ApiResponse<any>> {
//   return apiCall('/api/v1/admin/feedback-requests/best', {
//     method: 'PATCH',
//     body: JSON.stringify({ feedbackIds }),
//   });
// }

// // ===== 민원 관리 API (관리자) =====

// // 민원 목록 조회 (관리자)
// export async function getAdminComplaints(params?: {
//   page?: number;
//   size?: number;
// }): Promise<ApiResponse<any>> {
//   if (getIsMockMode()) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           success: true,
//           data: mockData.mockComplaints,
//         });
//       }, 300);
//     });
//   }

//   const queryParams = new URLSearchParams();
//   if (params?.page !== undefined) queryParams.append('page', String(params.page));
//   if (params?.size !== undefined) queryParams.append('size', String(params.size));

//   const query = queryParams.toString();
//   return apiCall(`/api/v1/admin/complaints${query ? `?${query}` : ''}`, {
//     method: 'GET',
//   });
// }

// // 민원 단건 조회 (관리자)
// export async function getAdminComplaint(complaintId: number): Promise<ApiResponse<any>> {
//   if (getIsMockMode()) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const complaint = mockData.mockComplaintDetail(complaintId);
//         if (complaint) {
//           resolve({
//             success: true,
//             data: complaint,
//           });
//         } else {
//           resolve({
//             success: false,
//             error: 'Complaint not found',
//           });
//         }
//       }, 300);
//     });
//   }

//   return apiCall(`/api/v1/admin/complaints/${complaintId}`, {
//     method: 'GET',
//   });
// }

// // 민원 답변 등록 (관리자)
// export async function createComplaintReply(
//   complaintId: number,
//   reply: string
// ): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/complaints/${complaintId}/reply`, {
//     method: 'POST',
//     body: JSON.stringify({ reply }),
//   });
// }

// // 민원 답변 수정 (관리자)
// export async function updateComplaintReply(
//   complaintId: number,
//   reply: string
// ): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/complaints/${complaintId}/reply`, {
//     method: 'PUT',
//     body: JSON.stringify({ reply }),
//   });
// }

// // 민원 답변 삭제 (관리자)
// export async function deleteComplaintReply(complaintId: number): Promise<ApiResponse<any>> {
//   return apiCall(`/api/v1/admin/complaints/${complaintId}/reply`, {
//     method: 'DELETE',
//   });
// }

// // ===== 월간 매매 일지 통계 API (ADMIN) =====

// // 해당 연/월에 대한 데이, 스윙 트레이딩 타입 피드백 통계
// export async function getMonthlyTradingSummary(
//   customerId: number,
//   year: number,
//   month: number
// ): Promise<ApiResponse<any>> {
//   return apiCall(
//     `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
//     {
//       method: 'POST',
//     }
//   );
// }

// export default {
//   adminLogin,
//   getPendingUsers,
//   updateUserStatus,
//   getAdminConsultations,
//   acceptConsultation,
//   updateConsultationMemo,
//   createConsultationBlock,
//   deleteConsultationBlock,
//   // getManagedCustomers,
//   getAdminFeedbackRequests,
//   updateBestFeedbacks,
//   getAdminComplaints,
//   getAdminComplaint,
//   createComplaintReply,
//   updateComplaintReply,
//   deleteComplaintReply,
//   getMonthlyTradingSummary,
// };
