import { configureStore } from '@reduxjs/toolkit';
import nicknameReducer from './nicknameSlice';

// 스토어 생성
export const store = configureStore({
  reducer: {
    nickname: nicknameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
