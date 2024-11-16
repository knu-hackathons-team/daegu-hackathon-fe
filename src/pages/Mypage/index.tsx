import { useState, useEffect } from "react";
import { Box, Text, VStack, Input, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import axios from "axios";
import kakaologinImage from "./assets/kakaoLoginButton.svg"; // 이미지 파일을 import

const Mypage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("사용자 이름");
  const [email, setEmail] = useState("user@example.com");
  const [newName, setNewName] = useState("");
  const [speed, setSpeed] = useState(localStorage.getItem("speed") || "1.5");

  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭");
    window.location.href = "https://giftshop-kakao.shop/api/auth/oauth/kakao";
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsLoggedIn(true);
      getUserInfo(jwt);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getUserInfo = async (token: string) => {
    try {
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
        localStorage.setItem("nickname", userData.nickName);
        setName(userData.nickName);
        setEmail(userData.email);
      }
    } catch (error) {
      console.error("유저 정보 불러오기 중 오류 발생:", error);
    }
  };

  const handleNicknameChange = async () => {
    const jwt = localStorage.getItem("jwt");

    if (!newName) {
      alert("변경할 닉네임을 입력하세요.");
      return;
    }

    try {
      const response = await axios.patch(
        `https://giftshop-kakao.shop/api/member/nickname`,
        null,
        {
          params: { nickname: newName },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.status === 200) {
        setName(newName);
        alert("닉네임이 성공적으로 변경되었습니다.");
      } else {
        alert("닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류 발생:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    clearCookies();
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  const handleSpeedChange = (newSpeed: string) => {
    setSpeed(newSpeed);
    localStorage.setItem("speed", newSpeed);
  };

  if (!isLoggedIn) {
    return (
      <Wrapper>
        <VStack spacing={5} p={5}>
          <Text fontSize="lg">로그인 하여 이용하시겠습니까?</Text>
          {/* 이미지 버튼으로 변경 */}
          <StyledKakaoImage
            src={kakaologinImage}
            alt="카카오 로그인"
            onClick={handleKakaoLogin}
          />
        </VStack>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <VStack spacing={5} p={5}>
        <Text fontSize="2xl">마이페이지</Text>
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

// 이미지 버튼 스타일
const StyledKakaoImage = styled.img`
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export default Mypage;
