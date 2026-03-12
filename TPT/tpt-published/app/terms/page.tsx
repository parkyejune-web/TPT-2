'use client';

import { useRouter } from 'next/navigation';
import { useWindowWidth } from '../../Shared/hooks/useWindowWidth';

/**
 * 이용약관 페이지
 * /terms
 */
export default function TermsPage() {
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
            이용약관
          </h1>
          <p className="text-gray-500 mt-2">최종 수정일: 2025년 12월 9일</p>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
          {/* 제1조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 TPT(이하 "회사")가 제공하는 웹사이트 및 관련 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무, 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>"회원"이라 함은 회사가 정한 절차에 따라 가입 신청을 완료하고, 회사의 승인을 통해 ID를 부여받아 서비스 이용 자격을 취득한 개인 또는 단체를 말합니다. 회원은 회사의 정책에 따라 이용 범위가 구분될 수 있습니다.</p>
              <p>"무료서비스"라 함은 회원가입만으로 이용 가능한 기본 기능을 의미하며, 구체적 제공 범위는 회사의 정책에 따라 변동될 수 있습니다.</p>
              <p>"유료서비스"라 함은 회원이 결제를 통해 이용할 수 있는 기능으로, 콘텐츠 제공, 정기결제 프로그램, 분석 기능, 피드백 기능 등을 포함하되 이에 한정되지 않습니다. 유료서비스의 구성·가격·제공 방식은 회사 정책에 따라 변경될 수 있습니다.</p>
              <p>"게시물"은 회원이 서비스 내에서 작성 또는 제출하는 모든 글, 이미지, 파일 등을 의미합니다.</p>
            </div>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (회원가입 조건)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원가입은 이용자가 약관에 동의하고 가입 절차를 완료한 후, 회사가 정한 내부 기준에 따라 가입 신청을 승인함으로써 성립합니다.</p>
              <p>회원은 TPT가 제휴한 해외거래소의 제휴코드를 선택적으로 사용할 수 있으며, 이는 서비스 이용의 필수 조건이 아닙니다. 단, 서비스 제공을 위하여 필요한 경우 회사는 회원의 계정 정보 또는 이용 관련 자료 제출을 요청할 수 있습니다.</p>
              <p>TPT 서비스는 누구나 가입 신청이 가능하나, 내부 정책에 따른 정원제 운영 및 서비스 품질 유지 기준에 따라 선별된 인원에게만 최종 이용 자격이 부여됩니다. 회사는 운영 적정성 및 시스템 안정성을 위하여 가입 승인 절차를 차등 적용할 수 있습니다.</p>
              <p className="mt-3">회사는 다음 각 호에 해당하는 경우 가입 승인 또는 처리를 거부하거나 유보할 수 있습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>제출한 정보가 허위이거나 타인의 정보를 도용한 경우</li>
                <li>법령 또는 약관을 위반한 이력이 있는 경우</li>
                <li>서비스의 정상적인 운영 또는 다른 회원의 이용에 현저한 지장을 초래할 우려가 있는 경우</li>
                <li>정원 초과, 운영 정책 변경, 서비스 품질 유지 등을 위하여 회사가 필요하다고 판단하는 경우</li>
              </ul>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (유효회원의 정의 및 서비스 제공 대상)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회사는 서비스 품질 유지 및 운영 정책에 따라 무료서비스와 유료서비스의 제공 범위, 사용 조건, 기능 제한 여부를 변경할 수 있으며, 그 변경 사항은 사전 공지합니다.</p>
              <p>"유료서비스"라 함은 회원이 결제 또는 별도 권한을 통해 이용할 수 있는 기능을 의미하며, 제공 내용·범위·가격은 회사가 정한 기준에 따라 조정될 수 있습니다.</p>
              <p>회사는 서비스 개선 및 운영 효율화를 위해 무료서비스 또는 유료서비스의 일부 또는 전부를 변경·추가·삭제할 수 있으며, 그 변경 사항은 회사가 정한 방식으로 사전에 공지합니다.</p>

              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">(서비스 이용 제한 관련 정책)</p>
                <p>무분별한 피드백 요청, 반복적·악의적 문의, 비정상적 사용 패턴이 확인되는 경우 회사는 경고 후 서비스 이용을 제한할 수 있습니다. 다만 긴급한 경우 사전 경고 없이 일시 제한할 수 있으며, 사후 합리적 기간 내에 조치 사유를 안내합니다.</p>
                <p className="mt-2">다음 각 호에 해당하는 경우 이용 제한 조치가 적용될 수 있습니다.</p>
                <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                  <li>동일한 피드백을 과도하게 반복 요청하는 경우</li>
                  <li>분석을 위한 필수 정보 누락 등으로 서비스가 불가능한 상태가 반복되는 경우</li>
                  <li>욕설, 비하, 비정상적 행위로 운영을 방해하는 경우</li>
                  <li>회사 정책에 반하는 방식으로 서비스를 악용하는 경우</li>
                </ul>
                <p className="mt-2">이러한 조치는 서비스의 품질 유지와 모든 이용자에게의 공정한 환경 제공을 위한 기준입니다.</p>
              </div>
            </div>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (서비스 이용계약의 성립)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>이용자가 약관에 동의하고 회원가입을 완료함으로써 이용계약이 성립합니다.</p>
              <p>회사는 다음의 경우 이용 신청을 거부할 수 있습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>타인의 명의 도용 또는 허위 정보 제출</li>
                <li>법령 또는 약관 위반</li>
                <li>회사의 서비스 제공에 현저한 지장을 줄 우려가 있는 경우</li>
              </ul>
            </div>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (회원정보 관리 및 의무)</h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc list-inside ml-2">
              <li>회원은 ID와 비밀번호 관리 책임이 있으며, 제3자에게 양도·공유할 수 없습니다.</li>
              <li>개인정보는 정확하게 입력해야 하며, 변경된 정보는 즉시 수정해야 합니다.</li>
              <li>개인정보 관리 소홀, 계정 공유 등으로 발생하는 손해는 회원에게 책임이 있습니다.</li>
            </ul>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (서비스 이용)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회사는 무료 및 유료 서비스를 구분하여 제공하며, 다음과 같은 사유로 일시 중단될 수 있습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>시스템 점검·유지보수</li>
                <li>서버·통신 장애</li>
                <li>천재지변 등 불가항력적 사유</li>
              </ul>
              <p className="mt-3">서비스의 구성, 제공 방식, 일부 기능은 회사 정책에 따라 변경될 수 있으며, 변경 시 사전 공지합니다.</p>
              <p>서비스 전체 또는 일부의 제공 중단이 필요한 경우 회사는 합리적 기간을 두고 회원에게 고지합니다.</p>
            </div>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (유료서비스 이용 및 결제)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>유료서비스는 결제 완료 시 이용이 시작됩니다.</p>
              <p>결제 수단은 나이스페이먼츠를 통한 일반 결제 및 정기결제를 포함합니다.</p>
              <p>결제 정보는 PG사에서 암호화하여 저장하며, 회사는 전체 카드번호 등을 저장하지 않습니다.</p>

              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">환불 정책:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>강의 자료 열람 또는 1강 수강 이후 환불 불가</li>
                  <li>법령에 따른 환불 사유 발생 시 관련 법령을 우선 적용</li>
                </ul>
              </div>

              <p className="mt-3">정기결제는 매 결제 주기마다 자동 갱신되며, 회원이 해지 신청을 하지 않는 한 갱신에 동의한 것으로 봅니다.</p>

              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="text-gray-700">정기결제일 이전에 결제수단을 삭제하거나 변경하더라도, 이미 예정된 결제는 정상적으로 진행됩니다.</p>
                <p className="text-gray-700 mt-2">정기결제일 이후에 결제수단을 취소하거나 삭제한 경우에는, 환불 여부는 회사의 환불정책에 따릅니다.</p>
              </div>
            </div>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (매매일지 관련)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원은 매매일지를 작성·저장·조회·분석하는 기능을 이용할 수 있습니다.</p>
              <p>회원 탈퇴 시 매매일지는 비식별 처리 후 30일간 백업 보관되며, 이후 완전히 삭제됩니다.</p>
              <p>백업 목적은 탈퇴 철회 요청 대응 및 시스템 오류 복구에 한하며, 원본과 재결합이 불가능하도록 처리합니다.</p>
            </div>
          </section>

          {/* 제9조의2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조의2 (매매일지 모아보기 노출 정책)</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>서비스 내 "매매일지 모아보기" 영역에서는 회원이 작성한 매매일지가 노출될 수 있습니다.</p>
              <p>단, 작성자의 실명·연락처·계좌 등 식별 가능한 개인정보는 노출되지 않으며, 닉네임 기반으로만 공개됩니다.</p>

              <p className="mt-3">회사는 다음 기준에 따라 정보를 처리합니다.</p>

              <div className="space-y-4 mt-3">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">비식별 처리 원칙</h3>
                  <p>매매일지 내용 중 개인을 특정할 수 있는 정보는 저장 또는 공개하지 않습니다.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">법 준수 의무</h3>
                  <p>공개되는 정보는 개인정보보호법 및 관련 법령을 준수합니다.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">회원 보호 조치</h3>
                  <p>회원이 요청할 경우, 특정 매매일지의 노출 제한 또는 숨김 처리를 검토할 수 있습니다.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">운영 목적</h3>
                  <p>모아보기 기능은 교육 목적 및 트레이딩 품질 향상을 위한 참고용이며, 회원의 동의 없는 영리적 2차 활용은 하지 않습니다.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (금지행위)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원은 다음의 행위를 할 수 없습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>서비스 또는 서버에 대한 비정상적 접근, 해킹, 우회 시도</li>
                <li>자동화 스크립트, 매크로 등을 통한 부정 이용</li>
                <li>타인의 계정 공유, 도용</li>
                <li>결제 시스템을 악용한 부정 결제 및 환불 요청</li>
                <li>콘텐츠의 무단 복제·배포·공유</li>
                <li>회사가 제공하는 자료 또는 시스템을 상업적으로 활용하는 행위</li>
              </ul>
              <p className="mt-3">금지행위가 확인될 경우 회사는 즉시 서비스 제공을 제한하거나 계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          {/* 제10조의2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조의2 (게시물의 관리 및 삭제)</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">(적용범위)</h3>
                <p>본 조항은 회원이 서비스 내에 게시하는 모든 게시물(글, 이미지, 댓글, 첨부파일 등, 이하 총칭하여 "게시물")에 적용됩니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(관리·삭제 권한)</h3>
                <p>회사는 회원이 게시한 게시물이 다음 각 호에 해당한다고 판단되는 경우, 사전 통지 없이 해당 게시물을 수정·이동·임시노출 중단·삭제할 수 있습니다.</p>
                <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                  <li>욕설, 비방, 음란물, 혐오표현 등 사회 통념상 부적절한 내용</li>
                  <li>타인의 저작권·초상권·상표권 등 권리를 침해하거나 명예를 훼손할 우려가 있는 내용</li>
                  <li>국가 법령 또는 공공질서·미풍양속에 위반될 소지가 있는 내용</li>
                  <li>광고·스팸·과도한 반복게시 등 서비스 목적에 부합하지 않는 내용</li>
                  <li>개인정보(실명·연락처·계좌번호·구체적 자산규모 등) 등 식별 가능한 정보를 부적절하게 포함한 경우</li>
                  <li>기타 회사가 운영상 부적절하다고 판단하는 경우</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(긴급조치 및 통지)</h3>
                <p>회사는 관련 법령 위반 또는 제3자의 권리침해 등 즉시 삭제가 필요하다고 판단되는 경우에는 사전 통지 없이 즉시 조치를 취할 수 있습니다. 사후에 조치 사실 및 조치 사유를 게시자에게 통지합니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(이의신청 및 복구 절차)</h3>
                <p>게시물이 삭제 또는 제한된 회원은 회사에 이의신청을 할 수 있으며, 회사는 접수일로부터 합리적인 기간 내에 재검토하여 처리결과를 통지합니다. 회원의 정당한 사유가 인정될 경우 회사는 게시물 복구 또는 조치 변경을 검토합니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(비식별·편집 권한)</h3>
                <p>회사는 교육·홍보·운영 개선 등의 목적을 위해 게시물을 비식별화·편집(요약·문구 수정보완·그래프 재배치 등) 하여 활용할 수 있습니다. 단, 게시물의 핵심 취지 및 성과 수치는 임의로 변경하지 않습니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(로그·보관 및 제공)</h3>
                <p>회사는 운영상 필요한 범위 내에서 게시물의 삭제·수정 내역을 내부 로그로 보관할 수 있으며, 법령상 요구가 있을 경우에는 관계기관에 관련 자료를 제공할 수 있습니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(불명예·차별적 노출 방지)</h3>
                <p>회사는 특정 회원을 대상으로 한 일방적 비판·비하·비교·명예훼손적 방식으로 운영하지 않으며, 공개 기준은 원칙적으로 성과·교육적 가치 중심으로 적용됩니다.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">(면책)</h3>
                <p>회사의 합리적인 운영 판단에 따른 게시물 조치로 인한 회원의 손해에 대하여 회사는 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.</p>
              </div>
            </div>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제11조 (서비스 이용 제한 및 중지)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회사는 회원이 다음 사항을 위반할 경우 서비스 이용을 제한 또는 중지할 수 있습니다.</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>서비스 운영 방해</li>
                <li>법령 위반</li>
                <li>타인의 권리 침해</li>
                <li>금지행위 조항 위반</li>
              </ul>
              <p className="mt-3">이용 제한 시 사전 통지하며, 긴급한 경우 사후 통지할 수 있습니다.</p>
            </div>
          </section>

          {/* 제12조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제12조 (저작권 및 지적재산권)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>서비스 내 모든 콘텐츠(강의, 자료, 이미지, 글 등)의 저작권은 회사 또는 정당한 권리자에게 있습니다.</p>
              <p>회원은 회사의 사전 동의 없이 콘텐츠를 복제, 배포, 판매, 공유, 전재할 수 없습니다.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
                <p className="text-yellow-800 font-medium">
                  특히 TPT에서 제공하는 강의, 강의자료, 매매일지는 저작권물로 적법하게 등록되어 있으며, 무단 사용 시 민·형사상 법적 조치가 이루어질 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제13조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제13조 (개인정보 보호 및 제휴 거래소 정보 조회)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하며, 개인정보 항목, 수집 목적, 보관기간은 개인정보처리방침에 따릅니다.</p>
              <p>회사는 회원의 명시적 동의가 있는 경우에 한하여, 서비스 제공에 필요한 범위에서 제휴 거래소에 계정 사용 여부 또는 거래 진위 확인을 요청할 수 있습니다. 조회 범위는 최소한으로 제한하며, 법령이 허용한 범위를 초과하여 요청하지 않습니다.</p>
              <p>회사는 수집한 개인정보를 법령에서 정한 범위를 넘어 이용하거나 제3자에게 제공하지 않습니다.</p>
            </div>
          </section>

          {/* 제14조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제14조 (회원 탈퇴 및 계약 해지)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원은 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 탈퇴를 처리합니다.</p>
              <p>탈퇴 시 유료서비스는 자동 해지되며, 환불은 환불정책에 따릅니다.</p>
              <p>회원이 약관을 중대하게 위반한 경우 회사는 사전 통지 후 이용계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          {/* 제15조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제15조 (손해배상)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회원이 약관을 위반하여 회사에 손해가 발생한 경우, 회사는 회원에게 손해배상을 청구할 수 있습니다.</p>
              <p>회사가 회원에게 고의 또는 중대한 과실 없이 발생한 손해에 대해 책임을 지지 않습니다.</p>
            </div>
          </section>

          {/* 제16조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제16조 (약관의 변경)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>회사는 약관을 변경할 수 있으며, 변경 시 적용일자 및 사유를 명시하여 최소 7일 전 공지합니다.</p>
              <p>회원이 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</p>
            </div>
          </section>

          {/* 제17조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제17조 (면책조항)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>천재지변, 통신 장애, 서버 오류 등 불가항력적 사유로 인한 서비스 장애에 대해 회사는 책임을 지지 않습니다.</p>
              <p>회원의 과실로 발생한 손해는 회원이 부담합니다.</p>
              <p>회사는 제휴사 장애, 외부 API 오류, 통신사 장애 등 회사의 직접적인 관리 영역 밖에서 발생한 문제에 대하여 책임을 지지 않습니다.</p>
            </div>
          </section>

          {/* 제18조 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제18조 (분쟁 해결)</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>서비스 이용과 관련한 분쟁은 회사와 회원 간 협의로 우선 해결합니다.</p>
              <p>협의가 이루어지지 않을 경우 대한민국 법령을 적용하며, 서울중앙지방법원을 1심 관할법원으로 합니다.</p>
            </div>
          </section>

          {/* 부칙 */}
          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">부칙</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 2025년 12월 9일부터 시행됩니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
