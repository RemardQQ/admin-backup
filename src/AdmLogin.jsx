import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import { DEFAULTS, IMAGES, MESSAGES, STRINGS, COLLECTIONS } from "./config";
import "./AdmLogin.css";
import ClipLoader from "react-spinners/ClipLoader";

function Login() {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setCredentialError("");

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      console.log(MESSAGES.SUCCESSFULLY_AUTHENTICATED, uid);

      const docRef = doc(db, COLLECTIONS.USERS_ADMIN, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Fetched user data from Firestore:", userData);

        if (userData.isAdmin === true) {
          navigate("/admin/manage-users");
        } else {
          setCredentialError(MESSAGES.ACCESS_DENIED);
        }
      } else {
        setCredentialError(MESSAGES.NO_ADMIN_ACCOUNT);
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.code === "auth/user-not-found") {
        setEmailError(MESSAGES.INVALID_EMAIL);
      } else if (error.code === "auth/wrong-password") {
        setPasswordError(MESSAGES.INVALID_PASSWORD);
      } else {
        setCredentialError(MESSAGES.INVALID_CREDENTIALS);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <img
          src={IMAGES.LOGO}
          className="logo-image"
          alt={STRINGS.SIDEBAR_LOGO_TEXT}
        />
        <p className="creative-clique-text">{STRINGS.SIDEBAR_LOGO_TEXT}</p>
        <hr />
        <h2 className="login-title">{STRINGS.LOGIN_TITLE}</h2>
        <hr />
        {credentialError && <p className="toast-error">{credentialError}</p>}
        <form className="login-form" onSubmit={handleSignIn}>
          <div className="input-container">
            {emailError && <p className="toast-error">{emailError}</p>}
            <img
              src={IMAGES.ICON_EMAIL}
              alt="Email Icon"
              className="login-form-icon"
            />
            <input
              type="email"
              placeholder={STRINGS.EMAIL_PLACEHOLDER}
              required
              className="login-input"
            />
          </div>
          <div className="input-container">
            {passwordError && <p className="toast-error">{passwordError}</p>}
            <img
              src={IMAGES.ICON_PASSWORD}
              alt="Password Icon"
              className="login-form-icon"
            />
            <input
              type="password"
              placeholder={STRINGS.PASSWORD_PLACEHOLDER}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="sign-in-button" disabled={loading}>
            {loading ? (
              <ClipLoader
                className="loader"
                color={"#ffffff"}
                loading={loading}
                size={20}
              />
            ) : (
              STRINGS.SIGN_IN
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
