'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, FileText, Upload, File, CheckCircle2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import type { LectureDetailData, AssignmentSubmissionDetailDTO } from '../../Shared/api/services/lectureService';
import { submitAssignment, getMyAssignmentSubmission, updateLectureProgress, getLecturePlayUrl, getLectureAttachmentDownloadUrl } from '../../Shared/api/services/lectureService';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureDetailData | null;
  onProgressUpdate?: (currentSeconds: number) => void;
  onAssignmentSubmitted?: (lectureId: number) => void;
  onPlayError?: (errorCode: string | undefined) => void; // /play API 에러 콜백
}

/**
 * 프리미엄 비디오 플레이어 모달
 * 애플 스타일의 미니멀하고 세련된 디자인
 */
export default function VideoPlayerModal({
  isOpen,
  onClose,
  lecture,
  onProgressUpdate,
  onAssignmentSubmitted,
  onPlayError,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastProgressRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveProgressRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState<AssignmentSubmissionDetailDTO | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [loadingPlayUrl, setLoadingPlayUrl] = useState(false);
  const [playUrlError, setPlayUrlError] = useState<string | null>(null);
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<number | null>(null);

  // 진행도 업데이트 함수 (10초마다 서버에 전송)
  const saveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !lecture) return;

    const currentSeconds = Math.floor(video.currentTime);

    // 변화가 없으면 전송하지 않음
    if (currentSeconds === lastProgressRef.current) return;

    lastProgressRef.current = currentSeconds;

    console.log('[VideoPlayerModal] 진행도 저장 API 호출:', currentSeconds, '초');

    // 서버에 진행도 업데이트
    await updateLectureProgress(lecture.lectureId, currentSeconds);

    // 부모에게 알림
    if (onProgressUpdate) {
      onProgressUpdate(currentSeconds);
    }
  }, [lecture, onProgressUpdate]);

  // saveProgress를 ref에 저장하여 인터벌에서 항상 최신 함수 참조
  useEffect(() => {
    saveProgressRef.current = saveProgress;
  }, [saveProgress]);

  // 비디오 이벤트 핸들러 - playUrl이 설정된 후 비디오가 렌더링되므로 playUrl도 의존성에 포함
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lecture || !playUrl) return;

    console.log('[VideoPlayerModal] 비디오 이벤트 리스너 등록');

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('[VideoPlayerModal] 비디오 재생 시작 - 10초 인터벌 설정');
      // 10초마다 진행도 저장 (ref를 통해 항상 최신 함수 호출)
      if (!progressIntervalRef.current) {
        progressIntervalRef.current = setInterval(() => {
          console.log('[VideoPlayerModal] 인터벌 실행 - saveProgress 호출');
          saveProgressRef.current();
        }, 10000);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('[VideoPlayerModal] 비디오 일시정지 - 인터벌 정리');
      // 일시정지 시 즉시 진행도 저장
      saveProgressRef.current();
      // 인터벌 정리
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      console.log('[VideoPlayerModal] 비디오 종료 - 인터벌 정리');
      saveProgressRef.current();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    // 마지막 시청 위치로 이동
    if (lecture.lastPositionedSeconds && lecture.lastPositionedSeconds > 0) {
      video.currentTime = lecture.lastPositionedSeconds;
    }

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // autoPlay로 이미 재생 중인 경우 인터벌 시작
    if (!video.paused) {
      console.log('[VideoPlayerModal] 이미 재생 중 - 인터벌 시작');
      handlePlay();
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [lecture, playUrl]);

  // ESC 키 핸들러
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        saveProgress(); // 닫기 전 진행도 저장
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, saveProgress]);

  // 모달 열림/닫힘 처리
  useEffect(() => {
    if (isOpen && lecture) {
      document.body.style.overflow = 'hidden';

      // 강의 재생 URL 발급 (3시간 유효)
      fetchPlayUrl(lecture.lectureId);

      // PDF 미리보기 설정
      if (lecture.materials && lecture.materials.length > 0) {
        const firstPdf = lecture.materials.find(m => m.fileType === 'application/pdf');
        if (firstPdf) {
          setSelectedPdfUrl(firstPdf.fileUrl);
        }
      }

      // 과제 제출 정보 조회
      if (lecture.hasAssignment) {
        fetchSubmissionInfo(lecture.lectureId);
      }
    } else {
      document.body.style.overflow = '';
      setSelectedPdfUrl(null);
      setUploadedFile(null);
      setSubmissionInfo(null);
      setPlayUrl(null);
      setPlayUrlError(null);
      lastProgressRef.current = 0;

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, lecture]);

  // 강의 재생 URL 발급
  const fetchPlayUrl = async (lectureId: number) => {
    setLoadingPlayUrl(true);
    setPlayUrlError(null);
    try {
      console.log('[VideoPlayerModal] 재생 URL 발급 요청:', lectureId);
      const response = await getLecturePlayUrl(lectureId);
      if (response.success && response.data && response.data.videoUrl) {
        console.log('[VideoPlayerModal] 재생 URL 발급 성공:', response.data.videoUrl);
        setPlayUrl(response.data.videoUrl);
      } else {
        console.error('[VideoPlayerModal] 재생 URL 발급 실패:', response.message, 'code:', response.code);
        // 에러 코드에 따른 처리 (LECTURE_404_1: 없는 강의, LECTURE_404_4: 미공개 주차)
        if (response.code && onPlayError) {
          onPlayError(response.code);
          onClose(); // 모달 닫기
        } else {
          setPlayUrlError(response.message || '재생 URL을 발급받지 못했습니다.');
        }
      }
    } catch (error) {
      console.error('[VideoPlayerModal] 재생 URL 발급 오류:', error);
      setPlayUrlError('재생 URL 발급 중 오류가 발생했습니다.');
    } finally {
      setLoadingPlayUrl(false);
    }
  };

  // 과제 제출 정보 조회
  const fetchSubmissionInfo = async (lectureId: number) => {
    setLoadingSubmission(true);
    try {
      const response = await getMyAssignmentSubmission(lectureId);
      if (response.success && response.data) {
        setSubmissionInfo(response.data);
      }
    } catch (error) {
      console.error('[VideoPlayerModal] 과제 제출 정보 조회 실패:', error);
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // PDF 파일만 허용
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
      }
      // 10MB 제한
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitAssignment = async () => {
    if (!uploadedFile || !lecture) return;

    setIsSubmitting(true);
    try {
      const response = await submitAssignment(lecture.lectureId, uploadedFile);

      if (response.success) {
        alert('과제가 성공적으로 제출되었습니다.');
        handleFileRemove();
        // 제출 정보 다시 조회
        await fetchSubmissionInfo(lecture.lectureId);
        // 부모 컴포넌트에 과제 제출 성공 알림
        if (onAssignmentSubmitted) {
          onAssignmentSubmitted(lecture.lectureId);
        }
      } else {
        alert(response.message || '과제 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('[VideoPlayerModal] 과제 제출 실패:', error);
      alert('과제 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 첨부파일 다운로드 처리 (Signed URL 발급 후 다운로드)
  const handleAttachmentDownload = async (attachmentId: number, fileName: string) => {
    if (!lecture) return;

    setDownloadingAttachmentId(attachmentId);
    try {
      console.log('[VideoPlayerModal] 첨부파일 다운로드 요청:', { lectureId: lecture.lectureId, attachmentId });
      const response = await getLectureAttachmentDownloadUrl(lecture.lectureId, attachmentId);

      if (response.success && response.data) {
        // 다운로드 URL로 새 창에서 다운로드
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('[VideoPlayerModal] 첨부파일 다운로드 시작');
      } else {
        console.error('[VideoPlayerModal] 첨부파일 다운로드 URL 발급 실패:', response.message);
        alert(response.message || '파일 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('[VideoPlayerModal] 첨부파일 다운로드 오류:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setDownloadingAttachmentId(null);
    }
  };

  // 닫기 핸들러 (진행도 저장 후 닫기)
  const handleClose = async () => {
    await saveProgress();
    onClose();
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType?.includes('pdf')) {
      return <FileText className="w-4 h-4" strokeWidth={2} />;
    }
    return <File className="w-4 h-4" strokeWidth={2} />;
  };

  if (!isOpen || !lecture) return null;

  const hasMaterials = lecture.materials && lecture.materials.length > 0;
  const hasAssignment = lecture.hasAssignment;
  const showSidebar = hasMaterials || hasAssignment;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full min-h-full flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-6 max-w-[1600px] mx-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        {/* 왼쪽: 비디오 플레이어 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-center justify-center">
            {loadingPlayUrl ? (
              <div className="text-center text-white/70">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg">강의를 불러오는 중...</p>
              </div>
            ) : playUrlError ? (
              <div className="text-center text-white/70">
                <p className="text-lg mb-2">비디오를 불러올 수 없습니다</p>
                <p className="text-sm text-white/50">{playUrlError}</p>
                <button
                  onClick={() => lecture && fetchPlayUrl(lecture.lectureId)}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : playUrl ? (
              <video
                ref={videoRef}
                src={playUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full rounded-lg"
                autoPlay
                playsInline
                webkit-playsinline=""
              >
                <track kind="captions" />
              </video>
            ) : (
              <div className="text-center text-white/70">
                <p className="text-lg">비디오를 불러올 수 없습니다</p>
              </div>
            )}
          </div>

          {/* 강의 정보 */}
          <div className="mt-4 md:mt-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              {lecture.title}
            </h2>
            {lecture.content && (
              <p className="text-sm md:text-base text-white/60 line-clamp-2">
                {lecture.content}
              </p>
            )}
          </div>
        </div>

        {/* 오른쪽: 강의 자료 + 과제 제출 */}
        {showSidebar && (
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-4 md:gap-6 overflow-y-auto">
            {/* 강의 자료 섹션 */}
            {hasMaterials && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">강의 자료</h3>
                </div>

                {/* PDF 미리보기 - 첫 번째 PDF 또는 선택된 PDF */}
                {selectedPdfUrl && (
                  <div className="aspect-[3/4] bg-white/5 rounded-lg overflow-hidden border border-white/10 mb-4">
                    <iframe
                      src={selectedPdfUrl}
                      className="w-full h-full"
                      title="강의 자료 미리보기"
                    />
                  </div>
                )}

                {/* 파일 목록 */}
                <div className="space-y-2">
                  {lecture.materials!.map((material) => {
                    const attachmentId = parseInt(material.fileId);
                    const isDownloading = downloadingAttachmentId === attachmentId;

                    return (
                      <div
                        key={material.fileId}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
                      >
                        {/* 파일 아이콘 */}
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                          {getFileIcon(material.fileType)}
                        </div>

                        {/* 파일 정보 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {material.fileName}
                          </p>
                          {material.fileSize && (
                            <p className="text-xs text-white/50">
                              {formatFileSize(material.fileSize)}
                            </p>
                          )}
                        </div>

                        {/* 다운로드 버튼 - API를 통해 Signed URL 발급 후 다운로드 */}
                        <button
                          onClick={() => handleAttachmentDownload(attachmentId, material.fileName)}
                          disabled={isDownloading}
                          className="w-8 h-8 rounded-lg bg-white/0 group-hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-50"
                          title="다운로드"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-4 h-4 text-white/70 animate-spin" strokeWidth={2} />
                          ) : (
                            <Download className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* 자료 정보 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50">
                    강의와 관련된 자료를 다운로드하여 학습에 활용하세요.
                  </p>
                </div>
              </div>
            )}

            {/* 과제 제출 섹션 */}
            {hasAssignment && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">과제 제출</h3>
                </div>

                {/* 로딩 상태 */}
                {loadingSubmission ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : submissionInfo?.submitted && !uploadedFile ? (
                  /* 이미 제출된 과제 정보 표시 (재제출 파일 미선택 상태) */
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium text-green-400">과제 제출 완료</span>
                      </div>
                      <p className="text-xs text-white/60 mb-3">
                        제출일: {new Date(submissionInfo.submittedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <a
                        href={submissionInfo.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        제출한 파일 보기
                      </a>
                    </div>

                    {/* 재제출 안내 */}
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-300">
                        과제를 다시 제출하면 기존 제출 내용이 대체됩니다.
                      </p>
                    </div>

                    {/* 재제출 영역 */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg p-4 text-center cursor-pointer transition-all group"
                    >
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                        클릭하여 다시 제출하기
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 파일 업로드 영역 */
                  <div className="space-y-4">
                    {/* 업로드 버튼 또는 업로드된 파일 */}
                    {!uploadedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg p-6 text-center cursor-pointer transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center mx-auto mb-3 transition-all">
                          <Upload className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" strokeWidth={2} />
                        </div>
                        <p className="text-sm font-medium text-white/90 mb-1">
                          파일을 선택하거나 드래그하세요
                        </p>
                        <p className="text-xs text-white/50">
                          PDF 파일만 가능 (최대 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <File className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-white/50">
                              {formatFileSize(uploadedFile.size)}
                            </p>
                          </div>
                          <button
                            onClick={handleFileRemove}
                            disabled={isSubmitting}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-50"
                          >
                            <X className="w-4 h-4 text-white" strokeWidth={2} />
                          </button>
                        </div>

                        {/* 제출 버튼 */}
                        <button
                          onClick={handleSubmitAssignment}
                          disabled={isSubmitting}
                          className="w-full px-4 py-2.5 bg-white hover:bg-white/90 text-gray-900 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                              과제 제출하기
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* 과제 안내 */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-white/50">
                        강의를 수강한 후 과제를 제출하여 학습을 완료하세요.
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* 자료 없음 + 과제 없음 상태 (이 경우 사이드바가 표시되지 않음) */}
          </div>
        )}
      </div>
    </div>
  );
}
