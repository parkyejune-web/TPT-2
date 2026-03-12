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
- Tanstack query 
- TypeScript
- Vercel (실제 도메인 주소를 C-NAME으로 연결하여 관리)

[기타 라이브러리]
Icon: lucid-icon
Table: react-table

[참고사항]
- 사용자 로깅: GA4
- 검색 엔진: Naver 

### 2. 구조
- components : 공통 UI 컴포넌트 모음 폴더
- api : 서버 호출 메소드 모음 폴더
- mocks : mock data 모음 폴더
- types : type, interface 모음 폴더
- store : 전역 상태 관리 폴더
- utils : 각종 메소드 모음 폴더 

### 3. UI 관련 
[components - 공통 UI 컴포넌트]
- Box
- Check box
- Button
- Drop down button
- Fixed modal button 
- Toggle button 
- Notion page button 
- A link  
- Divider
- Input field
- Text area
- Table
- Modal
- Loading
- Skeleton

*특정 페이지에만 사용되는 UI 컴포넌트의 경우 "특정 페이지 폴더 > components 폴더" 로 관리 

[전역 스타일링]
- tailwind.config.ts
- globals.css

모든 UI 컴포넌트는 /designsystem 경로를 직접 입력해서 접속 시 확인 가능합니다. (UI 문서화 용도)
-> 나중에 story book 체제로 개편 가능해보입니다.

### 4. 서버 호출 관련 
- .env
- serverCall.ts



bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.