import React, { useState, useRef, useLayoutEffect } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";

export const Navigation: React.FC = () => {
  const [active, setActive] = useState("/"); // 현재 활성화된 경로 추적
  const location = useLocation();
  const [activeWidth, setActiveWidth] = useState(0);
  const [activeLeft, setActiveLeft] = useState(0);
  const directionsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const myPageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    switch (active) {
      case "/directions":
        setActiveWidth(directionsRef.current?.offsetWidth || 0);
        setActiveLeft(directionsRef.current?.offsetLeft || 0);
        break;
      case "/":
        setActiveWidth(scheduleRef.current?.offsetWidth || 0);
        setActiveLeft(scheduleRef.current?.offsetLeft || 0);
        break;
      case "/mypage":
        setActiveWidth(myPageRef.current?.offsetWidth || 0);
        setActiveLeft(myPageRef.current?.offsetLeft || 0);
        break;
    }
  }, [active]);

  return (
    <Wrapper>
      <NavItemWrapper ref={directionsRef}>
        <NavItem
          to="/directions"
          active={active === "/directions"}
          onClick={() => setActive("/directions")}
        >
          지도탐색
        </NavItem>
      </NavItemWrapper>
      <NavItemWrapper ref={scheduleRef}>
        <NavItem
          to="/"
          active={active === "/"}
          onClick={() => setActive("/")}
        >
          시간표
        </NavItem>
      </NavItemWrapper>
      <NavItemWrapper ref={myPageRef}>
        <NavItem
          to="/mypage"
          active={active === "/mypage"}
          onClick={() => setActive("/mypage")}
        >
          내정보
        </NavItem>
      </NavItemWrapper>
      <ActiveBackground left={activeLeft} width={activeWidth} />
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  width: 100%;
  height: 60px;
  background-color: #ffe5ec; /* 연한 핑크색 배경 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  position: relative; /* 타원 배경이 버튼 뒤에 오도록 설정 */
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);

`;

const NavItemWrapper = styled.div`
  position: relative;
`;

const NavItem = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${({ active }) => (active ? "#fff" : "#ff66b2")}; /* 활성화 시 흰색, 비활성화 시 진한 핑크 */
  font-size: 16px;
  font-family: "Inter", sans-serif;
  position: relative;
  z-index: 2;
  padding: 10px 20px; /* padding을 추가해 버튼 크기 통일 */
  transition: color 0.3s ease; /* 클릭 시 색상 부드럽게 변화 */
`;

const ActiveBackground = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 50%; /* 수직 중앙 정렬 */
  transform: translateY(-50%);
  left: ${({ left }) => `${left}px`}; /* 텍스트 좌우 중앙에 맞게 위치 */
  width: ${({ width }) => `${width}px`}; /* 타원의 너비는 텍스트 길이*/
  height: 40px;
  background-color: #ff66b2; /* 진한 핑크색 */
  border-radius: 20px; /* 타원 형태 */
  z-index: 1;
  transition: all 0.5s ease; /* 부드럽게 움직이는 애니메이션 */
`;

export default Navigation;
