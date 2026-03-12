# 🚨 Mock Data 제거 가이드

이 디렉토리는 **개발/테스트용 Mock 데이터**를 포함하고 있습니다.

실제 API 연동 시 아래 단계를 따라 완전히 제거하세요.

---

## 📋 제거 체크리스트

### 1️⃣ Mock 데이터 파일 삭제
```bash
rm -rf Features/class/__mock__
```

### 2️⃣ 페이지 파일 수정 (`app/menu/class-list/page.tsx`)

**제거할 코드:**
```typescript
// ⚠️ MOCK DATA - 실제 API 연동 후 아래 import와 USE_MOCK_DATA 제거 ⚠️
import { mockRegularChapters, mockProChapters, mockLectureDetails } from '../../../Features/class/__mock__/lectureMockData';
const USE_MOCK_DATA = true; // 실제 API 연동 시 false로 변경
```

**수정할 코드 (fetchCurriculum 내부):**
```typescript
// 삭제할 부분:
// ⚠️ MOCK DATA 사용 ⚠️
if (USE_MOCK_DATA) {
  await new Promise(resolve => setTimeout(resolve, 500));
  setRegularChapters(mockRegularChapters);
  setProChapters(mockProChapters);
  setLoading(false);
  return;
}
```

**수정할 코드 (handleLectureClick 내부):**
```typescript
// 삭제할 부분:
// ⚠️ MOCK DATA 사용 ⚠️
if (USE_MOCK_DATA) {
  const mockDetail = mockLectureDetails[lectureId];
  if (mockDetail) {
    setSelectedLecture(mockDetail);
    setIsVideoModalOpen(true);
  } else {
    alert('강의 정보를 찾을 수 없습니다.');
  }
  return;
}
```

---

## ✅ 최종 결과

Mock 데이터 제거 후:
- `Features/class/__mock__/` 디렉토리 전체 삭제 완료
- `USE_MOCK_DATA` 플래그 제거 완료
- Mock import 문 제거 완료
- 모든 조건문 (`if (USE_MOCK_DATA)`) 제거 완료

이제 실제 API만 호출됩니다! 🎉

---

## 🔍 검증 방법

1. Mock 디렉토리 존재 여부 확인:
   ```bash
   ls Features/class/__mock__
   # "No such file or directory" 출력 확인
   ```

2. Mock import 검색:
   ```bash
   grep -r "lectureMockData" app/menu/class-list/
   # 결과 없음 확인
   ```

3. USE_MOCK_DATA 플래그 검색:
   ```bash
   grep -r "USE_MOCK_DATA" app/menu/class-list/
   # 결과 없음 확인
   ```

---

## 📦 Mock 데이터 내용

참고용으로 현재 Mock 데이터에 포함된 내용:

### Regular Chapters (무료)
- **Chapter 01. 트레이딩 기초** (4강)
  - 트레이딩을 할 준비가 되었는가?
  - 매매일지부터 시작하자
  - 차트의 기본 구조 이해하기
  - 리스크 관리의 기초

- **Chapter 02. 기술적 분석** (4강)
  - 기술적 분석 지표 활용법
  - 패턴 인식과 매매 시그널
  - 추세 분석 마스터
  - 지지와 저항의 실전 활용

### Pro Chapters (유료)
- **Chapter 01. 올바른 트레이딩이란?** (4강)
- **Chapter 02. 투자 유형별 전략** (3강)
- **Chapter 03. 수익 극대화** (2강)

총 **21개 강의** Mock 데이터 포함
