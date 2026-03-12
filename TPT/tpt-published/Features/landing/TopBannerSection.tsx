'use client';

interface TopBannerSectionProps {
  isMobile?: boolean;
}

/**
 * 랜딩 페이지 Top Banner 섹션
 * - 상단: 큰 제목 (Headline)
 * - 하단: 좌측 보조문구 + 세로 구분선 + 우측 문단 텍스트 (Row)
 */
export default function TopBannerSection({ isMobile = false }: TopBannerSectionProps) {
  return (
    <div className="flex flex-col items-center">
      {/* 상단 영역 - Headline */}
      <div className={`${isMobile ? 'mb-4' : 'mb-6 md:mb-8'} text-start w-full`}>
        <h1
          className={`font-bold text-[#111] leading-tight ${
            isMobile ? 'text-[22px]' : 'text-[36px] md:text-[40px]'
          }`}
        >
          여러분들도
          <br />
          이제는 아실겁니다.
        </h1>
      </div>

      {/* 하단 영역 - Row Layout */}
      <div className="flex flex-row items-stretch justify-start w-full">
        {/* 좌측 텍스트 블록 */}
        <div className="flex flex-col justify-center">
          <p
            className={`text-[#9A9999] ${
              isMobile ? 'text-[14px] font-bold' : 'font-bold text-[20px] md:text-[28px]'
            }`}
            style={{ lineHeight: isMobile ? '24px' : '38px' }}
          >
            고수익 리딩방
            <br />
            매매법 강의
            <br />
            시그널 보조지표가
          </p>
        </div>

        {/* 중앙 세로 구분선 */}
        <div
          className={`w-[1px] bg-[#D9D9D9] self-stretch ${
            isMobile ? 'mx-3' : 'mx-6'
          }`}
        />

        {/* 우측 텍스트 블록 */}
        <div className="flex flex-col justify-center">
          <p
            className={`text-[#222] ${
              isMobile ? 'text-[14px]' : 'text-[20px] md:text-[24px]'
            }`}
            style={{ lineHeight: isMobile ? '24px' : '38px' }}
          >
            더 이상 돈을 벌 수 있는
            <br />
            진짜 방법이 아니라는
            <br />
            것을 말이죠.
          </p>
        </div>
      </div>
    </div>
  );
}
