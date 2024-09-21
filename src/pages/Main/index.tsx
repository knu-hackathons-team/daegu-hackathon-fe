/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Contents } from "@/components/MainPage/Contents";
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

export const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 초기 상태는 모달이 닫혀 있음

  // 첫 접속 여부를 확인하는 함수
  useEffect(() => {
    const isFirstVisit = localStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      // 첫 접속인 경우 localStorage에 저장하고 모달을 열어줌
      localStorage.setItem("firstVisit", "false");
      setIsModalOpen(true); // 첫 방문일 경우 모달 열기
    }
  }, []);

  // 카카오 로그인 버튼을 클릭했을 때 호출되는 함수
  const handleKakaoLogin = () => {
    window.location.href = "http://43.203.172.143:8080/api/auth/oauth/kakao"; // 카카오 로그인 URL
  };

  // 게스트로 이용하기 버튼을 클릭했을 때 호출되는 함수
  const handleGuestUsage = () => {
    setIsModalOpen(false); // 모달을 닫음
  };

  return (
    <Wrapper>
      <InnerWrapper>
        <Contents />
      </InnerWrapper>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {}} // 닫기 기능 비활성화
        isCentered
        motionPreset="slideInBottom"
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <StyledModalContent>
          <StyledModalHeader>
            <Text>서비스 이용 안내</Text>
          </StyledModalHeader>
          <ModalBody>
            <ResponsiveText>
              카카오 로그인을 하여 서비스를 이용하시겠습니까?
            </ResponsiveText>
            <AnimatedLogo
              src="/login.svg" // 로고 이미지 경로를 넣으세요
              alt="서비스 로고"
              boxSize={["80px", "100px"]} // 반응형 크기 (모바일/데스크탑)
              margin="20px auto 0 auto" // 가운데 정렬
            />
          </ModalBody>
          <ModalFooter justifyContent="center">
            <StyledButton colorScheme="yellow" onClick={handleKakaoLogin}>
              로그인하러 가기
            </StyledButton>
            <StyledButton colorScheme="gray" onClick={handleGuestUsage}>
              게스트로 이용하기
            </StyledButton>
          </ModalFooter>
        </StyledModalContent>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100vh;
  justify-content: center;
  display: flex;
`;

const InnerWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
`;

const StyledModalContent = styled(ModalContent)`
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border: 1px solid #e0e0e0;

  /* 반응형 크기 설정: 모바일과 데스크탑 */
  @media (max-width: 768px) {
    width: 90%; /* 모바일: 너비 90% */
    height: 70%; /* 모바일: 높이 70% */
  }

  @media (min-width: 769px) {
    width: 700px; /* 데스크탑: 너비 700px */
    height: 400px; /* 데스크탑: 높이 400px */
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #555;
  background-color: #f7f7f7;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 10px;
`;

const ResponsiveText = styled(Text)`
  text-align: center;
  font-weight: bold;
  color: #333;

  /* 반응형 글씨 크기 설정 */
  @media (max-width: 768px) {
    font-size: 1rem; /* 모바일: 글씨 크기 작게 */
  }

  @media (min-width: 769px) {
    font-size: 1.2rem; /* 데스크탑: 글씨 크기 */
  }
`;

/* 애니메이션 정의 */
const AnimatedLogo = styled(Image)`
  animation: growShrink 2s infinite ease-in-out;

  @keyframes growShrink {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2); /* 커지는 효과 */
    }
    100% {
      transform: scale(1); /* 다시 원래 크기로 돌아옴 */
    }
  }
`;

const StyledButton = styled(Button)`
  width: 150px;
  font-size: 1rem;
  font-weight: bold;
  margin: 0 10px;
  border-radius: 20px;
  padding: 10px 15px;

  &:hover {
    transform: scale(1.05);
    transition: all 0.2s ease-in-out;
  }

  /* 반응형 버튼 스타일 */
  @media (max-width: 768px) {
    font-size: 0.7rem; /* 모바일: 버튼 글씨 크기 작게 */
  }

  @media (min-width: 769px) {
    font-size: 1rem; /* 데스크탑: 기본 글씨 크기 */
  }
`;
