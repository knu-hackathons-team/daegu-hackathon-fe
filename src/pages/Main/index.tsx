/** @jsxImportSource @emotion/react */
import { Contents } from "@/components/MainPage/Contents";
import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const MainPage = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <Contents />
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100vh;
  justify-content: center;
  display: flex;
`;

const InnerWrapper = styled.div`
  width: 100%;
  max-width: 600px;  // 내부 콘텐츠의 최대 너비를 설정하여 일관성 유지
  padding: 20px;
  box-sizing: border-box;
`;
