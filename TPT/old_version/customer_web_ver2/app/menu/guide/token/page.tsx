'use client';

import { Footer } from '../../../../Widget/Footer';
import { Coins, Gift, TrendingUp, Info } from 'lucide-react';

/**
 * 토큰 제도 가이드라인 페이지
 * 무료 피드백 요청 방법 및 토큰 시스템 안내
 */
export default function TokenGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <section className="text-center mb-12 mt-12">
            <div className="flex justify-center mb-4">
              <Coins size={48} className="text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              토큰 제도 가이드라인
            </h1>
            <p className="text-xl text-gray-600">
              토큰을 활용하여 무료로 피드백을 받아보세요
            </p>
          </section>

          {/* 토큰이란? */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Info size={28} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">토큰이란?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              TPT 토큰은 전문 트레이너에게 피드백을 요청할 때 사용하는 포인트입니다.
              토큰을 사용하면 프리미엄 서비스를 무료로 이용할 수 있습니다.
            </p>
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>💡 Tip:</strong> 토큰은 다양한 활동을 통해 무료로 획득할 수 있습니다!
              </p>
            </div> */}
          </section>

          {/* 토큰 획득 방법 */}
          {/* <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Gift size={28} className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">토큰 획득 방법</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">회원가입 보너스</h3>
                  <p className="text-gray-600">
                    TPT에 처음 가입하시면 <strong className="text-green-600">5개의 토큰</strong>을 드립니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">매매일지 작성</h3>
                  <p className="text-gray-600">
                    매매일지를 작성할 때마다 <strong className="text-blue-600">1개의 토큰</strong>을 획득합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">커뮤니티 활동</h3>
                  <p className="text-gray-600">
                    댓글 작성, 좋아요 등 활발한 커뮤니티 활동으로 <strong className="text-purple-600">토큰을 적립</strong>하세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">이벤트 참여</h3>
                  <p className="text-gray-600">
                    TPT에서 진행하는 다양한 이벤트에 참여하여 <strong className="text-yellow-600">보너스 토큰</strong>을 받으세요.
                  </p>
                </div>
              </div>
            </div>
          </section> */}

          {/* 토큰 사용 방법 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={28} className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">토큰 사용 방법</h2>
            </div>
            {/* <div className="space-y-6"> */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">일일 피드백 요청 (1 토큰)</h3>
                <p className="text-gray-600">
                  오늘 작성한 매매일지에 대해 트레이너의 즉각적인 피드백을 받을 수 있습니다.
                </p>
              </div>
              {/* <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">주간 피드백 요청 (5 토큰)</h3>
                <p className="text-gray-600">
                  이번 주 전체 매매를 종합적으로 분석하고 다음 주 전략을 세울 수 있습니다.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">월간 피드백 요청 (10 토큰)</h3>
                <p className="text-gray-600">
                  한 달간의 트레이딩을 심층 분석하고 장기 전략을 수립할 수 있습니다.
                </p>
              </div>
            </div> */}
          </section>

          {/* 토큰 사용 팁 */}
          {/* <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-sm p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 토큰 절약 팁</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>매일 매매일지를 작성하여 토큰을 꾸준히 모으세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>중요한 매매에만 피드백을 요청하여 효율적으로 사용하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>커뮤니티 활동을 통해 다른 회원들의 피드백도 참고하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>정기 이벤트를 놓치지 말고 보너스 토큰을 챙기세요</span>
              </li>
            </ul>
          </section> */}

          {/* FAQ */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. 토큰에 유효기간이 있나요?</h3>
                <p className="text-gray-600">
                  A. 아니요, 토큰은 유효기간 없이 언제든지 사용 가능합니다.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. 토큰을 다른 회원에게 양도할 수 있나요?</h3>
                <p className="text-gray-600">
                  A. 토큰은 개인 계정에 귀속되며 타인에게 양도할 수 없습니다.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. 토큰을 현금으로 환전할 수 있나요?</h3>
                <p className="text-gray-600">
                  A. 토큰은 TPT 서비스 내에서만 사용 가능하며 현금 환전은 불가능합니다.
                </p>
              </div>
              {/* <div>
                <h3 className="font-bold text-gray-900 mb-2">Q. 프리미엄 회원도 토큰을 사용하나요?</h3>
                <p className="text-gray-600">
                  A. 프리미엄 회원은 기본 피드백이 무제한이지만, 추가 서비스에 토큰을 사용할 수 있습니다.
                </p>
              </div> */}
            </div>
          </section>

          {/* CTA */}
          {/* <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">지금 바로 토큰을 모아보세요</h2>
            <p className="mb-6 text-yellow-100">
              매매일지를 작성하고 토큰을 획득하세요
            </p>
            <a
              href="/my/feedback-request"
              className="inline-block px-8 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              피드백 요청하기
            </a>
          </section> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
