'use client';

import { useState } from 'react';
import CustomInputField from '@/Shared/ui/CustomInputField';
import CustomButton from '@/Shared/ui/CustomButton';
import CustomCheckBox from '@/Shared/ui/CustomCheckBox';
import CustomLink from '@/Shared/ui/CustomLink';
import InvestmentTypeSelector from './InvestmentTypeSelector';
import UIDGuide from './UIDGuide';

interface SignupFormProps {
  form: {
    name: string;
    phone: string;
    email: string;
    id: string;
    pw: string;
    pw2: string;
    investmentType: string;
    uids: Array<{ uid: string; exchange: string }>;
  };
  updateField: (key: keyof SignupFormProps['form'], value: any) => void;
  updateUid: (index: number, key: 'uid' | 'exchange', value: string) => void;
  addUid: () => void;
  terms: {
    service: boolean;
    info: boolean;
    marketing: boolean;
  };
  setTerms: (terms: any) => void;
  verify: {
    phone: boolean;
    id: boolean;
    email: boolean;
  };
  onIdCheck: () => void;
  onPhoneVerify: () => void;
  onEmailVerify: () => void;
  loading: boolean;
}

/**
 * 회원가입 폼 컴포넌트
 */
export default function SignupForm({
  form,
  updateField,
  updateUid,
  addUid,
  terms,
  setTerms,
  verify,
  onIdCheck,
  onPhoneVerify,
  onEmailVerify,
  loading,
}: SignupFormProps) {
  const [uidOpen, setUidOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <CustomInputField
          placeholder="이름"
          value={form.name}
          onChange={(v) => updateField('name', v)}
          variant={2}
        />
        <CustomInputField
          placeholder="전화번호"
          value={form.phone}
          onChange={(v) => updateField('phone', v)}
          variant={3}
          buttonLabel={verify.phone ? '인증완료' : '인증하기'}
          onButtonClick={onPhoneVerify}
          disabled={verify.phone || loading}
        />
        <CustomInputField
          placeholder="아이디"
          value={form.id}
          onChange={(v) => updateField('id', v)}
          variant={3}
          buttonLabel={verify.id ? '확인완료' : '중복검사'}
          onButtonClick={onIdCheck}
          disabled={verify.id || loading}
          autoComplete="new-password"
        />
        <CustomInputField
          placeholder="비밀번호"
          value={form.pw}
          onChange={(v) => updateField('pw', v)}
          variant={2}
          type="password"
          autoComplete="new-password"
        />
        <CustomInputField
          placeholder="비밀번호 재입력"
          value={form.pw2}
          onChange={(v) => updateField('pw2', v)}
          variant={2}
          type="password"
          autoComplete="new-password"
        />
        <CustomInputField
          placeholder="이메일"
          value={form.email}
          onChange={(v) => updateField('email', v)}
          variant={3}
          buttonLabel={verify.email ? '인증완료' : '인증하기'}
          onButtonClick={onEmailVerify}
          disabled={verify.email || loading}
        />
      </div>

      {/* UID */}
      <div className="mt-4">
        <div className="w-full flex justify-start items-center gap-2">
          <p>UID 입력</p>
          <CustomButton
            variant="normalClean"
            padding="p-1"
            textSize="text-xs"
            textColor="text-gray-500"
            border="border-gray-300"
            onClick={() => setUidOpen(true)}
          >
            UID가 궁금해요
          </CustomButton>
        </div>
        <UIDGuide isOpen={uidOpen} onClose={() => setUidOpen(false)} />
        {form.uids.map((u: any, i: number) => (
          <div key={i} className="flex gap-2 mt-2">
            <CustomInputField
              placeholder="UID"
              value={u.uid}
              onChange={(v) => updateUid(i, 'uid', v)}
              variant={2}
            />
            <CustomInputField
              placeholder="거래소명"
              value={u.exchange}
              onChange={(v) => updateUid(i, 'exchange', v)}
              variant={2}
            />
          </div>
        ))}
      </div>

      <div className="my-4">
        <InvestmentTypeSelector
          value={form.investmentType as any}
          onChange={(v: any) => updateField('investmentType', v)}
        />
      </div>

      {/* 약관 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CustomCheckBox
            checked={terms.service}
            onChange={(v) => setTerms((p: any) => ({ ...p, service: v }))}
          />
          <CustomLink href="/signup/servicerule">서비스 이용 약관</CustomLink> 동의 (필수)
        </div>
        <div className="flex items-center gap-2">
          <CustomCheckBox
            checked={terms.info}
            onChange={(v) => setTerms((p: any) => ({ ...p, info: v }))}
          />
          <CustomLink href="/signup/myinforule">개인정보 이용 약관</CustomLink> 동의 (필수)
        </div>
        <div className="flex items-center gap-2">
          <CustomCheckBox
            checked={terms.marketing}
            onChange={(v) => setTerms((p: any) => ({ ...p, marketing: v }))}
          />
          <p>마케팅 정보 수신 동의 (선택)</p>
        </div>
      </div>
    </>
  );
}
