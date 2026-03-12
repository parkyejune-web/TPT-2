'use client';

import React from 'react';

type InvestmentType = '스윙' | '데이' | '스켈핑';

interface InvestmentTypeSelectorProps {
  value?: InvestmentType | '';
  onChange: (v: InvestmentType) => void;
}

const options: InvestmentType[] = ['스윙', '데이', '스켈핑'];

/**
 * 투자 유형 선택 컴포넌트
 */
export default function InvestmentTypeSelector({ value, onChange }: InvestmentTypeSelectorProps) {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm text-gray-700">나의 투자 유형 선택</p>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={[
                'w-full rounded-md px-6 py-3 text-sm font-medium border-1 transition cursor-pointer',
                selected
                  ? opt === '스윙'
                    ? 'bg-amber-400 text-white border-amber-400'
                    : opt === '데이'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-blue-500 text-white border-blue-500'
                  : opt === '스윙'
                    ? 'border-amber-400 text-gray-800'
                    : opt === '데이'
                      ? 'border-emerald-500 text-gray-800'
                      : 'border-blue-400 text-gray-800',
                'focus:outline-none focus:ring-0',
              ].join(' ')}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
