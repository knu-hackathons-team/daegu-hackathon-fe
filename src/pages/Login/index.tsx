import { Button, VStack, Text } from '@chakra-ui/react';

const LoginPage = () => {
  
  // 카카오 로그인 요청 함수
  const handleKakaoLogin = () => {
    // 로그인 요청 시 페이지 리다이렉트
    window.location.href = 'http://43.203.172.143:8080/api/auth/oauth/kakao';
  };

  return (
    <VStack spacing={4} align="center" justify="center" h="100vh">
      <Text>서비스를 이용하시려면 로그인해주세요</Text>
      <Text>밑에 버튼 누르면 지호가 카톡방에 올린 링크로 넘어갈뿐임</Text>

      <Button
        colorScheme="yellow"
        onClick={handleKakaoLogin}
        size="lg"
        width="200px"
      >
        카카오 로그인
      </Button>
    </VStack>
  );
};

export default LoginPage;
