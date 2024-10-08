import { Routes } from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/styles/variants/index";
import styled from "@emotion/styled";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <PageContainer>
        <Wrapper>
          <Routes />
        </Wrapper>
      </PageContainer>
    </ChakraProvider>
  );
};

// 페이지 전체를 감싸는 컨테이너
const PageContainer = styled.div`
  background-color: #D9D9D9; /* 바깥 배경색 변경 */
  width: 100%;
  min-height: 100vh; /* 화면 전체를 채우도록 설정 */
`;

// 가운데 정렬된 콘텐츠를 위한 래퍼
const Wrapper = styled.div`
  width: 100%; /* 모바일에서는 전체 너비 사용 */

  @media (min-width: 768px) {
    /* 태블릿 이상에서는 중앙에 고정 */
    max-width: 600px;
    margin: 0 auto;
    background-color: white; /* 콘텐츠 내부의 배경색 */
  }
`;

export default App;
