import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AppShell } from "./components/layout";

import ProfilePage from "./features/profile/ProfilePage";
import EditProfilePage from "./features/profile/EditProfilePage";
import PostsPage from "./features/posts/PostsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/home" element={<PostsPage />} />

              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/profile/:userId" element={<ProfilePage />} />

              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
