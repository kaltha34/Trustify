import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import React, { useState, useEffect } from "react";
import UserSidebar from "./Components/UserSideBar/Sidebar"; //User Compoments
import LogIn from "./LogInPages/LogIn"; // User LogIn and Signup pages
import SignUp from "./LogInPages/SignUp";

//User Pages Routes
import UserDashbaord from "./Components/UserPages/UserDashboard/dashboard";
import UploadDocumnets from "./Components/UserPages/UploadDocuments/Upload";
import Insight from "./Components/UserPages/InsightsPage/InsightsPage";
import People from "./Components/UserPages/People/People";
import Inbox from "./Components/UserPages/Inbox/Inbox ";
import Services from "./Components/UserPages/Services/services";
import Records from "./Components/UserPages/Record/record";
import Process from "./Components/UserPages/Process/process";
import HelpCenter from "./Components/UserPages/HelpCenter/HelpCenter";
import ResetPassword from "./Components/UserPages/ResetPassword/resetpassword";
import UserLayout from "./Components/UserPages/UserLayout/UserLayout";

import AdminLogIn from "./Components/AdminPages/AdminLogIn/AdminLogIn";
import AdminSideBar from "./Components/AdminPages/AdminSidebar/Sidebar";
import AdminDashboard from "./Components/AdminPages/Admindashboard/AdminDashboard";
import AdminProfile from "./Components/AdminPages/AdminProfile/Profile";
import AdminDocuments from "./Components/AdminPages/Documents/DocumentList/DocumentList";
import AdminFAQ from "./Components/AdminPages/FAQContent/FAQContent";
import AdminPanel from "./Components/AdminPages/AdminsSection/AdminPanel";
import AdminReply from "./Components/AdminPages/Reply/Reply";
import DocDetails from "./Components/AdminPages/Documents/DocumentDetails/DocumentDetails";

//Super Admin Routes
import SuperAdminLogin from "./Components/SuperAdmin/SuperAdminLogin/SuperAdminLogIn";
import SuperAdminDashboard from "./Components/SuperAdmin/SuperAdminDashboard/superAdmin";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(false);
  useEffect(() => {
    setIsUserLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
    setIsAdminLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
    setIsSuperAdminLoggedIn(
      localStorage.getItem("isSuperAdminLoggedIn") === "true"
    );
  }, []);

  return (
    <Router>
      <Routes>
        {/*User Log In Routes*/}
        <Route
          path="/"
          element={<LogIn onLogin={() => setIsUserLoggedIn(true)} />}
        />
        <Route
          path="/login"
          element={<LogIn onLogin={() => setIsUserLoggedIn(true)} />}
        />
        <Route path="/signup" element={<SignUp />} />

        {/* User Dashboard (Only UserSidebar) */}
        <Route
          path="/user-dashboard"
          element={
            isUserLoggedIn ? (
              <div className="user-dashboard-container">
                <UserSidebar />
                <UserDashbaord />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/upload"
          element={
            isUserLoggedIn ? (
              <div className="upload-container">
                <UserSidebar />
                <UploadDocumnets />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/insight"
          element={
            isUserLoggedIn ? (
              <div className="insight-container">
                <UserSidebar />
                <Insight />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/insight" />
            )
          }
        />

        <Route
          path="/people"
          element={
            isUserLoggedIn ? (
              <div className="people-container">
                <UserSidebar />
                <People />
              </div>
            ) : (
              <Navigate to="/people" />
            )
          }
        />
        <Route
          path="/inbox"
          element={
            isUserLoggedIn ? (
              <div className="Inbox-container">
                <UserSidebar />
                <Inbox />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/inbox" />
            )
          }
        />

        <Route
          path="/services"
          element={
            isUserLoggedIn ? (
              <div className="services-container">
                <UserSidebar />
                <Services />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/services" />
            )
          }
        />

        <Route
          path="/records"
          element={
            isUserLoggedIn ? (
              <div className="records-container">
                <UserSidebar />
                <Records />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/records" />
            )
          }
        />

        <Route
          path="/process"
          element={
            isUserLoggedIn ? (
              <div className="process-container">
                <UserSidebar />
                <Process />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/process" />
            )
          }
        />

        <Route
          path="/helpcenter"
          element={
            isUserLoggedIn ? (
              <div className="help-container">
                <UserSidebar />
                <HelpCenter />
              </div>
            ) : (
              <Navigate to="/helpcenter" />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/*Admin Routes*/}

        <Route
          path="/admin-login"
          element={<AdminLogIn onLogin={() => setIsAdminLoggedIn(true)} />}
        />

        <Route
          path="/admin-dashboard"
          element={
            isAdminLoggedIn ? (
              <div className="admin-container">
                <AdminSideBar />
                <AdminDashboard />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/documents/:id"
          element={
            isAdminLoggedIn ? (
              <div className="admin-container">
                <AdminSideBar />
                <DocDetails />{" "}
                {/* Pass the `status` through the query string */}
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAdminLoggedIn ? (
              <div className="admin-profile-container">
                <AdminSideBar />
                <AdminProfile />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/documents"
          element={
            isAdminLoggedIn ? (
              <div className="admin-documents-container">
                <AdminSideBar />
                <AdminDocuments />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/faq"
          element={
            isAdminLoggedIn ? (
              <div className="admin-faq-container">
                <AdminSideBar />
                <AdminFAQ />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />

        <Route
          path="/reply"
          element={
            isAdminLoggedIn ? (
              <div className="reply-container">
                <AdminSideBar />
                <AdminReply />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <div className="admins-container">
                <AdminSideBar />
                <AdminPanel />
              </div>
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/super-admin"
          element={
            <SuperAdminLogin onLogin={() => setIsSuperAdminLoggedIn(true)} />
          }
        />
        <Route
          path="/super-admin-dashboard"
          element={
            isSuperAdminLoggedIn ? (
              <div className="super-admin-container">
                <SuperAdminDashboard />
              </div>
            ) : (
              <Navigate to="/super-admin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
