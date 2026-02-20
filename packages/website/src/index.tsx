import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'antd/dist/reset.css';

import App from '@app';

const rootElement = document.querySelector('#root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
