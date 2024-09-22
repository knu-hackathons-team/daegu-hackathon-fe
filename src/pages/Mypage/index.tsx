import { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, Input } from '@chakra-ui/react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setNickname } from '@/redux/nicknameSlice';

const Mypage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const nickname = useSelector((state: RootState) => state.nickname.nickname); // Redux 상태에서 닉네임 가져오기
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
    const [email, setEmail] = useState('user@example.com'); // 이메일 상태
    const [newName, setNewName] = useState(''); // 새 닉네임 입력 값

    const handleKakaoLogin = () => {
        // 카카오 로그인 처리 (리다이렉트 방식)
        window.location.href = 'http://43.203.172.143:8080/api/auth/oauth/kakao?prompt=login';
    };

    useEffect(() => {
        const kakaoToken = localStorage.getItem('kakaoToken');
        if (kakaoToken) {
            setIsLoggedIn(true);
            getUserInfo(kakaoToken);
        }
    }, []);

    const getUserInfo = async (token: string) => {
        try {
            const response = await axios.get('https://giftshop-kakao.shop/api/member/info', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const userData = response.data;
                localStorage.setItem('nickname', userData.nickName); // 닉네임을 로컬 스토리지에 저장
                dispatch(setNickname(userData.nickName)); // Redux 상태에 닉네임 저장
                setEmail(userData.email);
            }
        } catch (error) {
            console.error('유저 정보 불러오기 중 오류 발생:', error);
        }
    };

    const handleNicknameChange = async () => {
        const kakaoToken = localStorage.getItem('kakaoToken');
        if (!newName) {
            alert('변경할 닉네임을 입력하세요.');
            return;
        }

        try {
            const response = await axios.patch(`https://giftshop-kakao.shop/api/member/nickname`, null, {
                params: { nickname: newName },
                headers: {
                    Authorization: `Bearer ${kakaoToken}`,
                },
            });

            if (response.status === 200) {
                dispatch(setNickname(newName)); // Redux 상태에 새 닉네임 반영
                localStorage.setItem('nickname', newName); // 로컬 스토리지에 새 닉네임 저장
                alert('닉네임이 성공적으로 변경되었습니다.');
            }
        } catch (error) {
            console.error('닉네임 변경 중 오류 발생:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('kakaoToken');
        clearCookies();
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
    };

    const clearCookies = () => {
        document.cookie.split(';').forEach((cookie) => {
            document.cookie = cookie
                .replace(/^ +/, '')
                .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
    };

    if (!isLoggedIn) {
        return (
            <Wrapper>
                <VStack spacing={5} p={5}>
                    <Text fontSize="2xl">로그인 하여 이용하시겠습니까?</Text>
                    <StyledKakaoButton onClick={handleKakaoLogin}>카카오 로그인</StyledKakaoButton>
                </VStack>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <VStack spacing={5} p={5}>
                <Text fontSize="2xl">마이페이지</Text>
                <Box>
                    <Text>닉네임: {nickname}</Text>
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

const StyledKakaoButton = styled(Button)`
  background-color: #fae64d;
  color: black;
  width: 250px;
  height: 60px;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    background-color: #e6d14b;
  }
`;

export default Mypage;
