'use client';

import { Footer } from '../../../../Widget/Footer';
import { BookOpen, CheckCircle, Lightbulb, Target } from 'lucide-react';

/**
 * TPT 가이드라인 페이지
 * TPT 서비스를 120% 활용하는 방법을 안내
 */
export default function TPTGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <section className="text-center mb-12 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              TPT 가이드라인
            </h1>
            <p className="text-xl text-gray-600">
              TPT를 120% 활용하는 방법을 알려드립니다
            </p>
          </section>

          {/* 주요 기능 소개 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={28} className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">TPT 핵심 기능</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">매매일지 작성</h3>
                  <p className="text-gray-600">
                    매일 매매 내용을 기록하고 전문 트레이너에게 피드백을 받으세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">1:1 트레이너 멘토링</h3>
                  <p className="text-gray-600">
                    전문 트레이너와 1:1 매칭으로 맞춤형 코칭을 받을 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">커뮤니티 활동</h3>
                  <p className="text-gray-600">
                    다른 트레이더들의 매매일지와 인사이트를 공유하고 배우세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">토큰 시스템</h3>
                  <p className="text-gray-600">
                    토큰을 사용하여 피드백을 요청하고 다양한 혜택을 누리세요.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 활용 팁 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb size={28} className="text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">TPT 120% 활용 팁</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Tip 1: 꾸준한 매매일지 작성</h3>
                <p className="text-gray-600">
                  매일 매매일지를 작성하면 자신의 트레이딩 패턴을 파악하고 개선점을 찾을 수 있습니다.
                  일관성이 성장의 핵심입니다.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Tip 2: 트레이너 피드백 적극 활용</h3>
                <p className="text-gray-600">
                  트레이너의 피드백을 단순히 읽는 것에 그치지 말고, 즉시 실전에 적용해보세요.
                  질문이 있다면 주저하지 말고 물어보세요.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Tip 3: 커뮤니티 활용</h3>
                <p className="text-gray-600">
                  다른 트레이더들의 매매일지와 전략을 보며 새로운 시각을 얻으세요.
                  댓글을 통해 활발하게 소통하세요.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Tip 4: 정기적인 리뷰</h3>
                <p className="text-gray-600">
                  주간, 월간 피드백을 통해 장기적인 성장 방향을 점검하세요.
                  단기 수익보다 장기 성장에 집중하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 시작하기 단계 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target size={28} className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">TPT 시작하기</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">회원가입 및 UID 인증</h3>
                  <p className="text-gray-600">
                    거래소 UID를 등록하여 실제 트레이더임을 인증받으세요.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">레벨 테스트 진행</h3>
                  <p className="text-gray-600">
                    간단한 테스트를 통해 현재 레벨을 파악하고 최적의 트레이너를 매칭받으세요.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">첫 매매일지 작성</h3>
                  <p className="text-gray-600">
                    오늘의 매매 내용을 기록하고 트레이너에게 피드백을 요청하세요.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">꾸준한 성장</h3>
                  <p className="text-gray-600">
                    피드백을 반영하고 꾸준히 학습하며 전문 트레이더로 성장하세요.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="mb-6 text-green-100">
              TPT와 함께 전문 트레이더로 성장해보세요
            </p>
            <a
              href="/my"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              마이페이지로 이동
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
