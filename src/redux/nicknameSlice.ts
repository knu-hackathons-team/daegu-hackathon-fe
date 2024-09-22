import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 설정
const initialState = {
  nickname: '사용자 이름', // 초기 닉네임
};

// 닉네임 슬라이스 생성
const nicknameSlice = createSlice({
  name: 'nickname',
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload; // 닉네임 업데이트
    },
  },
});

// 액션과 리듀서를 export
export const { setNickname } = nicknameSlice.actions;
export default nicknameSlice.reducer;
