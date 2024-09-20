import styled from "@emotion/styled";
import { Navigation } from "./navigationBar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <Outlet />
      </InnerWrapper>
      <FixedNavigationContainer>
        <FixedNavigation>
          <Navigation />
        </FixedNavigation>
      </FixedNavigationContainer>
    </Wrapper>
  );
};

// 페이지 전체를 감싸는 래퍼
const Wrapper = styled.div`
  width: 100%;
  position: relative;
  min-height: 100vh; /* 화면 전체를 차지하도록 설정 */
  padding-bottom: 60px; /* Navigation이 가리지 않도록 여백 추가 */
`;

// 콘텐츠를 감싸는 내부 래퍼
const InnerWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: transparent;
`;

// 화면 아래 고정된 Navigation을 감싸는 컨테이너
const FixedNavigationContainer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 1000; /* 필요시 다른 요소보다 위에 있도록 설정 */
`;

// 실제 네비게이션 바
const FixedNavigation = styled.div`
  width: 100%;
  max-width: 600px; /* 중앙 정렬을 위해 최대 너비를 제한 */
`;
