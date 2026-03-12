'use client';

interface InvestmentTypeSectionProps {
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
}

/**
 * 마이페이지 사이드바의 투자 유형 섹션
 * SWING: 오렌지색
 * DAY: 초록색
 * SCALPING: 파란색
 */
export default function InvestmentTypeSection({ investmentType }: InvestmentTypeSectionProps) {
  const getInvestmentTypeInfo = () => {
    switch (investmentType) {
      case 'SWING':
        return {
          label: '스윙',
          bgColor: 'bg-orange-400',
          textColor: 'text-white',
        };
      case 'DAY':
        return {
          label: '데이',
          bgColor: 'bg-[#2AC287]',
          textColor: 'text-white',
        };
      case 'SCALPING':
        return {
          label: '스켈핑',
          bgColor: 'bg-sky-400',
          textColor: 'text-white',
        };
      default:
        return {
          label: '미설정',
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
        };
    }
  };

  const typeInfo = getInvestmentTypeInfo();

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-sm font-semibold text-gray-700">Investment Type</h3>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 ${typeInfo.bgColor} ${typeInfo.textColor} rounded font-medium text-sm`}>
          {typeInfo.label}
        </span>
      </div>
    </div>
  );
}
