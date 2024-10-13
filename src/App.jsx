import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./AdmLogin";
import AdmLayout from "./AdmLayout";
import AdmManageUser from "./AdmManageUser";
import AdmReportedPost from "./AdmReportedPost";
import AdmProfile from "./AdmProfile";
import ErrorBoundary from "./ErrorBoundary"; // Import ErrorBoundary

function App() {
  return (
    <ErrorBoundary>
      {" "}
      {/* Wrap your app with ErrorBoundary */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdmLayout />}>
            <Route path="manage-users" element={<AdmManageUser />} />
            <Route path="reported-posts" element={<AdmReportedPost />} />
            <Route path="profile" element={<AdmProfile />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
