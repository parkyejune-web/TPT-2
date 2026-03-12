import Image from 'next/image';

interface ThumbnailPlaceholderProps {
  className?: string;
}

/**
 * 썸네일 placeholder 컴포넌트
 * 흰 배경에 final_logo_blue.png 로고 표시
 */
export default function ThumbnailPlaceholder({ className = '' }: ThumbnailPlaceholderProps) {
  return (
    <div className={`bg-white flex items-center justify-center ${className}`}>
      <Image
        src="/images/final_logo_blue.png"
        alt="TPT Logo"
        width={120}
        height={120}
        className="opacity-30"
      />
    </div>
  );
}
