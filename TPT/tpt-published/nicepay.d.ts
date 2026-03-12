/**
 * NicePay SDK 전역 타입 선언
 * nicepay-pgweb.js SDK에서 제공하는 전역 함수들의 타입을 정의합니다.
 */

declare global {
  /**
   * NicePay 결제창을 호출하는 함수
   * @param form 결제 정보가 담긴 HTMLFormElement
   */
  function goPay(form: HTMLFormElement): void;

  /**
   * NicePay 결제 성공 시 SDK가 호출하는 콜백 함수
   * 개발자가 직접 구현하여 window 객체에 등록해야 함
   */
  function nicepaySubmit(): void;

  /**
   * NicePay 결제창 닫힘 시 SDK가 호출하는 콜백 함수
   * 개발자가 직접 구현하여 window 객체에 등록해야 함
   */
  function nicepayClose(): void;
}

export {};
