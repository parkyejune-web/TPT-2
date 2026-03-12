import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 디버그 로그를 파일에 저장하는 함수
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;

  console.log(logMessage);

  // 프로젝트 루트에 nicepay-debug.log 파일로 저장
  try {
    const logPath = path.join(process.cwd(), 'nicepay-debug.log');
    fs.appendFileSync(logPath, logMessage);
  } catch (e) {
    console.error('로그 파일 저장 실패:', e);
  }
}

/**
 * 나이스페이먼츠 모바일 콜백 Route Handler
 *
 * 모바일 환경에서 나이스페이 인증 완료 후 POST form 데이터를 받아
 * URL query string으로 변환하여 클라이언트 페이지로 리다이렉트합니다.
 *
 * Next.js App Router에서 POST body를 클라이언트 컴포넌트에서 직접 읽을 수 없으므로,
 * Route Handler에서 POST 데이터를 파싱하여 query string으로 전달하는 방식을 사용합니다.
 *
 * 흐름:
 * 1. NICEPAY 서버가 POST form 데이터 전송
 * 2. Route Handler에서 form data 파싱
 * 3. 파싱된 데이터를 query string으로 변환
 * 4. /nicepay/callback/result 페이지로 GET 리다이렉트
 * 5. 클라이언트 컴포넌트에서 query string 읽어서 처리
 */
export async function POST(request: NextRequest) {
  debugLog('========== POST 요청 수신 ==========');
  debugLog('POST 전체 URL:', request.url);
  debugLog('POST Headers:', Object.fromEntries(request.headers.entries()));

  try {
    // form data 파싱
    const formData = await request.formData();
    const formEntries = Object.fromEntries(formData.entries());
    debugLog('POST form 전체 데이터:', formEntries);

    // 필요한 필드 추출
    const authResultCode = formData.get('AuthResultCode') as string || '';
    const authResultMsg = formData.get('AuthResultMsg') as string || '';
    const txTid = formData.get('TxTid') as string || '';
    const authToken = formData.get('AuthToken') as string || '';
    const signature = formData.get('Signature') as string || '';
    const mid = formData.get('MID') as string || '';
    const amt = formData.get('Amt') as string || '';

    console.log('[NicePay Route Handler] 파싱된 데이터:', {
      authResultCode,
      authResultMsg,
      txTid: txTid ? txTid.substring(0, 10) + '...' : '',
      authToken: authToken ? authToken.substring(0, 10) + '...' : '',
      mid,
      amt,
    });

    // query string 생성
    const params = new URLSearchParams();
    if (authResultCode) params.set('AuthResultCode', authResultCode);
    if (authResultMsg) params.set('AuthResultMsg', authResultMsg);
    if (txTid) params.set('TxTid', txTid);
    if (authToken) params.set('AuthToken', authToken);
    if (signature) params.set('Signature', signature);
    if (mid) params.set('MID', mid);
    if (amt) params.set('Amt', amt);

    // 클라이언트 페이지로 리다이렉트
    const redirectUrl = `${request.nextUrl.origin}/nicepay/callback/result?${params.toString()}`;

    console.log('[NicePay Route Handler] 리다이렉트 URL:', redirectUrl);

    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error('[NicePay Route Handler] 에러:', error);

    // 에러 시에도 클라이언트 페이지로 리다이렉트 (에러 표시)
    const errorUrl = `${request.nextUrl.origin}/nicepay/callback/result?error=parse_failed`;
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}

/**
 * GET 요청 처리 (직접 접근 시)
 */
export async function GET(request: NextRequest) {
  debugLog('========== GET 요청 수신 ==========');
  debugLog('GET 전체 URL:', request.url);
  debugLog('GET 모든 파라미터:', Object.fromEntries(request.nextUrl.searchParams.entries()));
  debugLog('GET Headers:', Object.fromEntries(request.headers.entries()));

  // query string이 있으면 result 페이지로 전달
  const searchParams = request.nextUrl.searchParams;

  if (searchParams.has('AuthResultCode')) {
    const redirectUrl = `${request.nextUrl.origin}/nicepay/callback/result?${searchParams.toString()}`;
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  // query string이 없으면 마이페이지로 이동
  return NextResponse.redirect(`${request.nextUrl.origin}/my/payment`, { status: 303 });
}
