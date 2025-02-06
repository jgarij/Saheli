import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter  as Router} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider } from './ContextApi/authcontext'

const client_id =  import.meta.env.VITE_GOOGLE_CLIENT_ID;


createRoot(document.getElementById('root')).render(
 
  <AuthProvider>
    <GoogleOAuthProvider clientId={client_id}>
    <Router>
          <App />
        </Router>
    </GoogleOAuthProvider>
  </AuthProvider>
 






)
