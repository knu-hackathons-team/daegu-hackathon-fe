import { Button, VStack, Text, Flex, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";

const LoginPage = () => {
  // 카카오 로그인 요청 함수
  const handleKakaoLogin = () => {
    // 로그인 요청 시 페이지 리다이렉트
    window.location.href = "http://43.203.172.143:8080/api/auth/oauth/kakao";
  };

  return (
    <Wrapper>
      <VStack spacing={4} align="center" justify="center" h="100vh">
        <Image src="/login.svg" alt="logo" boxSize="150px"/>
        <Button
          bg="#FAE64D"
          color="#333333"
          onClick={handleKakaoLogin}
          size="lg"
          width="200px"
        >
          카카오 로그인
        </Button>
        <Button
          colorScheme="gray"
          onClick={handleKakaoLogin}
          size="lg"
          width="200px"
        >
          게스트
        </Button>
      </VStack>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  width: 100%;
  background-color: #ffffff;
  justify-content: center;
  display: flex;
`;

export default LoginPage;
