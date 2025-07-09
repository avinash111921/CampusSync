# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Student Dashboard - College Management System

A modern, responsive React application for student portal management with a clean, organized codebase structure.

## 🚀 Features

- **Authentication System** - Secure login/logout with password management
- **Dashboard Overview** - Quick stats and recent activity
- **Course Management** - View and manage enrolled courses
- **Grade Tracking** - Academic performance and CGPA monitoring
- **Profile Management** - Student information and settings
- **Responsive Design** - Works seamlessly on all devices

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.js          # Authentication form
│   ├── dashboard/
│   │   ├── DashboardContent.js   # Main dashboard view
│   │   ├── CoursesContent.js     # Course management
│   │   ├── GradesContent.js      # Academic records
│   │   └── ProfileContent.js     # User profile settings
│   ├── layout/
│   │   ├── Navbar.js             # Top navigation
│   │   └── Sidebar.js            # Side navigation menu
│   └── common/
│       ├── StatCard.js           # Reusable stat cards
│       ├── CourseCard.js         # Course display cards
│       └── GradeCard.js          # Grade display component
├── hooks/
│   ├── useAuth.js                # Authentication logic
│   └── useStudentData.js         # Student data management
├── services/
│   └── api.js                    # API calls and data fetching
├── utils/
│   └── constants.js              # App constants and configs
└── App.js                        # Main application component
```

## 🛠️ Technologies Used

- **React 18** - Modern React with Hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Custom Hooks** - Reusable logic separation
- **Component Architecture** - Modular, maintainable code

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Student Portal
```

### API Integration
Replace mock data in `services/api.js` with actual API endpoints:

```javascript
// Replace mockAPI calls with real API endpoints
const response = await fetch(`${API_BASE_URL}/students/${scholarId}`);
```

## 🎨 Customization

### Colors and Themes
Modify colors in `utils/constants.js`:

```javascript
export const COLORS = {
  PRIMARY: 'green',
  SECONDARY: 'blue',
  // Add your custom colors
};
```

### Adding New Components
1. Create component in appropriate folder
2. Export from the component file
3. Import and use in parent components

### Custom Hooks
Add new hooks in the `hooks/` directory following the existing pattern:

```javascript
// hooks/useCustomHook.js
import { useState, useEffect } from 'react';

const useCustomHook = () => {
  // Hook logic here
  return { /* hook returns */ };
};

export default useCustomHook;
```

## 📱 Components Overview

### Authentication (`components/auth/`)
- **LoginForm**: Handles user login with email, scholar ID, and password

### Dashboard (`components/dashboard/`)
- **DashboardContent**: Overview with stats and recent activity
- **CoursesContent**: Course enrollment and management
- **GradesContent**: Academic performance tracking
- **ProfileContent**: User settings and profile management

### Layout (`components/layout/`)
- **Navbar**: Top navigation with logout functionality
- **Sidebar**: Navigation menu with active state management

### Common (`components/common/`)
- **StatCard**: Reusable statistic display cards
- **CourseCard**: Individual course information display
- **GradeCard**: Grade and performance display

## 🔄 State Management

The application uses React's built-in state management with custom hooks:

- **useAuth**: Manages authentication state and login/logout logic
- **useStudentData**: Handles student information and academic data

## 🌐 API Integration

The `services/api.js` file provides:
- Authentication endpoints
- Student data management
- Course information retrieval
- Grade and performance data
- Mock data for development

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting platform

## 📝 Development Guidelines

1. **Component Naming**: Use PascalCase for components
2. **File Organization**: Group related components in folders
3. **Props**: Use destructuring for cleaner prop handling
4. **Styling**: Use Tailwind utility classes consistently
5. **State**: Prefer custom hooks for complex state logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please contact the development team or create an issue in the repository.