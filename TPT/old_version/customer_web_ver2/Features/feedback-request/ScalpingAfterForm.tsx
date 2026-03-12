'use client';

import SwingAfterForm from './SwingAfterForm';
import { User } from '../../Shared/store/authStore';

type Props = {
  onSubmit: (data: any) => void;
  currentUser: User;
  riskTaking?: number;
};

/**
 * 스켈핑 투자 + 완강 후 프리미엄 회원용 피드백 요청 폼
 * SwingAfterForm과 구조가 거의 동일하므로 재사용
 */
export default function ScalpingAfterForm(props: Props) {
  return <SwingAfterForm {...props} />;
}
