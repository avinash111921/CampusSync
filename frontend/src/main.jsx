import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContexts.jsx';   
import { StudentProvider } from './context/StudentData.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>        
        <StudentProvider>
          <App />
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);