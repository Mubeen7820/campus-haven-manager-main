import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentComplaints from "@/pages/student/StudentComplaints";
import StudentPayments from "@/pages/student/StudentPayments";
import StudentMenu from "@/pages/student/StudentMenu";
import StudentRoom from "@/pages/student/StudentRoom";
import StudentLeaves from "@/pages/student/StudentLeaves";
import MessDashboard from "@/pages/mess/MessDashboard";
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminRooms from "@/pages/admin/AdminRooms";
import AdminBlocks from "@/pages/admin/AdminBlocks";
import AdminLeaves from "@/pages/admin/AdminLeaves";
import AdminComplaints from "@/pages/admin/AdminComplaints";
import AdminMenu from "@/pages/admin/AdminMenu";
import AdminPayments from "@/pages/admin/AdminPayments";
import MessMenu from "@/pages/mess/MessMenu";
import MessAttendance from "@/pages/mess/MessAttendance";
import MessInventory from "@/pages/mess/MessInventory";
import MessComplaints from "@/pages/mess/MessComplaints";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const homeRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    const paths = { admin: "/admin", student: "/student", mess_staff: "/mess" };
    return <Navigate to={paths[user!.role] || "/login"} replace />;
  };

  return (
    <Routes>
      <Route path="/" element={homeRedirect()} />
      <Route path="/login" element={isAuthenticated ? homeRedirect() : <LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="blocks" element={<AdminBlocks />} />
        <Route path="leaves" element={<AdminLeaves />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="payments" element={<AdminPayments />} />
      </Route>

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="room" element={<StudentRoom />} />
        <Route path="menu" element={<StudentMenu />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="leaves" element={<StudentLeaves />} />
      </Route>

      {/* Mess staff routes */}
      <Route path="/mess" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MessDashboard />} />
        <Route path="menu" element={<MessMenu />} />
        <Route path="attendance" element={<MessAttendance />} />
        <Route path="inventory" element={<MessInventory />} />
        <Route path="complaints" element={<MessComplaints />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
