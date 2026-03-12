'use client';

import { useState } from 'react';
import { Footer } from '../../../Widget/Footer';
import ConsultationModal from '../../../Features/mypage/ConsultationModal';
import { Crown, CheckCircle, Zap, TrendingUp, Users, Star } from 'lucide-react';

/**
 * ETCC 회원권 안내 페이지
 * 프리미엄 회원권 상세 정보
 */
export default function ETCCPage() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <section className="text-center mb-16 mt-12">
            <div className="flex justify-center mb-4">
              <Crown size={64} className="text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ETCC 회원권
            </h1>
            <p className="text-xl text-gray-600">
              Elite Trading Career Club
            </p>
            <p className="text-lg text-gray-500 mt-2">
              트레이딩에 진심인 당신을 위한 프리미엄 멤버십
            </p>
          </section>

          {/* 주요 혜택 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ETCC 회원만의 특별한 혜택
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">무제한 피드백</h3>
                <p className="text-gray-600 leading-relaxed">
                  일일/주간/월간 피드백을 토큰 제한 없이 무제한으로 받을 수 있습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">전담 트레이너</h3>
                <p className="text-gray-600 leading-relaxed">
                  전문 트레이너와 1:1 전담 매칭으로 맞춤형 코칭을 받을 수 있습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 시장 분석</h3>
                <p className="text-gray-600 leading-relaxed">
                  전문가의 실시간 시장 분석과 트레이딩 시그널을 받아볼 수 있습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star size={24} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">프리미엄 콘텐츠</h3>
                <p className="text-gray-600 leading-relaxed">
                  ETCC 회원만을 위한 고급 전략 강의와 인사이트를 제공합니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">비공개 커뮤니티</h3>
                <p className="text-gray-600 leading-relaxed">
                  ETCC 회원들만의 비공개 커뮤니티에서 고급 정보를 교류합니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Crown size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">특별 이벤트 참여</h3>
                <p className="text-gray-600 leading-relaxed">
                  오프라인 세미나, 네트워킹 파티 등 특별 이벤트에 초대됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 요금제 비교 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              요금제 비교
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 베이직 */}
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">베이직</h3>
                <p className="text-gray-600 mb-6">기본 회원</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  무료
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">매매일지 작성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">토큰 시스템 이용</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">커뮤니티 참여</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">기본 칼럼 열람</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <CheckCircle size={20} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>무제한 피드백</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <CheckCircle size={20} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>전담 트레이너</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <CheckCircle size={20} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>프리미엄 콘텐츠</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">
                  현재 플랜
                </button>
              </div>

              {/* ETCC */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-8 border-2 border-yellow-400 relative">
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                  인기
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Crown size={28} className="text-yellow-600" />
                  ETCC
                </h3>
                <p className="text-gray-600 mb-6">프리미엄 회원</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₩260,000</span>
                  <span className="text-gray-600">/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">베이직 플랜 모든 기능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">무제한 피드백</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">전담 트레이너 배정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">실시간 시장 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">프리미엄 콘텐츠</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">비공개 커뮤니티</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">특별 이벤트 초대</span>
                  </li>
                </ul>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition"
                >
                  ETCC 가입하기
                </button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. ETCC 회원권은 언제든 해지할 수 있나요?</h3>
                <p className="text-gray-600">
                  A. 네, 언제든지 해지 가능하며 위약금은 없습니다. 해지 시 다음 결제일부터 적용됩니다.
                </p>
              </div>
              {/* <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. 환불이 가능한가요?</h3>
                <p className="text-gray-600">
                  A. 서비스 이용 후 7일 이내에 환불 요청 시 전액 환불 가능합니다.
                </p>
              </div> */}
              <div className="border-b pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Q. 트레이너는 직접 선택할 수 있나요?</h3>
                <p className="text-gray-600">
                  A. 레벨 테스트 결과를 바탕으로 최적의 트레이너를 매칭해드립니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Q. 베이직에서 ETCC로 업그레이드하면 기존 데이터는?</h3>
                <p className="text-gray-600">
                  A. 모든 데이터가 그대로 유지되며, 즉시 ETCC 혜택을 누리실 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          {/* <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-8 md:p-12 text-center text-white">
            <div className="flex justify-center mb-4">
              <Crown size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              지금 ETCC 회원이 되어보세요
            </h2>
            <p className="text-lg mb-8 text-yellow-100">
              트레이딩에 진심인 당신을 위한 프리미엄 멤버십
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                ETCC 가입하기
              </a>
              <a
                href="/support"
                className="px-8 py-3 bg-yellow-700 text-white rounded-lg font-bold hover:bg-yellow-800 transition"
              >
                문의하기
              </a>
            </div>
          </section> */}
        </div>
      </main>

      <Footer />

      {/* 전화상담 예약 모달 */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </div>
  );
}
