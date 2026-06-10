import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Registrationform from './components/invoice/Registrationform.jsx'
import Showweb from './components/invoice/Showweb.jsx'

createRoot(document.getElementById('root')).render(
   < BrowserRouter>

    <App />
  {/* <Showweb/>"" */}

    
   </BrowserRouter>

   

)
