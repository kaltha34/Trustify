import LogInPage from "./Components/LogInPage/LogIn";
import SignUp from "./Components/SignUp/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogIn from "./Components/LogInPage/AdminLogIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-login" element={<AdminLogIn />} />
      </Routes>
    </Router>
  );
}
export default App;
