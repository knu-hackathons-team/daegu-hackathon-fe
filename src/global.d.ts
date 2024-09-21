// 로그인 컴포넌트에서 Kakao 객체를 TypeScript에서 인식하도록 하기 위해 전역 선언 파일을 추가했음

interface Window {
  Kakao: any;
}

// Directions 컴포넌트에서 사용
interface Window {
  Tmapv2: any;
}