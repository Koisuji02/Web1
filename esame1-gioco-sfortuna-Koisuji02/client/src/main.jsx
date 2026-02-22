import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router";

//? main.jsx -> fa il mount del'app React nell'elemento HTML con id 'root'
// StrictMode (per rilevare potenziali problemi)
// BrowserRouter -> gestisce le routes dell'applicazione (con react-router)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
