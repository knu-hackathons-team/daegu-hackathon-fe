import React from "react";
import styled from "@emotion/styled";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import TMapSimple from "./TMapSimple"; // TMapSimple 컴포넌트를 가져오기

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, selectedDay }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="90vw" // 너비를 화면 너비의 90%로 설정
        h="90vh"    // 높이를 화면 높이의 90%로 설정
      >
        <ModalHeader>🚩{selectedDay}요일 일정 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody style={{ overflow: "hidden", padding: 0 }}>
          {/* 지도가 모달 안에서만 보여지도록 설정 */}
          <TMapSimple /> {/* TMapSimple 컴포넌트를 모달 안에 삽입 */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
