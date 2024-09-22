import { configureStore } from '@reduxjs/toolkit';
import nicknameReducer from '@/redux/nicknameSlice'; // 닉네임 상태를 관리하는 슬라이스

// Redux Store 생성
export const store = configureStore({
  reducer: {
    nickname: nicknameReducer, // 닉네임 슬라이스 등록
  },
});

// 타입스크립트에서 스토어의 상태와 디스패치 타입을 추론
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
