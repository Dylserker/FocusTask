import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './i18n';
import App from './App.tsx';

import './index.css';
import './styles/mobile.css';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
