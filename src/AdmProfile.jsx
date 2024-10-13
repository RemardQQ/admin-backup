import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { IMAGES, MESSAGES, DEFAULTS, COLLECTIONS } from "./config";
import "./AdmProfile.css";

function AdmProfile() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(DEFAULTS.FALLBACK_IMAGE);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [role, setRole] = useState(DEFAULTS.ROLE);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, COLLECTIONS.USERS_ADMIN, currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullName || "");
            setMobile(userData.mobile || "");
            setEmail(userData.email || currentUser.email);
            setAddress(userData.address || "");
            setProfileImage(userData.profileImage || DEFAULTS.FALLBACK_IMAGE);
            setRole(userData.role || DEFAULTS.ROLE);
          }
        } catch (error) {
          console.error("Error fetching profile data: ", error);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `profile-images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewProfileImage(downloadURL);

      setUploading(false);
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const userDocRef = doc(db, COLLECTIONS.USERS_ADMIN, user.uid);
      await updateDoc(userDocRef, {
        fullName,
        mobile,
        email,
        address,
        profileImage: newProfileImage || profileImage,
        role,
      });

      if (newProfileImage) {
        setProfileImage(newProfileImage);
        setNewProfileImage(null);
      }

      setSuccessMessage(MESSAGES.SUCCESS_PROFILE_UPDATE);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="adm-profile-container">
      {loadingProfile ? (
        <p>{MESSAGES.LOADING_PROFILE}</p>
      ) : (
        <>
          <div className="adm-profile-left">
            <div className="adm-profile-img-container">
              <img
                src={newProfileImage || profileImage}
                alt="Profile"
                className="adm-profile-img"
                onError={(e) => (e.target.src = DEFAULTS.FALLBACK_IMAGE)}
              />
              {isEditing && (
                <div
                  className="camera-icon"
                  onClick={() => document.getElementById("upload").click()}
                >
                  <img src={IMAGES.CAMERA_ICON} alt="Change Profile Image" />
                </div>
              )}
            </div>
            <p className="adm-profile-role">{role}</p>
          </div>

          <input
            id="upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <div className="adm-profile-info">
            <p className="adm-profile-label">Full Name:</p>
            {isEditing ? (
              <input
                type="text"
                className="adm-profile-value"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              <p className="adm-profile-value-disabled">{fullName}</p>
            )}
            <p className="adm-profile-label">Email:</p>
            {isEditing ? (
              <input
                type="email"
                className="adm-profile-value"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <p className="adm-profile-value-disabled">{email}</p>
            )}
            <p className="adm-profile-label">Phone #:</p>
            {isEditing ? (
              <input
                type="text"
                className="adm-profile-value"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            ) : (
              <p className="adm-profile-value-disabled">{mobile}</p>
            )}
            <p className="adm-profile-label">Address:</p>
            {isEditing ? (
              <input
                type="text"
                className="adm-profile-value"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            ) : (
              <p className="adm-profile-value-disabled">{address}</p>
            )}
            <div className="adm-profile-actions">
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {isEditing ? (
                <>
                  <button
                    className="save-profile-button"
                    onClick={handleSaveProfile}
                  >
                    {saving ? <span className="spinner"></span> : "Save"}
                  </button>
                  <button
                    className="cancel-profile-button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-profile-button"
                  onClick={() => setIsEditing(true)}
                >
                  <img
                    src={IMAGES.EDIT_ICON}
                    alt="Edit"
                    style={{ marginRight: "5px" }}
                  />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdmProfile;
