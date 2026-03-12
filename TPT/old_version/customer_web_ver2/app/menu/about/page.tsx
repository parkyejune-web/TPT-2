'use client';

import { Footer } from '../../../Widget/Footer';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

/**
 * About TPT 페이지
 * TPT 서비스 소개 페이지
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <section className="text-center mb-16 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About TPT
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              TPT는 Trading Professional Training의 약자로,
              트레이딩의 본질을 전달하고 전문 트레이더를 양성하는 교육 플랫폼입니다.
            </p>
          </section>

          {/* 미션 & 비전 */}
          <section className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              우리의 미션
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={24} className="text-green-600" />
                  미션
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  모든 트레이더가 올바른 방향으로 성장할 수 있도록
                  체계적인 교육과 1:1 전문 트레이너의 멘토링을 제공합니다.
                </p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={24} className="text-blue-600" />
                  비전
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  단기적인 수익이 아닌, 장기적으로 성장하는 전문 트레이더를
                  양성하여 건강한 트레이딩 생태계를 만듭니다.
                </p>
              </div>
            </div>
          </section>

          {/* TPT의 특징 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              TPT만의 특별함
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  전문 트레이너 매칭
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  회원님의 투자 성향과 레벨에 맞춰 최적의 전문 트레이너를 1:1로 매칭해드립니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  실시간 피드백
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  매매일지 작성 후 전문 트레이너로부터 일일/주간/월간 피드백을 받을 수 있습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  체계적인 커리큘럼
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  기초부터 고급까지 단계별로 구성된 커리큘럼으로 체계적인 학습이 가능합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 프로세스 섹션 */}
          <section className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              TPT 이용 프로세스
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">회원가입 및 UID 등록</h3>
                  <p className="text-gray-600">
                    TPT에 가입하고 거래소 UID를 등록하여 인증을 받습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">레벨 테스트</h3>
                  <p className="text-gray-600">
                    간단한 레벨 테스트를 통해 현재 트레이딩 수준을 파악합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">트레이너 매칭</h3>
                  <p className="text-gray-600">
                    레벨 테스트 결과를 바탕으로 최적의 전문 트레이너를 매칭해드립니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">본격 학습 시작</h3>
                  <p className="text-gray-600">
                    매매일지를 작성하고 트레이너의 피드백을 받으며 성장해나갑니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA 섹션 */}
          <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 TPT와 함께 시작하세요
            </h2>
            <p className="text-lg mb-8 text-green-100">
              전문 트레이더로 성장하는 첫 걸음을 내딛어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                무료 회원가입
              </a>
              <a
                href="/home"
                className="px-8 py-3 bg-green-800 text-white rounded-lg font-bold hover:bg-green-900 transition"
              >
                둘러보기
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
