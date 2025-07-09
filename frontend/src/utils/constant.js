export const APP_NAME = 'Student Portal';
export const COLLEGE_NAME = 'College Management System';


export const TABS = {
  DASHBOARD: 'dashboard',
  COURSES: 'courses',
  GRADES: 'grades',
  PROFILE: 'profile'
};


export const GRADE_POINTS = {
  'A': 10,
  'B': 9,
  'C': 8,
  'D': 7,
  'E': 6,
  'F': 0
};

export const COURSE_STATUS = {
  ENROLLED: 'enrolled',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  DROPPED: 'dropped'
};


export const SEMESTERS = {
  1: 'First Semester',
  2: 'Second Semester',
  3: 'Third Semester',
  4: 'Fourth Semester',
  5: 'Fifth Semester',
  6: 'Sixth Semester',
  7: 'Seventh Semester',
  8: 'Eighth Semester'
};

export const BRANCHES = {
  CSE: 'Computer Science and Engineering',
  ECE: 'Electronics and Communication Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
  EE: 'Electrical Engineering',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  STUDENT_PROFILE: '/students',
  COURSES: '/courses',
  ENROLLMENTS: '/enrollments',
  GRADES: '/grades'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  PREFERENCES: 'userPreferences'
};

export const COLORS = {
  PRIMARY: 'green',
  SECONDARY: 'blue',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue'
};

export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SCHOLAR_ID: /^\d{7}$/,
  PASSWORD_MIN_LENGTH: 6
};

export const DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  MAX_COURSES_PER_SEMESTER: 8,
  MIN_CREDITS_PER_SEMESTER: 18,
  MAX_CREDITS_PER_SEMESTER: 24
};