'use client';

export const dynamic = 'force-dynamic';



import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSignupForm } from '../../Features/signup/useSignupForm';
import SignupForm from '../../Features/signup/SignupForm';
import VerificationModal from '../../Shared/ui/VerificationModal';
import CustomButton from '../../Shared/ui/CustomButton';
import CustomModal from '../../Shared/ui/CustomModal';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const social = searchParams.get('social') || undefined;
  const {
    form,
    updateField,
    updateUid,
    addUid,
    terms,
    setTerms,
    verify,
    ui,
    setUi,
    handlePhoneVerifyStart,
    handlePhoneVerify,
    handleEmailVerifyStart,
    handleEmailVerify,
    handleIdCheck,
    handleSignup,
    isSignupDisabled,
  } = useSignupForm(social);
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <Image src="/images/final_main_logo.svg" alt="logo" width={80} height={80} priority />
        </div>

        <SignupForm
          form={form}
          updateField={updateField}
          updateUid={updateUid}
          addUid={addUid}
          terms={terms}
          setTerms={setTerms}
          verify={verify}
          onPhoneVerify={handlePhoneVerifyStart}
          onEmailVerify={handleEmailVerifyStart}
          onIdCheck={handleIdCheck}
          loading={ui.loading}
        />

        <CustomButton variant="prettyFull" onClick={handleSignup} disabled={ui.loading || isSignupDisabled()}>
          {ui.loading ? '회원가입 중...' : '회원가입 하기'}
        </CustomButton>

        {/* 고객센터 (카카오톡 상담) */}
        <div className="flex justify-center">
          <a
            href="http://pf.kakao.com/_eTxkNn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-yellow-300 text-gray-900 rounded-md transition-colors font-medium w-full"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
            </svg>
            카카오톡 상담
          </a>
        </div>

        <div className="text-center">
          <span className="text-gray-600 text-sm">이미 계정이 있으신가요? </span>
          <CustomButton variant="onlyText" onClick={() => router.push('/login')}>
            로그인
          </CustomButton>
        </div>
      </div>

      {/* 인증 모달 */}
      <VerificationModal
        isOpen={ui.phoneModal}
        onClose={() => setUi((p) => ({ ...p, phoneModal: false }))}
        onVerify={handlePhoneVerify}
        title="전화번호 인증"
        description="전송된 인증코드를 입력해주세요."
        type="phone"
        target={form.phone}
      />
      <VerificationModal
        isOpen={ui.emailModal}
        onClose={() => setUi((p) => ({ ...p, emailModal: false }))}
        onVerify={handleEmailVerify}
        title="이메일 인증"
        description="전송된 인증코드를 입력해주세요."
        type="email"
        target={form.email}
      />

      {/* 에러/성공 모달 */}
      {ui.error && (
        <CustomModal
          isOpen={!!ui.error}
          onClose={() => setUi((p) => ({ ...p, error: '' }))}
          variant={1}
          width="w-xl"
        >
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">알림</h3>
            <p className="text-gray-700 mb-4">{ui.error}</p>
            <CustomButton onClick={() => setUi((p) => ({ ...p, error: '' }))}>확인</CustomButton>
          </div>
        </CustomModal>
      )}

      {ui.success && (
        <CustomModal
          isOpen={ui.success}
          onClose={() => setUi((p) => ({ ...p, success: false }))}
          variant={1}
          width="w-xl"
          className="flex justify-center"
        >
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">회원가입 완료</h3>
            <p className="text-gray-700 mb-4">회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.</p>
            <CustomButton onClick={() => router.push('/login')}>로그인하기</CustomButton>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
