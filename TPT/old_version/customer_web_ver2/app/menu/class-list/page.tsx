'use client';

import { useEffect, useState } from 'react';
import { Footer } from '../../../Widget/Footer';
import ConsultationModal from '../../../Features/mypage/ConsultationModal';
import { BookOpen, Video, Users, Award, Lock, Play } from 'lucide-react';
import { useAuthStore } from '../../../Shared/store/authStore';

/**
 * All-in-one 강의 페이지
 * TPT의 트레이딩 교육 프로그램 소개
 * Premium 회원에게는 실제 강의 목록 표시
 */
export default function ClassListPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [isPremium, setIsPremium] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.isPremium) {
      setIsPremium(true);
    }
  }, [user]);

  // Premium 회원용 강의 목록 (임시 데이터)
  const premiumClasses = [
    {
      id: 1,
      title: '트레이딩 기초 - 차트 읽기',
      description: '차트의 기본 구조와 캔들스틱 이해하기',
      duration: '45분',
      level: '초급',
      thumbnail: null,
      completed: false,
    },
    {
      id: 2,
      title: '기술적 분석 입문',
      description: '주요 기술적 지표와 패턴 분석',
      duration: '1시간 20분',
      level: '초급',
      thumbnail: null,
      completed: false,
    },
    {
      id: 3,
      title: '리스크 관리의 모든 것',
      description: '손절과 익절, 포지션 사이징 전략',
      duration: '1시간 10분',
      level: '중급',
      thumbnail: null,
      completed: true,
    },
    {
      id: 4,
      title: '스윙 트레이딩 전략',
      description: '중장기 포지션 매매 전략과 실전 적용',
      duration: '1시간 30분',
      level: '중급',
      thumbnail: null,
      completed: false,
    },
    {
      id: 5,
      title: '데이 트레이딩 마스터',
      description: '단기 매매의 핵심 전략과 타이밍',
      duration: '1시간 45분',
      level: '고급',
      thumbnail: null,
      completed: false,
    },
    {
      id: 6,
      title: '스켈핑 고급 테크닉',
      description: '초단타 매매의 실전 노하우',
      duration: '2시간',
      level: '고급',
      thumbnail: null,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <section className="text-center mb-16 mt-12">
            <div className="flex justify-center mb-4">
              <BookOpen size={48} className="text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All-in-one 트레이딩 강의
            </h1>
            <p className="text-xl text-gray-600">
              초보자부터 전문가까지, 모든 레벨에 맞는 체계적인 트레이딩 교육
            </p>
            {isPremium && (
              <div className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded-full">
                ⭐ Premium 회원 전용 강의
              </div>
            )}
          </section>

          {/* Premium 회원 전용 강의 목록 */}
          {isPremium && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">내 강의 목록</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* 썸네일 */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
                      {classItem.completed && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          완료
                        </div>
                      )}
                      <Play size={48} className="text-white opacity-80" />
                    </div>

                    {/* 콘텐츠 */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            classItem.level === '초급'
                              ? 'bg-green-100 text-green-700'
                              : classItem.level === '중급'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {classItem.level}
                        </span>
                        <span className="text-sm text-gray-500">{classItem.duration}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">{classItem.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{classItem.description}</p>

                      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Play size={16} />
                        <span>{classItem.completed ? '다시 보기' : '학습 시작'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 강의 특징 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <Video size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                실전 중심 커리큘럼
              </h3>
              <p className="text-gray-600">
                이론보다 실전! 실제 매매 사례를 중심으로 배우는 실용적인 강의
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <Users size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1:1 전담 트레이너
              </h3>
              <p className="text-gray-600">
                전문 트레이너가 당신의 매매를 직접 분석하고 피드백 제공
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <Award size={40} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                검증된 트레이딩 시스템
              </h3>
              <p className="text-gray-600">
                10억 수익을 달성한 실전 트레이더의 노하우를 모두 전수
              </p>
            </div>
          </section>

          {/* 강의 구성 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              강의 구성
            </h2>
            <div className="space-y-6">
              {/* 기초 과정 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  1. 기초 과정 (1-4주차)
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 차트 읽기와 기본 용어</li>
                  <li>• 기술적 분석 입문</li>
                  <li>• 리스크 관리의 기초</li>
                  <li>• 매매 심리학</li>
                </ul>
              </div>

              {/* 중급 과정 */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  2. 중급 과정 (5-8주차)
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 고급 차트 패턴 분석</li>
                  <li>• 포지션 사이징 전략</li>
                  <li>• 스윙/데이/스켈핑 전략</li>
                  <li>• 실전 매매 시뮬레이션</li>
                </ul>
              </div>

              {/* 실전 과정 */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  3. 실전 과정 (9-12주차)
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 나만의 트레이딩 시스템 구축</li>
                  <li>• 실전 매매와 실시간 피드백</li>
                  <li>• 수익 극대화 전략</li>
                  <li>• 장기 수익 유지 방법</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 수강 혜택 */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm p-8 mb-16 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              수강 혜택
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">평생 강의 무제한 수강</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">전담 트레이너 1:1 코칭</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">매매일지 무제한 피드백</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">실전 트레이딩 커뮤니티 참여</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">월간/주간 시장 분석 리포트</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">레벨테스트 및 인증서 발급</span>
              </div>
            </div>
          </section>

          {/* 수강료 안내 */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              수강료 안내
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 베이직 플랜 */}
              <div className="border border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  베이직 플랜
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  무료
                </div>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li>• 기초 강의 수강</li>
                  <li>• 매매일지 작성</li>
                  <li>• 토큰 시스템 이용</li>
                  <li>• 커뮤니티 참여</li>
                </ul>
                <button className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  무료로 시작하기
                </button>
              </div>

              {/* 프리미엄 플랜 */}
              <div className="border-2 border-blue-600 rounded-lg p-6 relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  추천
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  프리미엄 플랜
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  월 260,000원
                </div>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li>• 전체 강의 무제한 수강</li>
                  <li>• 전담 트레이너 배정</li>
                  <li>• 무제한 피드백</li>
                  <li>• 1:1 화상 상담</li>
                  <li>• 프리미엄 커뮤니티</li>
                </ul>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  프리미엄 시작하기
                </button>
              </div>
            </div>
          </section>

          {/* CTA */}
          {/* <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 트레이딩 교육을 시작하세요
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              체계적인 커리큘럼과 전문 트레이너의 1:1 코칭으로 성공적인 트레이더가 되세요
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              무료로 시작하기
            </a>
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
