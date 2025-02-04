import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Aquí el strictmode es lo que hace que el efecto se ejecute dos veces
//solo en modo desarrollo, no en producción

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <App />
  </StrictMode>,
)
