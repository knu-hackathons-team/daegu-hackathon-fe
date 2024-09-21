import React, { useEffect } from 'react';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

const LoginPage = () => {
  // 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      const { Kakao } = window as any;
      if (!Kakao.isInitialized()) {
        Kakao.init('YOUR_JAVASCRIPT_KEY'); // 여기에 카카오 JavaScript 키를 입력할것
      }
    } else {
      console.error("Kakao SDK가 로드되지 않았습니다.");
    }
  }, []);

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      const { Kakao } = window as any;
      Kakao.Auth.authorize({
        redirectUri: 'http://{기영이가 열고있는 프론트엔드 서버 주소}/token.html', // 로그인 성공 시 리다이렉트될 URL
      });
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" h="100vh">
      <Box p={4} shadow="md" borderWidth="1px">
        <Text>서비스를 이용하시려면 로그인해주세요</Text>
      </Box>
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
