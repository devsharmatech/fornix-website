import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "610741862614-fibdqn41gl9khnscui02nipupbhq1d70.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
