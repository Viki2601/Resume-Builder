import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './ResetPassword';
import AdminAccount from './Components/AdminAccount';
import UserAccount from './Components/UserAccount';
import Templates from './Components/Templates';
import EditTemplatePage from './Components/EditTemplatePage';

function App() {
  const [cookieVal, setCookieVal] = useState(Cookies.get("email"));
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCookie = Cookies.get("email");
      if (updatedCookie !== cookieVal) {
        setCookieVal(updatedCookie);
      }
    }, 1000);
    return () => { clearInterval(interval); }
  }, [cookieVal]);

  // Debugging: Log the current path
  useEffect(() => {
  }, [location.pathname]);

  const hideNavbarPaths = ['/login', '/signup', '/forgotPassword', '/resetpassword', '/editTemplatePage/:templateId'];
  return (
    <div className="App">
      {!hideNavbarPaths.some((path) => matchPath(path, location.pathname)) && <Navbar />}
      <Routes>
        {cookieVal === undefined && <Route path='/login' element={<Login />} />}
        {cookieVal === "access.ecourse78@gmail.com" && <Route path='/login' element={<AdminAccount />} />}
        {cookieVal !== undefined && cookieVal !== "access.ecourse78@gmail.com" && <Route path='/login' element={<UserAccount />} />}
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/templates' element={<Templates />} />
        <Route path='/editTemplatePage/:templateId' element={<EditTemplatePage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;
