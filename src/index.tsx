import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { Provider } from 'react-redux'; // Provider 불러오기
import { store } from '@/redux/store'; // Redux 스토어 불러오기
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    {/* Redux 스토어를 App에 연결 */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

serviceWorkerRegistration.register();
