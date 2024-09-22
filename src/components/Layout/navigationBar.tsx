import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";

export const Navigation: React.FC = () => {
  const location = useLocation(); // 현재 경로를 가져옴
  const [active, setActive] = useState(location.pathname); // 현재 활성화된 경로 추적
  const [activeWidth, setActiveWidth] = useState(0);
  const [activeLeft, setActiveLeft] = useState(0);
  const directionsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const myPageRef = useRef<HTMLDivElement>(null);

  // 페이지가 로드되거나 새로고침될 때 현재 경로에 맞춰 active 설정
  useEffect(() => {
    setActive(location.pathname); // 현재 경로를 active로 설정
  }, [location]);

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
          길찾기
        </NavItem>
      </NavItemWrapper>
      <NavItemWrapper ref={scheduleRef}>
        <NavItem to="/" active={active === "/"} onClick={() => setActive("/")}>
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
  height: 75px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  position: relative;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
`;

const NavItemWrapper = styled.div`
  position: relative;
`;

const NavItem = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${({ active }) => (active ? "#fff" : "#2b2b2b")};
  font-size: 16px;
  font-family: "Inter", sans-serif;
  position: relative;
  z-index: 2;
  padding: 10px 20px;
  transition: color 0.3s ease; /* 클릭 시 색상 부드럽게 변화 */
`;

const ActiveBackground = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 50%; /* 수직 중앙 정렬 */
  transform: translateY(-50%);
  left: ${({ left }) => `${left}px`}; /* 텍스트 좌우 중앙에 맞게 위치 */
  width: ${({ width }) => `${width}px`}; /* 타원의 너비는 텍스트 길이 */
  height: 40px;
  background-color: #52586a;
  border-radius: 20px;
  z-index: 1;
  transition: all 0.5s ease; /* 부드럽게 움직이는 애니메이션 */
`;

export default Navigation;
