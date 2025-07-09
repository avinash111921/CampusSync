import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext.jsx';
import { StudentProvider } from './context/StudentContext';
import { CourseProvider } from './context/GradeContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AdminProvider>
        <StudentProvider>
          <CourseProvider>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </CourseProvider>
         </StudentProvider>
      </AdminProvider>
    </BrowserRouter>
);
