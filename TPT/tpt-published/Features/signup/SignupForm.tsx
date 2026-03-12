'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import CustomInputField from '@/Shared/ui/CustomInputField';
import CustomButton from '@/Shared/ui/CustomButton';
import CustomCheckBox from '@/Shared/ui/CustomCheckBox';
import { CustomDropdownButton } from '@/Shared/ui/CustomDropdown';
import InvestmentTypeSelector from './InvestmentTypeSelector';
import UIDGuide from './UIDGuide';
import TermsModal, { TermsType } from './TermsModal';

// 거래소 목록
const EXCHANGE_OPTIONS = ['게이트 거래소'];

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: TermsType }>({
    isOpen: false,
    type: 'terms',
  });

  const openTermsModal = (type: TermsType) => {
    setTermsModal({ isOpen: true, type });
  };

  const closeTermsModal = () => {
    setTermsModal((prev) => ({ ...prev, isOpen: false }));
  };

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
          placeholder="아이디(한글 기재 불가)"
          value={form.id}
          onChange={(v) => updateField('id', v)}
          variant={3}
          buttonLabel={verify.id ? '확인완료' : '중복검사'}
          onButtonClick={onIdCheck}
          disabled={verify.id || loading}
          autoComplete="new-password"
        />
        <div className="flex flex-col">
          <div className="relative">
            <CustomInputField
              placeholder="비밀번호 (8자리 이상)"
              value={form.pw}
              onChange={(v) => updateField('pw', v)}
              variant={2}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.pw && form.pw.length < 8 && (
            <p className="text-red-500 text-xs text-right mt-1">
              비밀번호는 8자리 이상이어야 합니다.
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <CustomInputField
              placeholder="비밀번호 재입력"
              value={form.pw2}
              onChange={(v) => updateField('pw2', v)}
              variant={2}
              type={showPassword2 ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.pw2 && form.pw !== form.pw2 && (
            <p className="text-red-500 text-xs text-right mt-1">
              재입력하신 비밀번호가 다릅니다.
            </p>
          )}
        </div>
        {/* TODO: 임시로 이메일 인증 버튼 숨김 (원복 시 variant={3} + buttonLabel/onButtonClick/disabled 복원) */}
        {/* + <CustomInputField
  +   placeholder="이메일"
  +   value={form.email}
  +   onChange={(v) => updateField('email', v)}
  +   variant={3}
  +   buttonLabel={verify.email ? '인증완료' : '인증하기'}
  +   onButtonClick={onEmailVerify}
  +   disabled={verify.email || loading}
  + /> */}
        <CustomInputField
          placeholder="이메일"
          value={form.email}
          onChange={(v) => updateField('email', v)}
          variant={2}
        />
      </div>

      {/* UID */}
      {/* <div className="mt-4">
        <div className="w-full flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-black">UID 입력</p>
            <a
              href="https://www.gate.com/share/VVJAXF1YVQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded hover:from-[#C2B683] hover:to-[#827336] transition-all"
            >
              UID 발급하기
            </a>
          </div>
          <button
            onClick={() => setUidOpen(true)}
            className="px-3 py-1 text-xs bg-white border-1 border-[#FF0000] rounded hover:bg-gray-50 transition"
          >
            <span className="text-[#FF0000] font-medium">
              필수 안내 사항
            </span>
          </button>
        </div>
        <UIDGuide isOpen={uidOpen} onClose={() => setUidOpen(false)} />
        {form.uids.map((u: any, i: number) => (
          <div key={i} className="flex gap-2 mt-2">
            <div className="flex-1">
              <CustomInputField
                placeholder="선택사항"
                value={u.uid}
                onChange={(v) => updateUid(i, 'uid', v)}
                variant={2}
              />
            </div>
            <div className="flex-1">
              <CustomDropdownButton
                options={EXCHANGE_OPTIONS}
                defaultValue={u.exchange || '거래소 선택'}
                onSelect={(value) => updateUid(i, 'exchange', value)}
              />
            </div>
          </div>
        ))}
      </div> */}

      {/* 투자 유형 선택 섹션 - 2025년 12월 기준 비활성화 (모든 회원 DAY 유형으로 자동 설정)
      <div className="my-4">
        <InvestmentTypeSelector
          value={form.investmentType as any}
          onChange={(v: any) => updateField('investmentType', v)}
        />
      </div>
      */}

      {/* 약관 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-black">
          <CustomCheckBox
            checked={terms.service}
            onChange={(v) => setTerms((p: any) => ({ ...p, service: v }))}
          />
          <button
            type="button"
            onClick={() => openTermsModal('terms')}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            서비스 이용 약관
          </button>
          <span>동의 (필수)</span>
        </div>
        <div className="flex items-center gap-2 text-black">
          <CustomCheckBox
            checked={terms.info}
            onChange={(v) => setTerms((p: any) => ({ ...p, info: v }))}
          />
          <button
            type="button"
            onClick={() => openTermsModal('privacy')}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            개인정보 이용 약관
          </button>
          <span>동의 (필수)</span>
        </div>
        <div className="flex items-center gap-2 text-black">
          <CustomCheckBox
            checked={terms.marketing}
            onChange={(v) => setTerms((p: any) => ({ ...p, marketing: v }))}
          />
          <button
            type="button"
            onClick={() => openTermsModal('marketing')}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            마케팅 정보 수신
          </button>
          <span>동의 (선택)</span>
        </div>
      </div>

      {/* 약관 모달 */}
      <TermsModal
        isOpen={termsModal.isOpen}
        onClose={closeTermsModal}
        type={termsModal.type}
      />
    </>
  );
}
