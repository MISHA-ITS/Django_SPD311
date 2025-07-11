import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <GoogleOAuthProvider clientId="578029022394-end39r87mt1c199015deh3e4onbbf7u5.apps.googleusercontent.com">
            <App/>
        </GoogleOAuthProvider>
    </>,
)
