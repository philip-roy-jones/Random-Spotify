import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  //<StrictMode> // TODO: Uncomment before production, this is so React does not render twice in development
    <App />
  //</StrictMode>,
)
