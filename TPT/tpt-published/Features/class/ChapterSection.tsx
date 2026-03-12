'use client';

import Image from 'next/image';
import LectureCard from './LectureCard';
import LectureAccordion from './LectureAccordion';
import type { ChapterBlock } from '../../Shared/api/services/lectureService';

interface ChapterSectionProps {
  chapters: ChapterBlock[];
  type: 'REGULAR' | 'PRO';
  onLectureClick: (lectureId: number) => void;
  className?: string;
}

/**
 * Chapter 섹션
 * Regular: 기존 카드 그리드 형태
 * Pro: Chapter는 텍스트, 각 강의는 Accordion Toggle 형태
 */
export default function ChapterSection({ chapters, type, onLectureClick, className = '' }: ChapterSectionProps) {
  const isPro = type === 'PRO';
  const badgeImage = isPro ? '/images/type_badge_Pro.svg' : '/images/type_badge_Regular.svg';
  const sectionTitle = isPro ? 'TPT 수석 연구실' : 'TPT 연구실';
  const emptyMessage = isPro
    ? '아직 등록된 Pro 강의가 없습니다.'
    : '아직 등록된 Regular 강의가 없습니다.';

  // PRO 섹션 전체 수강률 계산
  const overallProgress = (() => {
    if (!isPro || chapters.length === 0) return 0;

    const allLectures = chapters.flatMap(ch => ch.lectures);
    if (allLectures.length === 0) return 0;

    const totalProgress = allLectures.reduce((sum, lecture) => {
      return sum + (lecture.progressPercent ?? 0);
    }, 0);

    return Math.round(totalProgress / allLectures.length);
  })();

  return (
    <section className={`${className}`}>
      {/* 섹션 헤더 */}
      <div className="mb-12 md:mb-16">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {sectionTitle}
          </h2>
          <Image
            src={badgeImage}
            alt={type}
            width={80}
            height={32}
            className="object-contain"
          />
        </div>
        <p className={`text-base md:text-lg leading-relaxed max-w-3xl ${
          isPro
            ? 'bg-gradient-to-r from-[#D2C693] to-[#928346] bg-clip-text text-transparent font-medium'
            : 'text-gray-600'
        }`}>
          {isPro
            ? '수 천 번의 백테스팅, 매매일지 노하우를 숨기지 않고 전부 담았습니다.'
            : '단기 성과가 아닌, 올바른 방향의 노력을 믿으세요. 본질에 집중한 과정만이 수익을 이끌 수 있습니다.'}
        </p>

        {/* PRO 섹션: 금색 그라데이션 수강률 게이지바 */}
        {isPro && chapters.length > 0 && (
          <div className="mt-6 w-full">
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#C9A227] rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <span className="text-sm font-medium text-gray-600">
                {overallProgress}%/100%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 강의가 없을 때 */}
      {chapters.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-gray-500 text-base">{emptyMessage}</p>
        </div>
      ) : (
        /* Chapters */
        <div className="space-y-16 md:space-y-20">
        {chapters.map((chapter, index) => (
          <div key={chapter.chapterId}>
            {/* Chapter 타이틀 - Pro일 때는 체크 아이콘 + column 구조 */}
            <div className="">
              {isPro ? (
                <div className="flex items-start gap-3 mb-3">
                  <Image
                    src="/images/icon_check_badge.svg"
                    alt="check"
                    width={40}
                    height={40}
                    className="object-contain flex-shrink-0 mt-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      Chapter {index + 1}.
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      [{chapter.chapterTitle}]
                    </h3>
                  </div>
                </div>
              ) : (
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  {chapter.chapterTitle}
                </h3>
              )}
              {/* {chapter.description && (
                <p className={`text-sm md:text-base text-gray-500 ${isPro ? 'ml-9' : ''}`}>
                  {chapter.description}
                </p>
              )} */}
            </div>

            {/* 강의 목록 - Regular는 그리드, Pro는 Accordion */}
            {isPro ? (
              <div className="space-y-3">
                {chapter.lectures.map((lecture) => (
                  <LectureAccordion
                    key={lecture.lectureId}
                    lecture={lecture}
                    onClick={() => onLectureClick(lecture.lectureId)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                {chapter.lectures.map((lecture) => (
                  <LectureCard
                    key={lecture.lectureId}
                    lecture={lecture}
                    onClick={() => onLectureClick(lecture.lectureId)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </section>
  );
}
