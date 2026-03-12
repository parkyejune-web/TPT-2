'use client';

import Image from 'next/image';

interface SwingDetailData {
  category?: string;
  entryDate?: string;
  exitDate?: string;
  screenshotUrl?: string;
  directionFrame?: string;
  mainFrame?: string;
  subFrame?: string;
  trendAnalysis?: string;
  entryPoint1?: string;
  grade1?: string;
  entryPoint2?: string;
  entryPoint3?: string;
  risk?: number;
  leverage?: number;
  position?: 'LONG' | 'SHORT';
  pl?: number;
  rr?: number;
  tradingReview?: string;
  trainerFeedback?: string;
  selectedWeek?: { month: number; week: number };
}

interface Props {
  data: SwingDetailData;
}

/**
 * 스윙 투자 + 완강 후 프리미엄 회원용 매매일지 조회 컴포넌트
 */
export default function SwingDetailView({ data }: Props) {
  const isProfit = (data.pl ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* 주차 정보 */}
      {data.selectedWeek && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium">
            {data.selectedWeek.month}월 {data.selectedWeek.week}주차 매매일지
          </p>
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>

        <div>
          <label className="text-sm font-medium text-gray-600">종목</label>
          <p className="text-base">{data.category || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">포지션 진입 날짜</label>
            <p className="text-base">{data.entryDate || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">포지션 종료 날짜</label>
            <p className="text-base">{data.exitDate || '-'}</p>
          </div>
        </div>

        {data.screenshotUrl && (
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">스크린샷</label>
            <div className="relative w-full h-64 border rounded-lg overflow-hidden">
              <Image
                src={data.screenshotUrl}
                alt="매매 스크린샷"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </section>

      {/* 프레임 정보 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">프레임 정보</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">디렉션 프레임</label>
            <p className="text-base font-semibold">{data.directionFrame || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">메인 프레임</label>
            <p className="text-base font-semibold">{data.mainFrame || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">서브 프레임</label>
            <p className="text-base font-semibold">{data.subFrame || '-'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">추세 분석</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.trendAnalysis || '작성되지 않음'}
          </div>
        </div>
      </section>

      {/* 진입 타점 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">진입 타점</h3>

        {data.entryPoint1 && (
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">1차 진입 타점</label>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{data.entryPoint1}</span>
              {data.grade1 && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">{data.grade1}</span>
              )}
            </div>
          </div>
        )}

        {data.entryPoint2 && (
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">추가매수 (1)</label>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{data.entryPoint2}</span>
          </div>
        )}

        {data.entryPoint3 && (
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">추가매수 (2)</label>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{data.entryPoint3}</span>
          </div>
        )}
      </section>

      {/* 포지션 및 리스크 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">포지션 및 리스크</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">리스크 테이킹</label>
            <p className="text-base">{data.risk ?? '-'}%</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">레버리지</label>
            <p className="text-base">{data.leverage ?? '-'}배</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">포지션</label>
          <p className={`text-xl font-bold ${
            data.position === 'LONG' ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.position || '-'}
          </p>
        </div>
      </section>

      {/* 손익 정보 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">손익 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">P&L</label>
            <p className={`text-2xl font-bold ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}>
              {isProfit ? '+' : ''}{data.pl ?? 0}%
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">R&R</label>
            <p className="text-2xl font-bold text-blue-600">{data.rr ?? 0}</p>
          </div>
        </div>
      </section>

      {/* 복기 및 피드백 요청 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">복기 및 피드백 요청</h3>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">매매 복기</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.tradingReview || '작성되지 않음'}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">트레이너 피드백 요청 사항</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.trainerFeedback || '작성되지 않음'}
          </div>
        </div>
      </section>
    </div>
  );
}
