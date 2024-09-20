import { Contents } from "@/components/MainPage/Contents";
import styled from "@emotion/styled";

export const MainPage = () => {
  return (
    <Wrapper>
      <Contents />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
