'use client';

import { useRouter } from 'next/navigation';
import { useWindowWidth } from '../../Shared/hooks/useWindowWidth';

/**
 * 개인정보 처리방침 페이지
 * /privacy
 */
export default function PrivacyPage() {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`max-w-4xl mx-auto ${isMobile ? 'px-4 py-6' : 'px-8 py-12'}`}>
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            개인정보 처리방침
          </h1>
          <p className="text-gray-500 mt-2">최종 수정일: 2025년 11월 30일</p>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
          {/* 1. 수집하는 개인정보 항목 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <div className="text-gray-700 leading-relaxed space-y-5">
              {/* 회원가입(필수) */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 회원가입(필수)
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>이름</li>
                  <li>이메일 주소</li>
                  <li>휴대전화번호</li>
                  <li>비밀번호 (네이버/카카오 소셜로그인 이용 시 미수집)</li>
                  <li>소셜로그인 정보 (네이버/카카오)</li>
                </ul>
              </div>

              {/* 회원가입(선택) */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 회원가입(선택)
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>프로필 사진</li>
                  <li>닉네임</li>
                </ul>
              </div>

              {/* 유료 서비스 이용 시 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 유료 서비스 이용 시(강의·정기결제 포함)
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>결제 정보(카드번호 일부, 승인번호, 결제 이력)</li>
                  <li>나이스페이먼츠 제공 고유 결제 식별값</li>
                </ul>
                <p className="text-sm text-gray-500 ml-4 mt-2">※ 카드번호 전체는 저장하지 않으며 PG사에서 암호화 처리합니다.</p>
              </div>

              {/* 매매일지 작성 서비스 이용 시 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 매매일지 작성 서비스 이용 시
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>사용자가 직접 입력한 매매일지 정보</li>
                  <li>로그 기록(저장·수정·조회 시간)</li>
                  <li>보관 과정에서 비식별 조치 적용</li>
                </ul>
              </div>

              {/* 자동 수집 정보 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 서비스 이용 과정에서 자동 수집되는 정보
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>접속 기록(IP), 접속 시간</li>
                  <li>기기 정보(OS, 브라우저)</li>
                  <li>쿠키(Cookie) 정보</li>
                  <li>서비스 이용 로그(클릭, 조회 정보 등)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. 개인정보의 수집 및 이용 목적 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
            <div className="text-gray-700 leading-relaxed space-y-5">
              {/* 회원 관리 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 회원 관리
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>회원 가입 및 본인 인증</li>
                  <li>네이버/카카오 소셜로그인 지원</li>
                  <li>계정 식별 및 서비스 이용 자격 확인</li>
                  <li>고객문의 대응 및 공지 사항 전달</li>
                </ul>
              </div>

              {/* 서비스 제공 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 서비스 제공
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>유료·무료 강의 제공</li>
                  <li>매매일지 작성·저장·조회 기능 제공</li>
                  <li>정기결제 기반 교육 프로그램 운영</li>
                  <li>계정 보안 및 비정상 이용 방지</li>
                </ul>
              </div>

              {/* 결제 및 정산 처리 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 결제 및 정산 처리
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>유료 상품 결제 관리</li>
                  <li>정기결제 및 구독 처리</li>
                  <li>환불 및 정산 업무</li>
                  <li>PG사 인증 처리</li>
                </ul>
              </div>

              {/* 서비스 개선 및 마케팅 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">■</span> 서비스 개선 및 마케팅(선택 동의 시)
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>서비스 분석 및 기능 고도화</li>
                  <li>신규 기능 개발</li>
                  <li>이벤트·프로모션 안내</li>
                  <li>맞춤형 서비스 제공</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 개인정보 보유 및 이용 기간 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보 보유 및 이용 기간</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>TPT는 원칙적으로 회원 탈퇴 시 개인정보를 즉시 파기합니다.</p>
              <p>단, 법령 또는 서비스 운영에 필요한 경우 다음 기간 동안 보관합니다.</p>

              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">■</span> 회원 가입 정보
                  </h3>
                  <p className="ml-6 text-gray-600">탈퇴 즉시 파기</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">■</span> 부정 이용 방지 기록
                  </h3>
                  <p className="ml-6 text-gray-600">DI·휴대전화번호: 6개월</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">■</span> 전자상거래법에 따른 법정 보관
                  </h3>
                  <ul className="list-disc list-inside ml-6 space-y-1 text-gray-600">
                    <li>결제 기록: 5년</li>
                    <li>계약 및 청약철회: 5년</li>
                    <li>소비자 불만 및 분쟁 처리: 3년</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">■</span> 통신비밀보호법
                  </h3>
                  <p className="ml-6 text-gray-600">접속 기록(IP 등): 3개월</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">■</span> 매매일지 데이터
                  </h3>
                  <ul className="list-disc list-inside ml-6 space-y-1 text-gray-600">
                    <li>회원 탈퇴 시 즉시 비식별 처리 → 30일간 백업 보관</li>
                    <li>30일 후 영구 삭제</li>
                  </ul>
                  <p className="text-sm text-gray-500 ml-6 mt-1">※ 탈퇴 철회 요청 대응 및 시스템 오류 복구 목적</p>
                </div>
              </div>
            </div>
          </section>

          {/* 개인정보 파기 절차 및 방법 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✔</span> 개인정보 파기 절차 및 방법
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>TPT는 수집 목적이 달성되거나 보유 기간이 종료된 경우, 아래 기준에 따라 즉시 파기합니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-2 mt-3">
                <li><span className="font-medium">전자 파일 형태:</span> 복구가 불가능한 방식으로 영구 삭제</li>
                <li><span className="font-medium">출력물 형태:</span> 파쇄 또는 소각을 통해 완전 파기</li>
              </ul>
              <p className="mt-3">백업 서버에 존재하는 데이터 또한 복구 불가 방식으로 삭제합니다.</p>
            </div>
          </section>

          {/* 4. 이용자의 권리와 행사 방법 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✔</span> 4. 이용자의 권리와 행사 방법
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원은 언제든지 다음 사항에 대해 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1 mt-3">
                <li>개인정보 열람 요구</li>
                <li>정정 요청</li>
                <li>삭제 요청</li>
                <li>처리 정지 요구</li>
              </ul>
              <p className="mt-3">요청은 이메일 또는 고객센터를 통해 가능하며, TPT는 관련 법령에 따라 지체 없이 처리합니다.</p>
            </div>
          </section>

          {/* 5. 개인정보 수집 및 이용 동의 거부권 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보 수집 및 이용 동의 거부권 및 불이익 안내</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원은 개인정보 제공에 대한 동의를 거부할 권리가 있습니다.</p>
              <p>단, 필수 항목 거부 시 서비스 이용이 제한될 수 있습니다.</p>
              <div className="bg-gray-50 rounded-lg p-4 mt-3 space-y-2">
                <p><span className="font-medium text-gray-900">필수 항목 거부</span> → TPT 계정 생성 불가</p>
                <p><span className="font-medium text-gray-900">결제 정보 거부</span> → 유료 상품 및 정기결제 서비스 이용 불가</p>
                <p><span className="font-medium text-gray-900">선택 항목 거부</span> → 기본 서비스 이용 가능</p>
              </div>
            </div>
          </section>

          {/* 6. 개인정보 제3자 제공 및 처리 위탁 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 개인정보 제3자 제공 및 처리 위탁</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>TPT는 고객의 정보를 원칙적으로 외부에 제공하지 않습니다.</p>
              <p>다만, 안정적인 서비스 제공을 위해 아래 업체에 처리를 위탁합니다.</p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">위탁업체</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">위탁업무</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">나이스페이먼츠</td>
                      <td className="border border-gray-300 px-4 py-2">카드 결제·정기결제 처리</td>
                      <td className="border border-gray-300 px-4 py-2">암호화된 결제 식별 정보만 처리</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Amazon Web Services(AWS)</td>
                      <td className="border border-gray-300 px-4 py-2">서버 운영, 보안, 데이터 보관</td>
                      <td className="border border-gray-300 px-4 py-2">모든 데이터 암호화 저장</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">알리고·카카오비즈</td>
                      <td className="border border-gray-300 px-4 py-2">인증번호·알림톡 발송</td>
                      <td className="border border-gray-300 px-4 py-2">최소 정보만 제공</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 mt-3">※ 모든 위탁 업체는 개인정보보호법 및 보안 의무를 준수합니다.</p>
            </div>
          </section>

          {/* 7. 쿠키 사용 및 거부 방법 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✔</span> 7. 쿠키 사용 및 거부 방법
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>TPT는 서비스 편의성과 분석을 위해 쿠키를 사용합니다.</p>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">쿠키 사용 목적</h3>
                <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                  <li>로그인 유지</li>
                  <li>사용자 환경 설정 저장</li>
                  <li>서비스 이용 분석</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">쿠키 거부 방법</h3>
                <p className="text-gray-600 mb-2">이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                  <li><span className="font-medium">크롬:</span> 설정 → 개인정보보호 → 쿠키 및 기타 사이트 데이터</li>
                  <li><span className="font-medium">사파리:</span> 설정 → 개인정보 보호 → 쿠키 차단</li>
                  <li><span className="font-medium">엣지:</span> 설정 → 쿠키 및 사이트 권한</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">쿠키를 차단할 경우 서비스 일부 기능이 제한될 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 8. 만 14세 미만 아동의 개인정보 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✔</span> 8. 만 14세 미만 아동의 개인정보
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>TPT는 만 14세 미만 사용자의 회원가입을 허용하지 않습니다.</p>
              <p>이용자가 만 14세 미만으로 확인되는 경우 회원가입이 제한됩니다.</p>
            </div>
          </section>

          {/* 9. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✔</span> 9. 개인정보 보호책임자
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>TPT는 개인정보 보호와 관련된 문의를 신속하게 처리하기 위해 보호책임자를 지정하고 있습니다.</p>

              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="font-medium text-gray-900 mb-3">개인정보 보호책임자</p>
                <ul className="space-y-2 text-gray-600">
                  <li><span className="font-medium">성명:</span> 김동욱</li>
                  <li><span className="font-medium">이메일:</span> tpt251210@gmail.com</li>
                  <li><span className="font-medium">연락처:</span> 02-857-1210</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 부칙 */}
          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">부칙</h2>
            <p className="text-gray-700 leading-relaxed">
              본 개인정보 처리방침은 2025년 11월 30일부터 시행됩니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
