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
import People from "./Components/UserPages/People/PeopleAndTerms";
import Inbox from "./Components/UserPages/Inbox/Inbox ";
import Services from "./Components/UserPages/Services/services";
import Records from "./Components/UserPages/Record/record";
import Process from "./Components/UserPages/Process/process";
import HelpCenter from "./Components/UserPages/HelpCenter/HelpCenter";
import PeopleDetails from "./Components/UserPages/People/DetailsPage";
import TermsAndConditions from "./Components/UserPages/People/ImportantTermsPage";
import ResetPassword from "./Components/UserPages/ResetPassword/resetpassword";
import UserLayout from "./Components/UserPages/UserLayout/UserLayout";

import AdminLogIn from "./Components/AdminPages/AdminLogIn/AdminLogIn";
import AdminSideBar from "./Components/AdminPages/AdminSidebar/Sidebar";
import AdminDashboard from "./Components/AdminPages/Admindashboard/AdminDashboard";
import AdminProfile from "./Components/AdminPages/AdminProfile/Profile";
import AdminDocuments from "./Components/AdminPages/Documents/DocumentList/DocumentList";
import AdminFAQ from "./Components/AdminPages/FAQContent/FAQContent";
import AdminPanel from "./Components/AdminPages/AdminsSection/AdminPanel";

//Super Admin Routes
import SuperAdminLogin from "./Components/SuperAdmin/SuperAdminLogin/SuperAdminLogIn";
import SuperAdminDashboard from "./Components/SuperAdmin/SuperAdminDashboard/superAdmin";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  useEffect(() => {
    setIsUserLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
    setIsAdminLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
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
          path="/people-details"
          element={
            isUserLoggedIn ? (
              <div className="people-details-container">
                <UserSidebar />
                <PeopleDetails />
                <UserLayout />
              </div>
            ) : (
              <Navigate to="/people" />
            )
          }
        />
        <Route
          path="/terms-details"
          element={
            isUserLoggedIn ? (
              <div className="terms-container">
                <UserSidebar />
                <TermsAndConditions />
                <UserLayout />
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
        <Route path="/super-admin" element={<SuperAdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
