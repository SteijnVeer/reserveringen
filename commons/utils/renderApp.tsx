import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

export default function renderApp(App: React.FC, strict?: boolean) {
  createRoot(document.documentElement).render(
    strict ? (
      <StrictMode>
        <App />
      </StrictMode>
    ) : (
      <App />
    )
  );
}
