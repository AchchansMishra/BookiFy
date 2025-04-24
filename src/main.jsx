import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {FirebaseProvider} from "./context/firebase";
import './index.css'
import App from './App.jsx'

const root=createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <FirebaseProvider>
    <App />
    </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
);
