

console.log('TEST VAR:', import.meta.env.VITE_TEST_HELLO);
console.log("API URL:", import.meta.env.VITE_API_URL);
import { Routes, Route, Navigate } from "react-router-dom";




import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Signup from "./pages/Signup";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserDetailPage from "./pages/admin/UserDetailPage";
import StoreManagement from "./pages/admin/StoreManagement";

import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:userId" element={<UserDetailPage />} />
                <Route path="stores" element={<StoreManagement />} />
            </Route>

            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/owner"
                element={
                    <ProtectedRoute allowedRoles={["OWNER"]}>
                        <OwnerDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;