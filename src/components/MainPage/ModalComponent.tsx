import React from "react";
import styled from "@emotion/styled";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import TMapSimple from "./TMapSimple"; // TMapSimple 컴포넌트를 가져오기

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, selectedDay }) => {
  const [isLargerThan600px] = useMediaQuery("(min-width: 600px)");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      blockScrollOnMount={true} // 모달이 열릴 때 스크롤을 막음
      preserveScrollBarGap={true} // 스크롤바가 사라져도 여백을 유지
    >
      <ModalOverlay />
      <ModalContent
        maxW={isLargerThan600px ? "700px" : "90vw"}
        h={isLargerThan600px ? "600px" : "90vh"}
      >
        <ModalHeader>🚩{selectedDay}요일 일정 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody style={{ overflow: "hidden", padding: 0 }}>
          <TMapSimple />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
