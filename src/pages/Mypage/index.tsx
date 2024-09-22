import { useState, useEffect } from "react";
import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import styled from "@emotion/styled";
import axios from "axios";

const Mypage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인을 위한 state
    const [name, setName] = useState("사용자 이름"); // 서버에서 받아온 닉네임
    const [email, setEmail] = useState("user@example.com");
    const [newName, setNewName] = useState(""); // 새로운 닉네임

    const handleKakaoLogin = () => {
        // 카카오 로그인 처리 (리다이렉트 방식)
        window.location.href = "http://43.203.172.143:8080/api/auth/oauth/kakao"; 
    };

    useEffect(() => {
        // 카카오 토큰 확인 및 서버에서 유저 정보 불러오기
        const kakaoToken = localStorage.getItem("kakaoToken"); 
        if (kakaoToken) {
            setIsLoggedIn(true); // 로그인 상태로 변경
            getUserInfo(kakaoToken); // 서버에서 유저 정보 불러오기
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const getUserInfo = async (token: string) => {
        try {
            // 서버에서 유저 정보를 가져오는 API 호출
            const response = await axios.get('https://giftshop-kakao.shop/api/member/info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                const userData = response.data;

                localStorage.setItem("nickname", userData.nickName);

                setName(userData.nickName); // 서버에서 받아온 닉네임 설정
                setEmail(userData.email);   // 서버에서 받아온 이메일 설정
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const handleNicknameChange = async () => {
        const kakaoToken = localStorage.getItem("kakaoToken"); // 로그인할 때 받은 JWT 토큰
    
        if (!newName) {
            alert("변경할 닉네임을 입력하세요.");
            return;
        }
    
        try {
            // JWT 토큰을 Authorization 헤더에 포함하여 서버에 PATCH 요청
            const response = await axios.patch(`https://giftshop-kakao.shop/api/member/nickname`, null, {
                params: { nickname: newName },
                headers: {
                    Authorization: `Bearer ${kakaoToken}` // JWT 토큰을 헤더에 포함
                }
            });
    
            if (response.status === 200) {
                setName(newName);
                alert("닉네임이 성공적으로 변경되었습니다.");
            } else {
                alert("닉네임 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error updating nickname:", error);
        }
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
                <Input
                    placeholder="새 닉네임 입력"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleNicknameChange}>
                    닉네임 변경
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
