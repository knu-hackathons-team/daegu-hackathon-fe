import { useState, useEffect } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";

const Mypage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인을 위한 state
    const [name, setName] = useState("사용자 이름");
    const [email, setEmail] = useState("user@example.com");

    useEffect(() => {
        // localStorage나 sessionStorage에 저장된 카카오 토큰 확인
        const kakaoToken = localStorage.getItem("kakaoToken"); // 토큰 저장 방식에 따라 변경 가능
        if (kakaoToken) {
            setIsLoggedIn(true); // 로그인 상태로 변경
        }
    }, []);

    const handleKakaoLogin = () => {
        // 카카오 로그인 처리 로직 (리다이렉트 방식 사용)
        window.location.href = "http://43.203.172.143:8080/api/auth/oauth/kakao"; // 카카오 로그인 URL
    };

    // 로그인되지 않은 경우 로그인 화면을 보여줌
    if (!isLoggedIn) {
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
    return (
        <Wrapper>
            <VStack spacing={5} p={5}>
                <Text fontSize="2xl">마이페이지</Text>
                <Box>
                    <Text>이름: {name}</Text>
                    <Text>이메일: {email}</Text>
                </Box>
                <Button colorScheme="blue" onClick={() => alert("프로필 편집 클릭됨")}>
                    프로필 편집
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
