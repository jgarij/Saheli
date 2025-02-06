import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter  as Router} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
const client_id = "599844288820-9aqeege7tucji5304cdhfck10hdv0s64.apps.googleusercontent.com"
import { AuthProvider } from './ContextApi/authcontext'


createRoot(document.getElementById('root')).render(
 
  <AuthProvider>
    <GoogleOAuthProvider clientId={client_id}>
    <Router>
          <App />
        </Router>
    </GoogleOAuthProvider>
  </AuthProvider>
 






)
