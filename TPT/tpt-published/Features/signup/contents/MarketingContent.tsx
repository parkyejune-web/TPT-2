'use client';

/**
 * 마케팅 정보 수신 동의 내용 컴포넌트
 * 모달과 페이지에서 공통으로 사용
 */
export default function MarketingContent() {
  return (
    <div className="space-y-8">
      {/* 서문 */}
      <section>
        <p className="text-gray-700 leading-relaxed">
          본 동의서는 TPT(이하 "회사")가 회원에게 다양한 혜택 및 맞춤형 정보를 제공하기 위해 광고·마케팅 목적의 정보를 전송함에 있어 필요한 사항을 규정합니다. 본 동의는 선택 사항이며, 동의하지 않더라도 서비스 기본 이용에는 제한이 없습니다.
        </p>
      </section>

      {/* 제1조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
        <p className="text-gray-700 leading-relaxed">
          본 동의는 회사가 회원에게 이벤트, 프로모션, 할인 혜택, 신규 서비스 안내 등 광고·마케팅 정보를 제공하기 위하여 개인정보를 수집·이용하는데 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      {/* 제2조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (이용 목적)</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 다음 각 호의 목적으로 광고·마케팅 정보를 이용자에게 제공할 수 있습니다.
        </p>
        <ol className="list-decimal list-inside ml-2 space-y-2 text-gray-700">
          <li>이벤트, 프로모션, 할인·쿠폰, 신규 콘텐츠 안내</li>
          <li>신규 기능, 업데이트, 서비스 공지 및 추천 정보 제공</li>
          <li>회원 관심 기반 맞춤형 콘텐츠·광고 제공</li>
          <li>설문조사, 만족도 조사, 통계 분석 등 서비스 품질 개선</li>
        </ol>
      </section>

      {/* 제3조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (수집·이용 항목)</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 마케팅 정보 제공을 위해 다음 정보를 수집·이용합니다.
        </p>
        <ol className="list-decimal list-inside ml-2 space-y-2 text-gray-700">
          <li>휴대전화번호</li>
          <li>이메일 주소</li>
          <li>카카오톡 채널/알림톡 수신을 위한 식별 정보</li>
          <li>서비스 이용 이력, 접속 이력, 결제 이력 등 (맞춤 추천 및 광고 효과 분석 목적)</li>
        </ol>
        <p className="text-sm text-gray-500 mt-4">
          ※ 자세한 개인정보 항목 및 보관 기간은 개인정보처리방침에 따릅니다.
        </p>
      </section>

      {/* 제4조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (전송 수단)</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 다음의 전자적 전송 수단을 통하여 광고·마케팅 정보를 발송할 수 있습니다.
        </p>
        <ol className="list-decimal list-inside ml-2 space-y-2 text-gray-700">
          <li>문자메시지 (SMS/MMS)</li>
          <li>카카오 비즈메시지 (알림톡, 친구톡 등)</li>
          <li>카카오톡 채널 메시지</li>
          <li>이메일 (E-mail)</li>
        </ol>
        <p className="text-gray-700 mt-4">
          광고성 정보 발송 시 관련 법령에 따라 (광고) 표시, 발신자 정보, 수신 거부 방법 등을 명확히 고지합니다.
        </p>
      </section>

      {/* 제5조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (보유 및 이용 기간)</h2>
        <p className="text-gray-700 leading-relaxed">
          회사는 회원이 동의를 철회하기 전까지 광고·마케팅 목적의 개인정보를 보유·이용합니다. 관계 법령에서 별도의 보관 기간이 정해진 경우 해당 기간 동안 보관할 수 있습니다.
        </p>
      </section>

      {/* 제6조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (동의 거부 권리 및 불이익)</h2>
        <p className="text-gray-700 leading-relaxed">
          회원은 마케팅 정보 수신에 대한 동의를 거부할 권리가 있으며, 동의를 거부하더라도 서비스 기본 이용에는 어떠한 불이익도 없습니다. 다만, 동의를 하지 않을 경우 혜택, 이벤트, 맞춤형 콘텐츠 안내 등을 제공받지 못할 수 있습니다.
        </p>
      </section>

      {/* 제7조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (동의 철회 및 수신 거부)</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회원은 다음의 방법으로 언제든지 동의를 철회하거나 수신 거부를 요청할 수 있습니다.
        </p>
        <ol className="list-decimal list-inside ml-2 space-y-2 text-gray-700">
          <li>서비스 내 '마케팅 수신 설정' 메뉴에서 변경</li>
          <li>고객센터를 통한 철회 요청</li>
          <li>수신한 메시지 하단의 '수신 거부' 또는 '톡 차단' 기능 이용</li>
          <li>기타 회사가 안내한 절차에 따른 요청</li>
        </ol>
        <p className="text-gray-700 mt-4">
          회사는 철회 요청 접수 즉시 광고성 정보 전송을 중단합니다.
        </p>
      </section>

      {/* 제8조 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (기타)</h2>
        <p className="text-gray-700 leading-relaxed">
          본 동의서에서 명시되지 않은 사항은 개인정보처리방침 및 관계 법령을 따릅니다.
        </p>
      </section>
    </div>
  );
}
