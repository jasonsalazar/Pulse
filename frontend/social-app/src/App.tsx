import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AppShell } from "./components/layout";

import ProfilePage from "./features/profile/ProfilePage";
import EditProfilePage from "./features/profile/EditProfilePage";
import HomePage from "./features/home/HomePage";
import NotificationsPage from "./features/notifications/NotificationsPage";
import { NotificationProvider } from "./context/NotificationContext";
import PostDetailPage from "./features/posts/PostDetailPage";
import { MessagingProvider } from "./context/MessagingContext";
import MessagesPage from "./features/messages/MessagesPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <MessagingProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/home" element={<HomePage />} />

                  <Route path="/profile" element={<ProfilePage />} />

                  <Route path="/profile/:userId" element={<ProfilePage />} />

                  <Route path="/profile/edit" element={<EditProfilePage />} />

                  <Route path="/posts/:postId" element={<PostDetailPage />} />

                  <Route path="/messages" element={<MessagesPage />} />

                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </MessagingProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
