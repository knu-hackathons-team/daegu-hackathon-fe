import React from 'react';
import styled from '@emotion/styled';


export const Navigation: React.FC = () => {
  return (
    <Wrapper>
      <TextWrapper>
        <Description>
          네비게이션 바입니다. 수정해줭 싫엉<br />
        </Description>
      </TextWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  width: 100%;
  height: 60px;
  padding-top: 25px;
  background-color: #DDE2EF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  text-align: center;
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  color: #1c1c1e;
  margin-bottom: 32px;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.6px;
  letter-spacing: -0.02em;
`;


export default Navigation;