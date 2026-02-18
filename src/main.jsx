import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import "./App.css";  
import Footer from './components/Footer.jsx';
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
