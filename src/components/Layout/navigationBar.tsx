import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom"; // react-router-dom에서 Link 컴포넌트 가져오기

export const Navigation: React.FC = () => {
  return (
    <Wrapper>
      <Link to="/" style={{ textDecoration: "none" }}>
        <NavButton>
          시간표
        </NavButton>
      </Link>
      <Link to="/mypage" style={{ textDecoration: "none" }}>
        <NavButton>
          내정보
        </NavButton>
      </Link>
      <Link to="/directions" style={{ textDecoration: "none" }}>
        <NavButton>
          지도탐색
        </NavButton>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  width: 100%;
  height: 60px;
  background-color: #dde2ef;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none; // 링크처럼 보여지지 않도록 텍스트 장식을 제거

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default Navigation;
