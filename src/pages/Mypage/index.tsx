import { useState } from "react";
import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import styled from "@emotion/styled";

const Mypage = () => {
    const [name, setName] = useState("사용자 이름");
    const [email, setEmail] = useState("user@example.com");

    return (
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
    );
};

export default Mypage;