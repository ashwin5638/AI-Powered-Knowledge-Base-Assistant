import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from '../pages/login'
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import Upload from "../pages/upload";
import Documents from "../pages/documents";
import Chat from "../pages/chat";
import History from "../pages/History";
import NotFound from "../pages/NotFound";
import Layout from "../components/layout/layout";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading) return null;

    if(!user) return <Navigate to="/login" replace />;

    return children;
}


const AppRoutes = () => {
    return (
        <BrowserRouter>
           <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/history" element={<History />} />
            </Route>

            <Route path="*" element={<NotFound />} />
           </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
