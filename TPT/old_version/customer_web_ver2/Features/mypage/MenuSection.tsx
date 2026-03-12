'use client';

import CustomButton from '../../Shared/ui/CustomButton';

interface MenuSectionProps {
  onPasswordChange: () => void;
  onUidClick: () => void;
  onTypeChange: () => void;
  onCustomerServiceClick: () => void;
}

/**
 * 마이페이지 사이드바의 메뉴 섹션
 */
export default function MenuSection({
  onPasswordChange,
  onUidClick,
  onTypeChange,
  onCustomerServiceClick
}: MenuSectionProps) {
  return (
    <div className="flex flex-col gap-2 w-full px-4">
      <CustomButton variant="prettyFull" onClick={onPasswordChange}>
        비밀번호 변경
      </CustomButton>
      <CustomButton variant="prettyFull" onClick={onUidClick}>
        UID 관리
      </CustomButton>
      <CustomButton variant="prettyFull" onClick={onTypeChange}>
        투자유형 변경
      </CustomButton>
      <CustomButton variant="prettyFull" onClick={onCustomerServiceClick}>
        고객센터
      </CustomButton>
    </div>
  );
}
