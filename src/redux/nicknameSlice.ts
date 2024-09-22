import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 닉네임 상태의 타입 정의
interface NicknameState {
  value: string;
}

// 초기 상태 정의
const initialState: NicknameState = {
  value: '새로운 유저',
};

// 닉네임 슬라이스 정의
const nicknameSlice = createSlice({
  name: 'nickname',
  initialState,
  reducers: {
    setNickname: (state: NicknameState, action: PayloadAction<string>) => {
      state.value = action.payload; // 닉네임을 업데이트
    },
  },
});

// 액션과 리듀서를 내보내기
export const { setNickname } = nicknameSlice.actions;
export default nicknameSlice.reducer;
