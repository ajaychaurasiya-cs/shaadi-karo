import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Feed from "./pages/Feed";
import MyProfile from "./pages/MyProfile";
import ViewProfile from "./pages/ViewProfile";
import Viewers from "./pages/Viewers";
import Chat from "./pages/Chat";
import Chatlist from "./pages/Chatlist";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CasteProvider } from "./context/CasteContext";
import Navbar from "./components/Navbar";
import { NotifyProvider } from "./context/Notify";
<<<<<<< HEAD
=======

>>>>>>> 56c1659 (error fix)

function AppRoutes() {
  const { token } = useAuth();

  return (
    <>
      {token && <Navbar />}

      <Routes>
        {/* ✅ PUBLIC ROUTES */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ PROTECTED ROUTES */}
        {token ? (
          <>
            <Route path="/" element={<Feed />} />
            <Route path="/me" element={<MyProfile />} />
            <Route path="/user/:id" element={<ViewProfile />} />
            <Route path="/viewers" element={<Viewers />} />
            <Route path="/chatlist" element={<Chatlist />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <CasteProvider>
        <NotifyProvider >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        </NotifyProvider>
      </CasteProvider>
    </AuthProvider>
  );
}
