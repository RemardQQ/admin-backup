import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { DEFAULTS, IMAGES, MESSAGES, STRINGS, COLLECTIONS } from "./config";
import "./AdmLayout.css";

function AdmLayout() {
  const [profileImage, setProfileImage] = useState(DEFAULTS.PROFILE_IMAGE);
  const [profileName, setProfileName] = useState("");
  const [role, setRole] = useState(DEFAULTS.ROLE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, COLLECTIONS.USERS_ADMIN, user.uid);
        const unsubscribeSnapshot = onSnapshot(
          userDocRef,
          (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setProfileImage(userData.profileImage || DEFAULTS.PROFILE_IMAGE);
              const fullName = userData.fullName || ""; // Use fullName directly
              setProfileName(fullName);
              setRole(userData.role || DEFAULTS.ROLE);
            } else {
              setProfileError(true);
            }
            setLoadingProfile(false);
          },
          (error) => {
            console.error("Error fetching profile data:", error);
            setProfileError(true);
            setLoadingProfile(false);
          }
        );

        // Cleanup the snapshot listener when the component unmounts
        return () => unsubscribeSnapshot();
      } else {
        navigate("/");
      }
    });

    // Cleanup the authentication listener when the component unmounts
    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className="layout-container">
      <div className="admin-container">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src={IMAGES.LOGO} alt="CreativeClique Logo" />
            <h1 className="sidebar-logo-text">{STRINGS.SIDEBAR_LOGO_TEXT}</h1>
          </div>
          <div className="profile">
            {loadingProfile ? (
              <p>{MESSAGES.LOADING_PROFILE}</p>
            ) : profileError ? (
              <p>{MESSAGES.ERROR_LOADING_PROFILE}</p>
            ) : (
              <>
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => (e.target.src = DEFAULTS.FALLBACK_IMAGE)}
                />
                <h3 className="profile-name">{profileName}</h3>
                <span className="profile-role">{role}</span>
              </>
            )}
          </div>
          <nav className="nav-menu">
            <NavLink
              to="/admin/manage-users"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              <img src={IMAGES.MANAGE_USERS_ICON} alt="Manage Users Icon" />
              {STRINGS.NAV.MANAGE_USERS}
            </NavLink>
            <NavLink
              to="/admin/reported-posts"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              <img src={IMAGES.REPORTED_POSTS_ICON} alt="Reported Posts Icon" />
              {STRINGS.NAV.REPORTED_POSTS}
            </NavLink>
            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              <img src={IMAGES.PROFILE_ICON} alt="Profile Icon" />
              {STRINGS.NAV.PROFILE}
            </NavLink>
            <div className="nav-item" onClick={handleLogout}>
              <img src={IMAGES.LOGOUT_ICON} alt="Logout Icon" />
              {STRINGS.NAV.LOGOUT}
            </div>
          </nav>
        </aside>
        <main className="feed">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdmLayout;
