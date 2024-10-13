// src/config.js

export const DEFAULTS = {
    PROFILE_IMAGE: "/src/Images/defaultProfile.png",
    FALLBACK_IMAGE: "https://via.placeholder.com/100",
    ROLE: "Admin",
  };
  
  export const IMAGES = {
    LOGO: "/src/Images/Logo.png",
    ICON_EMAIL: "/src/Images/iconEmail.png",
    ICON_PASSWORD: "/src/Images/iconPassword.png",
    MANAGE_USERS_ICON: "/src/Images/manageUserSideBar.PNG",
    REPORTED_POSTS_ICON: "/src/Images/reportedPostSidebar.PNG",
    PROFILE_ICON: "/src/Images/admProfile.png",
    LOGOUT_ICON: "/src/Images/logoutSideBar.PNG",
    CAMERA_ICON: "/src/Images/cameraIcon.png",
    EDIT_ICON: "/src/Images/editIcon.png",
  };
  
  export const MESSAGES = {
    INVALID_EMAIL: "Invalid Email",
    INVALID_PASSWORD: "Invalid Password",
    INVALID_CREDENTIALS: "Invalid Credentials",
    ACCESS_DENIED: "Access denied. You are not an admin.",
    NO_ADMIN_ACCOUNT: "No admin account found in Firestore.",
    SUCCESSFULLY_AUTHENTICATED: "Successfully authenticated, user UID:",
    LOADING_PROFILE: "Loading profile...",
    ERROR_LOADING_PROFILE: "Error loading profile",
    SUCCESS_PROFILE_UPDATE: "Profile updated successfully!",
    UPLOADING: "Uploading...",
    UPDATE_PROFILE: "Save Changes",
  };
  
  export const STRINGS = {
    LOGIN_TITLE: "Admin Portal",
    SIGN_IN: "Sign in",
    SIDEBAR_LOGO_TEXT: "CreativeClique.",
    EMAIL_PLACEHOLDER: "Email",
    PASSWORD_PLACEHOLDER: "Password",
    NAV: {
      MANAGE_USERS: "Manage Users",
      REPORTED_POSTS: "Reported Posts",
      PROFILE: "Profile",
      LOGOUT: "Logout",
    },
  };
  
  export const COLLECTIONS = {
    USERS_ADMIN: "users-admin",
  };
  