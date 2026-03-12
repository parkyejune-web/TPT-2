# api 폴더 설명

### endpoints.ts
- 모든 API의 엔드포인트가 정의되어있음
- path parameter 전달이 필요한 경우 ENUM 엔드포인트 주소에 변수로 전달 
- .env의 서버 주소, api version, ENUM을 조합하여 호출받은 값을 return 

### request-types/
- 각 api 마다 요청 형식을 타입으로 정의해두었음.
    - 400 오류가 발생할 경우 이 파일을 확인해보기**

### response-types/
- 각 api 마다 반환 형식을 타입을 정의해두었음.

### apiRequest.ts
- api 요청 시 공통 타입 정의

### apiResponse.ts
- api 반환값에 대해 공통 타입 정의 