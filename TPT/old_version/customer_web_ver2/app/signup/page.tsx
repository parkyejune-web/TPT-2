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
  } = useSignupForm(social);
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <Image src="/images/logo_main.png" alt="logo" width={80} height={80} priority />
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

        <CustomButton variant="prettyFull" onClick={handleSignup} disabled={ui.loading}>
          {ui.loading ? '회원가입 중...' : '회원가입 하기'}
        </CustomButton>

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
