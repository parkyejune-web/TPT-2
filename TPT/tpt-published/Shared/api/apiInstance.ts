// 절대 함부로 수정 금지 !!!!!!!!

import { ApiResponse, ServerResponse } from "./apiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

export async function fetcher<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const isFormData = options.body instanceof FormData;

		// ✅ 1️⃣ 로컬에서 기존 토큰 읽기 (클라이언트에서만)
		const localToken = typeof window !== "undefined"
			? localStorage.getItem("XSRF-TOKEN")
			: null;

		const headers: HeadersInit = {
			...(localToken ? {
				"X-XSRF-TOKEN": localToken,
				"X-CSRF-TOKEN": localToken  // Spring Security 호환성을 위해 두 가지 모두 전송
			} : {}),
			...(options.headers || {}),
		};

		if (!isFormData) {
			(headers as Record<string, string>)["Content-Type"] = "application/json";
		}

		console.log("🚀 API 요청 시작:", endpoint);
		console.log("👉 요청에 사용된 XSRF-TOKEN:", localToken);
		console.log("📤 요청 헤더:", headers);

		// ✅ 2️⃣ 실제 요청
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers,
			credentials: "include", // 쿠키 포함 필수
			...options,
		});

		console.log("📥 응답 상태:", response.status);
		console.log("📥 응답 헤더 (전체):", Array.from(response.headers.entries()));

		// ✅ 3️⃣ 응답 헤더에서 새 CSRF 토큰 확인
		const newHeaderToken =
			response.headers.get("x-csrf-token") ||
			response.headers.get("x-xsrf-token") ||
			response.headers.get("X-XSRF-TOKEN") ||
			response.headers.get("X-Xsrf-Token") ||
			response.headers.get("csrf-token") ||
			response.headers.get("xsrf-token");

		console.log("🔍 추출된 CSRF 토큰:", newHeaderToken);

		if (newHeaderToken && typeof window !== "undefined") {
			const currentToken = localStorage.getItem("XSRF-TOKEN");
			if (newHeaderToken !== currentToken) {
				console.log("🆕 서버에서 새로운 CSRF 토큰 수신:", newHeaderToken);
				localStorage.setItem("XSRF-TOKEN", newHeaderToken);
				console.log("✅ localStorage에 CSRF 토큰 저장 완료");
			} else {
				console.log("ℹ️ CSRF 토큰 변경 없음 (기존 값과 동일)");
			}
		} else if (typeof window !== "undefined") {
			console.log("⚠️ 응답에 새로운 CSRF 토큰 헤더 없음 — 기존 값 유지");
			console.log("⚠️ localStorage의 기존 토큰:", localStorage.getItem("XSRF-TOKEN"));
		}

		// ✅ 4️⃣ 본문 파싱
		const text = await response.text();
		const raw: ServerResponse<T> | null = text ? JSON.parse(text) : null;

		// ✅ 5️⃣ 오류 처리
		if (!response.ok) {
			console.warn(`⚠️ API 요청 실패 (${response.status}): ${endpoint}`);
			console.warn(`⚠️ 에러 응답 상세:`, raw);

			// 인증 오류 메시지 변환 (401 또는 인증 관련 메시지)
			let errorMessage = raw?.message || "요청이 실패했습니다.";
			if (response.status === 401 || errorMessage.includes("인증이 필요합니다")) {
				errorMessage = "로그인 후 이용하실 수 있는 기능입니다.";
			}

			return {
				success: false,
				status: response.status,
				message: errorMessage,
				error: errorMessage,
				code: raw?.code, // 서버 에러 코드 (예: LECTURE_404_1, LECTURE_404_4)
				data: raw as T, // 에러 응답 전체를 data에 포함 (result 접근용)
			};
		}

		console.log("✅ 요청 성공:", endpoint);
		return {
			success: true,
			status: response.status,
			data: raw?.result,
			message: raw?.message || "요청이 성공했습니다.",
		};
	} catch (error) {
		console.error("❌ API Error:", error);
		return {
			success: false,
			status: 0,
			message: "네트워크 오류 또는 서버 응답 없음",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
