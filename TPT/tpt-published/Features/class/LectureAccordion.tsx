"use client";

import { useState } from "react";
import { Play, FileText, Clock } from "lucide-react";
import Image from "next/image";
import ThumbnailPlaceholder from "../../Shared/ui/ThumbnailPlaceholder";
import type { LectureData } from "../../Shared/api/services/lectureService";

interface LectureAccordionProps {
  lecture: LectureData;
  onClick: () => void;
  className?: string;
}

/**
 * Pro 강의용 Accordion 컴포넌트
 * 고급스러운 Toggle 형태로 강의 정보를 표시
 */
export default function LectureAccordion({ lecture, onClick, className = "" }: LectureAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
    }
    return `${minutes}분`;
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border-b border-gray-200 overflow-hidden transition-all ${className}`}>
      {/* Accordion Header - 항상 보임 */}
      <div
        onClick={toggleAccordion}
        className="flex items-center justify-between p-4 md:p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Toggle 아이콘 - 검정색 삼각형 (90도 -> 열면 180도) */}
          <div
            className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-800"
            >
              <path
                d="M11 6.134a1 1 0 0 1 0 1.732l-9 5.196A1 1 0 0 1 0.5 12.196V1.804A1 1 0 0 1 2 0.938l9 5.196z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* 강의 제목 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              {lecture.title}
            </h3>
            {/* {lecture.content && (
              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                {lecture.content}
              </p>
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {/* 시간 표시 */}
          {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">
              {formatDuration(lecture.durationSeconds)}
            </span>
          </div> */}

          {/* 완료 상태 아이콘 */}
          {/* {lecture.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
          )} */}

          {/* 빨간 삼각형 재생 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
            aria-label="강의 재생"
          >
            <svg
              width="14"
              height="16"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <path
                d="M11 6.134a1 1 0 0 1 0 1.732l-9 5.196A1 1 0 0 1 0.5 12.196V1.804A1 1 0 0 1 2 0.938l9 5.196z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Accordion Body - Toggle 열렸을 때만 보임 */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 md:p-6 pt-0 md:pt-2 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 좌측: 썸네일 및 영상 재생 */}
            <div className="space-y-4">
              {/* 썸네일 */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200 group">
                {lecture.thumbnailUrl ? (
                  <Image
                    src={lecture.thumbnailUrl}
                    alt={lecture.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ThumbnailPlaceholder className="h-full" />
                )}

                {/* 플레이 버튼 오버레이 */}
                <div
                  onClick={onClick}
                  className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-all flex items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transform hover:scale-110 transition-all">
                    <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* 진행률 바 */}
                {lecture.progressPercent !== undefined && lecture.progressPercent > 0 && !lecture.completed && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                    <div
                      className="h-full bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] transition-all"
                      style={{ width: `${lecture.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* 재생 버튼 */}
              {/* <button
                onClick={onClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                강의 시청하기
              </button> */}
            </div>

            {/* 우측: 강의 정보 및 과제 */}
            <div className="space-y-4">
              {/* 강의 설명 */}
              {lecture.content && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">강의 소개</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {lecture.content}
                  </p>
                </div>
              )}

              {/* 강의 정보 */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">강의 정보</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      재생 시간: <span className="font-medium text-gray-900">{formatDuration(lecture.durationSeconds)}</span>
                    </span>
                  </div>
                  {lecture.progressPercent !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border-2 border-gray-400" />
                      </div>
                      <span className="text-gray-600">
                        진행률: <span className="font-medium text-gray-900">{lecture.progressPercent}%</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 학습 자료 */}
              {lecture.materials && lecture.materials.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">학습 자료</h4>
                  <div className="space-y-2">
                    {lecture.materials.map((material) => (
                      <a
                        key={material.fileId}
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-[#B9AB70] transition-colors">
                          <FileText className="w-5 h-5 text-gray-600 group-hover:text-[#B9AB70] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {material.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {material.fileType || 'PDF, 문서 등'}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
