import { useState, useEffect } from "react";
import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import styled from "@emotion/styled";
import axios from "axios";

const Mypage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인을 위한 state
  const [name, setName] = useState("사용자 이름"); // 서버에서 받아온 닉네임
  const [email, setEmail] = useState("user@example.com");
  const [newName, setNewName] = useState(""); // 새로운 닉네임
  const [speed, setSpeed] = useState(localStorage.getItem("speed") || "1.5"); // 속도 상태 저장

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 (리다이렉트 방식)
    console.log("카카오 로그인 버튼 클릭");
    window.location.href = "https://giftshop-kakao.shop/api/auth/oauth/kakao";
  };

  useEffect(() => {
    console.log("useEffect 호출: 토큰 확인 중...");
    // 카카오 토큰 확인 및 서버에서 유저 정보 불러오기
    const kakaoToken = localStorage.getItem("kakaoToken");
    if (kakaoToken) {
      console.log("카카오 토큰이 있습니다:", kakaoToken);
      setIsLoggedIn(true); // 로그인 상태로 변경
      getUserInfo(kakaoToken); // 서버에서 유저 정보 불러오기
    } else {
      console.log("카카오 토큰이 없습니다. 로그인이 필요합니다.");
      setIsLoggedIn(false);
    }
  }, []);

  const getUserInfo = async (token: string) => {
    console.log("getUserInfo 호출: 유저 정보 불러오는 중...");
    try {
      // 서버에서 유저 정보를 가져오는 API 호출
      const response = await axios.get(
        "https://giftshop-kakao.shop/api/member/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const userData = response.data;
        console.log("유저 정보 가져오기 성공:", userData);

        localStorage.setItem("nickname", userData.nickName);

        setName(userData.nickName); // 서버에서 받아온 닉네임 설정
        setEmail(userData.email); // 서버에서 받아온 이메일 설정
      }
    } catch (error) {
      console.error("유저 정보 불러오기 중 오류 발생:", error);
    }
  };

  const handleNicknameChange = async () => {
    const jwtToken = localStorage.getItem("jwtToken"); // 로그인할 때 받은 JWT 토큰
    console.log("닉네임 변경 시도:", newName);

    if (!newName) {
      alert("변경할 닉네임을 입력하세요.");
      console.log("닉네임 입력값이 비어 있습니다.");
      return;
    }

    try {
      // JWT 토큰을 Authorization 헤더에 포함하여 서버에 PATCH 요청
      const response = await axios.patch(
        `https://giftshop-kakao.shop/api/member/nickname`,
        null,
        {
          params: { nickname: newName },
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
          },
        }
      );

      if (response.status === 200) {
        console.log("닉네임 변경 성공:", newName);
        setName(newName);
        alert("닉네임이 성공적으로 변경되었습니다.");
      } else {
        console.log("닉네임 변경 실패:", response);
        alert("닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류 발생:", error);
    }
  };

  const handleLogout = () => {
    console.log("로그아웃 처리 중...");

    // 로컬 스토리지에서 jwtToken 삭제
    localStorage.removeItem("jwtToken");
    console.log("로컬 스토리지에서 jwtToken 삭제 완료");

    // 쿠키 삭제
    clearCookies();
    console.log("쿠키 삭제 완료");

    // 로그인 상태 해제
    setIsLoggedIn(false);
    console.log("로그아웃 완료: 로그인 상태 해제");

    alert("로그아웃 되었습니다. 다른 계정으로 로그인할 수 있습니다.");
  };

  // 쿠키 삭제 함수
  const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log("모든 쿠키 삭제 완료");
  };

  // 속도 버튼 클릭 시 속도를 로컬 스토리지에 저장
  const handleSpeedChange = (newSpeed: string) => {
    setSpeed(newSpeed);
    localStorage.setItem("speed", newSpeed);
  };

  // 로그인되지 않은 경우 로그인 화면을 보여줌
  if (!isLoggedIn) {
    console.log("로그인 화면 표시 중...");
    return (
      <Wrapper>
        <VStack spacing={5} p={5}>
          <Text fontSize="2xl">로그인 하여 이용하시겠습니까?</Text>
          <StyledKakaoButton onClick={handleKakaoLogin}>
            카카오 로그인
          </StyledKakaoButton>
        </VStack>
      </Wrapper>
    );
  }

  // 로그인된 경우 마이페이지 화면을 보여줌
  console.log("로그인된 상태로 마이페이지 화면 표시 중...");
  return (
    <Wrapper>
      <VStack spacing={5} p={5}>
        <Text fontSize="2xl">마이페이지</Text>
        {/* 속도 선택 버튼들 */}
        <Text fontSize="xl">속도 선택</Text>
        <Box display="flex" gap="10px">
          <Button
            colorScheme={speed === "2.0" ? "blue" : "gray"}
            onClick={() => handleSpeedChange("2.0")}
          >
            느림
          </Button>
          <Button
            colorScheme={speed === "1.5" ? "blue" : "gray"}
            onClick={() => handleSpeedChange("1.5")}
          >
            보통
          </Button>
          <Button
            colorScheme={speed === "1.2" ? "blue" : "gray"}
            onClick={() => handleSpeedChange("1.2")}
          >
            빠름
          </Button>
        </Box>
        <Box>
          <Text>이름: {name}</Text>
          <Text>이메일: {email}</Text>
        </Box>
        <Input
          placeholder="새 닉네임 입력"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleNicknameChange}>
          닉네임 변경
        </Button>
        <Button colorScheme="red" onClick={handleLogout}>
          로그아웃
        </Button>
      </VStack>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: -59.5px;
`;

// 카카오 로그인 버튼 스타일
const StyledKakaoButton = styled(Button)`
  background-color: #fae64d;
  color: black;
  width: 250px; /* 버튼 너비 설정 */
  height: 60px; /* 버튼 높이 설정 */
  font-size: 1.2rem; /* 글자 크기 설정 */
  font-weight: bold;

  &:hover {
    background-color: #e6d14b; /* 호버 시 살짝 더 어두운 색상 */
  }
`;

export default Mypage;
