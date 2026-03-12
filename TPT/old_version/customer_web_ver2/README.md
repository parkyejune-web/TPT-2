# TPT (Trading PT)
## Trading-PT

### 0. 실행 명령어
```
yarn dev
```

### 1. 기술
- NextJS
- Tailwind Css
- Zustand 
- TypeScript
- Vercel (실제 도메인 주소를 C-NAME으로 연결하여 관리)

[기타 라이브러리]
Icon: lucid-icon

[참고사항]
- 사용자 로깅: GA4
- 검색 엔진: Naver 
- 결제(카드사): NicePayments

### 2. 구조
**FSD 구조**
- Segments (하나의 도메인) 내부에서 model, api, ui 분리
- shared/models 에 Slices (프로젝트를 구성하는 모든 도메인 묶음, Types) 정의 
- ui 단위 크기 순서: shared/ui >> features >> widget 


bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.