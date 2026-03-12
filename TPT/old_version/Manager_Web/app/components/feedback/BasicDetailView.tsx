'use client';

import Image from 'next/image';

interface BasicDetailData {
  feedbackRequestDate?: string;
  category?: string;
  positionHoldingTime?: string;
  screenshotUrl?: string;
  leverage?: number;
  position?: 'LONG' | 'SHORT';
  operatingFundsRatio?: number;
  entryPrice?: number;
  exitPrice?: number;
  riskTaking?: number;
  settingStopLoss?: number;
  settingTakeProfit?: number;
  pl?: number;
  rr?: number;
  positionStartReason?: string;
  positionEndReason?: string;
  tradingReview?: string;
}

interface Props {
  data: BasicDetailData;
}

/**
 * 무료 회원 또는 완강 전 회원용 매매일지 조회 컴포넌트
 */
export default function BasicDetailView({ data }: Props) {
  const isProfit = (data.pl ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* 기본 정보 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">기록 날짜</label>
            <p className="text-base">{data.feedbackRequestDate || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">종목</label>
            <p className="text-base">{data.category || '-'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">포지션 홀딩 시간</label>
          <p className="text-base">{data.positionHoldingTime || '-'}</p>
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

      {/* 포지션 정보 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">포지션 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">레버리지</label>
            <p className="text-base">{data.leverage ?? '-'}배</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">포지션</label>
            <p className={`text-base font-semibold ${
              data.position === 'LONG' ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.position || '-'}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">비중 (운용 자금 대비)</label>
          <p className="text-base">{data.operatingFundsRatio ?? '-'}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">진입가</label>
            <p className="text-base">{data.entryPrice?.toLocaleString() || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">탈출가</label>
            <p className="text-base">{data.exitPrice?.toLocaleString() || '-'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Risk Taking</label>
          <p className="text-base">{data.riskTaking ?? '-'}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">설정 손절가</label>
            <p className="text-base">{data.settingStopLoss?.toLocaleString() || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">설정 익절가</label>
            <p className="text-base">{data.settingTakeProfit?.toLocaleString() || '-'}</p>
          </div>
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

        {/* 손익 게이지 표시 */}
        {data.pl !== undefined && data.riskTaking && (
          <div className="relative w-full h-16 mt-4">
            <div className="absolute top-1/2 w-full border-t-2 border-gray-300" />
            <div className="flex justify-between text-xs text-gray-500 mt-8">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i}>{-3 + i}</span>
              ))}
            </div>
            <div
              className={`absolute top-0 ${
                (() => {
                  const normalized = data.pl / data.riskTaking;
                  if (normalized <= -2) return 'text-red-500';
                  if (normalized >= 2) return 'text-green-600';
                  return 'text-gray-500';
                })()
              }`}
              style={{
                left: `${(() => {
                  const gaugeMin = -3;
                  const gaugeMax = 3;
                  const normalized = Math.min(
                    Math.max(data.pl / data.riskTaking, gaugeMin),
                    gaugeMax
                  );
                  return ((normalized - gaugeMin) / (gaugeMax - gaugeMin)) * 100;
                })()}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <span className="text-2xl">▼</span>
            </div>
            <span className="absolute left-0 top-0 text-red-500 font-semibold">Fail</span>
            <span className="absolute right-0 top-0 text-green-600 font-semibold">Success</span>
          </div>
        )}
      </section>

      {/* 피드백 참고 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">피드백 참고사항</h3>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">포지션 진입 근거</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.positionStartReason || '작성되지 않음'}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">포지션 탈출 근거</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.positionEndReason || '작성되지 않음'}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">최종 복기</label>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {data.tradingReview || '작성되지 않음'}
          </div>
        </div>
      </section>
    </div>
  );
}
