'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../Shared/hooks/useAuth';
import { authService } from '../../Shared/api/services';

const investmentTypeMap: Record<string, string> = {
  데이: 'DAY',
  스켈핑: 'SCALPING',
  스윙: 'SWING',
};

/**
 * 회원가입 폼 로직을 관리하는 커스텀 훅
 */
export const useSignupForm = (social?: string) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const { signup } = useAuth();

  // 상태 정의
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    id: '',
    pw: '',
    pw2: '',
    investmentType: '',
    uids: [{ uid: '', exchange: '' }],
  });

  const [terms, setTerms] = useState({
    service: false,
    info: false,
    marketing: false,
  });

  const [verify, setVerify] = useState({
    phone: false,
    id: false,
    email: false,
  });

  const [ui, setUi] = useState({
    loading: false,
    error: '',
    success: false,
    phoneModal: false,
    emailModal: false,
  });

  // Form 유틸
  const updateField = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateUid = (index: number, key: 'uid' | 'exchange', value: string) => {
    const newUids = [...form.uids];
    newUids[index][key] = value;
    setForm((prev) => ({ ...prev, uids: newUids }));
  };

  const addUid = () => {
    if (form.uids.length < 5)
      setForm((prev) => ({ ...prev, uids: [...prev.uids, { uid: '', exchange: '' }] }));
  };

  // 인증 관련
  const handlePhoneVerifyStart = async () => {
    if (!form.phone) {
      setUi({ ...ui, error: '전화번호를 입력해주세요.' });
      return;
    }
    setUi({ ...ui, loading: true });
    const res = await authService.sendPhoneCode({ phoneNumber: form.phone });
    setUi({ ...ui, loading: false, phoneModal: res.success });
  };

  const handlePhoneVerify = async (code: string) => {
    const res = await authService.verifyPhoneCode({ phoneNumber: form.phone, code });
    if (res.success) setVerify((p) => ({ ...p, phone: true }));
    return res.success;
  };

  const handleEmailVerifyStart = async () => {
    if (!form.email) {
      setUi({ ...ui, error: '이메일을 입력해주세요.' });
      return;
    }
    setUi({ ...ui, loading: true });
    const res = await authService.sendEmailCode({ email: form.email });
    setUi({ ...ui, loading: false, emailModal: res.success });
  };

  const handleEmailVerify = async (code: string) => {
    const res = await authService.verifyEmailCode({ email: form.email, code });
    if (res.success) setVerify((p) => ({ ...p, email: true }));
    return res.success;
  };

  const handleIdCheck = async () => {
    if (!form.id) {
      setUi({ ...ui, error: '아이디를 입력해주세요.' });
      return;
    }
    const res = await authService.checkUsernameAvailable(form.id);
    if (res.success && res.data) {
      setVerify((p) => ({ ...p, id: true }));
      setUi({ ...ui, error: '' });
    } else {
      setUi({ ...ui, error: res.error || '아이디 중복 확인 실패' });
    }
  };

  // 소셜로그인 시 자동세팅
  useEffect(() => {
    if (social === 'true') {
      authService
        .getSocialInfo()
        .then((data) => {
          const res = data?.data;
          if (!res) return;
          setForm((prev) => ({
            ...prev,
            name: res.name || prev.name,
            email: res.email || prev.email,
            pw: res.passwordHash || '',
            pw2: res.passwordHash || '',
          }));
          setVerify((v) => ({ ...v, email: true }));
        })
        .catch((err) => console.error('소셜 정보 조회 오류:', err));
    }
  }, [social]);

  // 최종 회원가입
  const handleSignup = async () => {
    const { name, phone, email, id, pw, pw2, investmentType, uids } = form;
    const valid =
      name &&
      phone &&
      email &&
      id &&
      pw &&
      pw2 &&
      pw === pw2 &&
      verify.phone &&
      verify.id &&
      verify.email &&
      terms.service &&
      terms.info;

    if (!valid) {
      setUi({ ...ui, error: '모든 필수 항목을 완료해주세요.' });
      return;
    }

    if (pw !== pw2) {
      setUi({ ...ui, error: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setUi({ ...ui, loading: true });

    const signupData = {
      name,
      phone,
      email,
      username: id,
      password: pw,
      passwordCheck: pw2,
      termsService: terms.service,
      termsPrivacy: terms.info,
      termsMarketing: terms.marketing,
      investmentType: investmentTypeMap[investmentType] as any,
      uids: uids
        .filter((u) => u.uid && u.exchange)
        .map((u) => ({
          exchangeName: u.exchange,
          uid: u.uid,
        })),
    };

    const result = await signup(signupData);

    if (result.success) {
      // 회원가입 성공 시 성공 모달 표시 (라우팅은 모달에서 처리)
      setUi({ ...ui, loading: false, success: true });
    } else {
      setUi({ ...ui, loading: false, error: result.error || '회원가입 실패' });
    }
  };

  return {
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
  };
};
