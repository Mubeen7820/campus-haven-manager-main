### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\App.css

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, UserRole } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentComplaints from "@/pages/student/StudentComplaints";
import StudentPayments from "@/pages/student/StudentPayments";
import StudentMenu from "@/pages/student/StudentMenu";
import StudentRoom from "@/pages/student/StudentRoom";
import StudentLeaves from "@/pages/student/StudentLeaves";
import StudentAttendance from "@/pages/student/StudentAttendance";
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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access unauthorized area
    const paths = { admin: "/admin", student: "/student", mess_staff: "/mess" };
    return <Navigate to={paths[user.role]} replace />;
  }

  return <>{children}</>;
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
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
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
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="room" element={<StudentRoom />} />
        <Route path="menu" element={<StudentMenu />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="leaves" element={<StudentLeaves />} />
        <Route path="attendance" element={<StudentAttendance />} />
      </Route>

      {/* Mess staff routes */}
      <Route path="/mess" element={<ProtectedRoute allowedRoles={['mess_staff']}><DashboardLayout /></ProtectedRoute>}>
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\index.css

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    --primary: 222 60% 28%;
    --primary-foreground: 210 40% 98%;

    --secondary: 215 25% 92%;
    --secondary-foreground: 222 47% 11%;

    --muted: 220 15% 94%;
    --muted-foreground: 215 16% 47%;

    --accent: 38 92% 50%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 214 20% 88%;
    --input: 214 20% 88%;
    --ring: 222 60% 28%;

    --radius: 0.75rem;

    --sidebar-background: 222 47% 11%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 38 92% 50%;
    --sidebar-primary-foreground: 222 47% 11%;
    --sidebar-accent: 222 40% 18%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 222 30% 20%;
    --sidebar-ring: 38 92% 50%;
    --sidebar-muted: 222 30% 25%;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 11%;
    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;

    --chart-1: 222 60% 28%;
    --chart-2: 38 92% 50%;
    --chart-3: 142 71% 45%;
    --chart-4: 199 89% 48%;
    --chart-5: 0 84% 60%;

    --gradient-primary: linear-gradient(135deg, hsl(222 60% 28%), hsl(222 60% 38%));
    --gradient-accent: linear-gradient(135deg, hsl(38 92% 50%), hsl(28 92% 55%));
    --gradient-hero: linear-gradient(135deg, hsl(222 47% 11%), hsl(222 60% 22%), hsl(222 60% 28%));
    --shadow-card: 0 1px 3px 0 hsl(222 47% 11% / 0.06), 0 1px 2px -1px hsl(222 47% 11% / 0.06);
    --shadow-elevated: 0 10px 25px -5px hsl(222 47% 11% / 0.1), 0 8px 10px -6px hsl(222 47% 11% / 0.08);
  }

  .dark {
    --background: 222 47% 7%;
    --foreground: 210 40% 95%;

    --card: 222 40% 12%;
    --card-foreground: 210 40% 95%;

    --popover: 222 40% 12%;
    --popover-foreground: 210 40% 95%;

    --primary: 38 92% 50%;
    --primary-foreground: 222 47% 11%;

    --secondary: 222 30% 18%;
    --secondary-foreground: 210 40% 95%;

    --muted: 222 25% 16%;
    --muted-foreground: 215 20% 60%;

    --accent: 38 92% 50%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 62% 30%;
    --destructive-foreground: 210 40% 98%;

    --border: 222 25% 20%;
    --input: 222 25% 20%;
    --ring: 38 92% 50%;

    --sidebar-background: 222 47% 6%;
    --sidebar-foreground: 210 40% 95%;
    --sidebar-primary: 38 92% 50%;
    --sidebar-primary-foreground: 222 47% 11%;
    --sidebar-accent: 222 35% 14%;
    --sidebar-accent-foreground: 210 40% 95%;
    --sidebar-border: 222 25% 15%;
    --sidebar-ring: 38 92% 50%;
    --sidebar-muted: 222 25% 18%;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 11%;
    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;

    --gradient-hero: linear-gradient(135deg, hsl(222 47% 5%), hsl(222 47% 11%), hsl(222 60% 18%));
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
    font-family: 'Inter', system-ui, sans-serif;
  }

  h1, h2, h3 {
    font-family: 'Playfair Display', serif;
  }
}

@layer utilities {
  .text-gradient-primary {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bg-gradient-hero {
    background: var(--gradient-hero);
  }

  .bg-gradient-accent {
    background: var(--gradient-accent);
  }

  .shadow-card {
    box-shadow: var(--shadow-card);
  }

  .shadow-elevated {
    box-shadow: var(--shadow-elevated);
  }

  .glass {
    background: hsl(0 0% 100% / 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .dark .glass {
    background: hsl(222 40% 12% / 0.8);
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes shimmer-spin {
  to {
    --angle: 360deg;
  }
}

@keyframes aurora {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-aurora {
  animation-name: aurora;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes scan-line {
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.animate-scan-line {
  animation: scan-line 2s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-aurora, .animate-scan-line { animation: none; }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #f97316; /* Aurora Orange */
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #ea580c;
}

::-webkit-scrollbar-button {
  display: none;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #f97316 transparent;
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\main.tsx

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <div className="w-full h-full">
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </div>
);


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\vite-env.d.ts

/// <reference types="vite/client" />


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\AppSidebar.tsx

import { NavLink, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, BedDouble, Building2, ClipboardList,
  CreditCard, UtensilsCrossed, CalendarCheck, LogOut,
  MessageSquareWarning, FileText, Package, Menu, X, Camera, Mail, Phone, MapPin, Shield
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Students", path: "/admin/students", icon: Users },
    { label: "Rooms", path: "/admin/rooms", icon: BedDouble },
    { label: "Blocks", path: "/admin/blocks", icon: Building2 },
    { label: "Leave Requests", path: "/admin/leaves", icon: CalendarCheck },
    { label: "Complaints", path: "/admin/complaints", icon: MessageSquareWarning },
    { label: "Mess Menu", path: "/admin/menu", icon: UtensilsCrossed },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
  ],
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "My Room", path: "/student/room", icon: BedDouble },
    { label: "Mess Menu", path: "/student/menu", icon: UtensilsCrossed },
    { label: "Complaints", path: "/student/complaints", icon: MessageSquareWarning },
    { label: "Payments", path: "/student/payments", icon: CreditCard },
    { label: "Leave Request", path: "/student/leaves", icon: FileText },
    { label: "Attendance", path: "/student/attendance", icon: ClipboardList },
  ],
  mess_staff: [
    { label: "Dashboard", path: "/mess", icon: LayoutDashboard },
    { label: "Menu", path: "/mess/menu", icon: UtensilsCrossed },
    { label: "Attendance", path: "/mess/attendance", icon: ClipboardList },
    { label: "Inventory", path: "/mess/inventory", icon: Package },
    { label: "Complaints", path: "/mess/complaints", icon: MessageSquareWarning },
  ],
};

const AppSidebar = () => {
  const { user, logout, refreshProfile } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const items = navByRole[user.role];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploadError(null);
    setUploadSuccess(false);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
        
      if (uploadErr) {
        console.error("Storage upload error:", uploadErr);
        throw new Error(`Upload failed: ${uploadErr.message}`);
      }
      
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;
      
      // 1. Update profiles table
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
        
      if (updateErr) {
        console.error("Profile update error:", updateErr);
        throw new Error(`Profile update failed: ${updateErr.message}`);
      }

      // 2. Also update Auth user metadata for redundancy
      const { error: authUpdateErr } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (authUpdateErr) {
        console.warn("Auth metadata update warning:", authUpdateErr);
        // Non-fatal, we primarily rely on profiles table
      }
      
      await refreshProfile();
      setPreviewUrl(null); 
      setUploadSuccess(true);
      toast.success("Profile photo updated successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong during upload";
      console.error("Upload process error:", err);
      setUploadError(errorMessage);
      setPreviewUrl(null); // Revert to old image
    } finally {
      setUploading(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditingProfile) {
      setEditForm({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const saveProfileDetails = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: editForm.name, phone: editForm.phone, address: editForm.address })
        .eq("id", user.id);
      
      if (error) throw error;
      
      if (user.role === 'student') {
         await supabase.from("students").update({ name: editForm.name }).eq("profile_id", user.id);
      }
      
      await supabase.auth.updateUser({ data: { full_name: editForm.name } });
      await refreshProfile();
      toast.success("Profile details updated!");
      setIsEditingProfile(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const displayAvatar = previewUrl || user.avatar;

  const ProfileDialog = () => (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogTrigger asChild>
        <div
          className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group hover:bg-slate-100 transition-all duration-300"
          title="Click to view profile"
        >
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-orange-500 p-1 bg-slate-50 overflow-hidden group-hover:border-orange-400 transition-colors shadow-xl">
              {displayAvatar ? (
                <img src={displayAvatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-300">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-orange-400 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 text-center mb-1 group-hover:text-orange-500 transition-colors">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse" />
            Active Now
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
            {!isEditingProfile && (
              <Button variant="ghost" size="sm" onClick={handleEditToggle} className="text-blue-600">
                Edit Profile
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">
            View and manage your account details and profile photo.
          </DialogDescription>
        </DialogHeader>

        {/* Avatar with upload */}
        <div className="flex flex-col items-center pt-2 pb-4 border-b border-slate-100">
          <div className="relative mb-3">
            <div className="w-28 h-28 rounded-full border-4 border-blue-600 overflow-hidden bg-slate-100">
              {displayAvatar ? (
                <img src={displayAvatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-60"
              title="Change profile photo"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {uploading && <p className="text-sm text-blue-600 font-medium animate-pulse">Uploading...</p>}
          {uploadSuccess && !uploading && <p className="text-sm text-green-600 font-medium">âœ“ Photo updated!</p>}
          {uploadError && <p className="text-sm text-red-500 text-center">{uploadError}</p>}
          {!uploading && !uploadError && !uploadSuccess && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
            >
              Change Profile Photo
            </button>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4 py-2 max-h-[40vh] overflow-y-auto">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Full Name</p>
              {isEditingProfile ? (
                 <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1 h-8" />
              ) : (
                <p className="text-base font-semibold text-slate-900">{user.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
              <p className="text-base font-semibold text-slate-900 break-all">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Role</p>
              <p className="text-base font-semibold text-slate-900 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>

          {(user.phone || isEditingProfile) && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                {isEditingProfile ? (
                   <Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="mt-1 h-8" placeholder="Phone number" />
                ) : (
                   <p className="text-base font-semibold text-slate-900">{user.phone}</p>
                )}
              </div>
            </div>
          )}

          {(user.address || isEditingProfile) && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Address</p>
                {isEditingProfile ? (
                   <Input value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="mt-1 h-8" placeholder="Address" />
                ) : (
                   <p className="text-base font-semibold text-slate-900">{user.address}</p>
                )}
              </div>
            </div>
          )}

          {isEditingProfile && (
             <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleEditToggle} disabled={savingProfile}>Cancel</Button>
                <Button onClick={saveProfileDetails} disabled={savingProfile}>
                   {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-900 border-r border-slate-200 shadow-sm">
      {/* Aurora Logo Section */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <img src="/aurora-logo.png" alt="Aurora Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Aurora</h1>
          <p className="text-[12px] uppercase tracking-widest text-orange-500 font-black">Hostel & Mess</p>
        </div>
      </div>
 
       {/* Profile Section - clickable */}
      <div className="px-6 py-4">
        <ProfileDialog />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-4 overflow-y-auto mt-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin" || item.path === "/student" || item.path === "/mess"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex items-center px-6 py-4 rounded-2xl text-lg font-black transition-all duration-300 group ${isActive
              ? "bg-orange-50 text-orange-600 shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            {({ isActive }) => (
              <>
                <span className={`mr-4 transition-colors ${isActive ? "text-orange-500" : "text-slate-300 group-hover:text-orange-400"}`}>
                  <item.icon className="w-7 h-7" />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout at Bottom */}
      <div className="p-6 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 w-full rounded-2xl text-lg font-black text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-6 h-6 group-hover:text-red-500 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-elevated text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-sidebar-foreground/60"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[320px] min-h-screen shrink-0">
        <div className="fixed w-[320px] h-screen">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\AuroraText.tsx

import { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text" as const,
      WebkitTextFillColor: "transparent" as const,
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = "AuroraText";


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\BlurText.tsx

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';

interface AnimationState {
  filter?: string;
  opacity?: number;
  y?: number;
  [key: string]: number | string | undefined;
}

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationState;
  animationTo?: AnimationState[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  style?: React.CSSProperties;
}

const buildKeyframes = (from: AnimationState, steps: AnimationState[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const keyframes: Record<string, (number | string | undefined)[]> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  style
}: BlurTextProps) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p 
      ref={ref} 
      className={className} 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        position: 'relative',
        ...style 
      }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing
            }}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\DashboardLayout.tsx

import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="lg:hidden w-10" /> {/* spacer for mobile menu button */}
            <h2 className="text-2xl font-black text-slate-900 hidden lg:block tracking-tight">
              Welcome back, <span className="text-orange-500 font-black">{user?.name}</span>
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors group">
                <Bell className="w-6 h-6 text-slate-600 group-hover:text-slate-900" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full" />
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-1" />
              <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden shadow-sm flex items-center justify-center text-[12px] font-black text-white uppercase">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name || "avatar"} className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name[0] : user?.role?.[0]
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-slate-700 capitalize leading-none mb-1">{user?.name}</span>
                  <span className="text-[10px] font-bold text-slate-500 leading-none capitalize">{user?.role?.replace("_", " ")}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-700 mb-4">The application encountered an error and cannot be displayed.</p>
                        <div className="bg-gray-100 p-3 rounded overflow-auto text-sm font-mono text-red-800 mb-4 max-h-48">
                            {this.state.error?.message}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\Footer.tsx

"use client";
import React from "react";
import { Phone, Mail } from "lucide-react";

const GitHubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.835 2.809 1.305 3.492.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
  </svg>
);

const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="text-slate-900 py-12 px-4 font-inter border-t border-slate-200 relative z-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Top Logo and University Name */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            <div className="flex items-center gap-8">
               <img src="/aurora-logo.png" alt="logo" className="h-24 w-auto object-contain" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Aurora Higher Education and Research Academy</h2>
              <p className="text-lg lg:text-xl opacity-90 italic mt-1 text-slate-700">Deemed-to-be-University</p>
              <p className="text-base opacity-75 mt-0.5 text-slate-500">Estd. u/s 3 of UGC Act 1956</p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 max-w-4xl mx-auto" />

          {/* Campus and Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 max-w-5xl">
            <div className="space-y-4">
              <h3 className="text-blue-600 font-extrabold text-xl uppercase tracking-widest">Our Campuses</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                <span className="text-slate-900 font-bold">Day-Scholar Campus:</span><br />
                Uppal, Hyderabad - 500098, Telangana.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                <span className="text-slate-900 font-bold">Residential Campus:</span><br />
                Bhongir, Yadadri - 508116, Telangana.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-blue-600 font-extrabold text-xl uppercase tracking-widest">Get In Touch</h3>
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">+91 91001 23456</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-700">info@aurora.edu.in</span>
                </div>
              </div>

              <div className="flex justify-center md:justify-start space-x-8 pt-4">
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-all transform hover:scale-110">
                  <GitHubIcon size={28} />
                </a>
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-all transform hover:scale-110">
                  <TwitterIcon size={28} />
                </a>
                <a href="#" className="text-slate-500 hover:text-blue-800 transition-all transform hover:scale-110">
                  <LinkedInIcon size={28} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 w-full text-center text-slate-500 text-base">
            <p>&copy; {new Date().getFullYear()} Aurora's Hostel Management. All rights reserved.</p>
            <p className="mt-1 text-sm">
              Designed by AIML Department
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\LogoLoop.css

.logoloop {
  position: relative;
  --logoloop-gap: 32px;
  --logoloop-logoHeight: 28px;
  --logoloop-fadeColorAuto: #ffffff;
}

.logoloop--vertical {
  height: 100%;
  display: inline-block;
}

.logoloop--scale-hover {
  padding-top: calc(var(--logoloop-logoHeight) * 0.1);
  padding-bottom: calc(var(--logoloop-logoHeight) * 0.1);
}

@media (prefers-color-scheme: dark) {
  .logoloop {
    --logoloop-fadeColorAuto: #0b0b0b;
  }
}

.logoloop__track {
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
  position: relative;
  z-index: 0;
}

.logoloop--vertical .logoloop__track {
  flex-direction: column;
  height: max-content;
  width: 100%;
}

.logoloop__list {
  display: flex;
  align-items: center;
}

.logoloop--vertical .logoloop__list {
  flex-direction: column;
}

.logoloop__item {
  flex: 0 0 auto;
  margin-right: var(--logoloop-gap);
  font-size: var(--logoloop-logoHeight);
  line-height: 1;
}

.logoloop--vertical .logoloop__item {
  margin-right: 0;
  margin-bottom: var(--logoloop-gap);
}

.logoloop__item:last-child {
  margin-right: var(--logoloop-gap);
}

.logoloop--vertical .logoloop__item:last-child {
  margin-right: 0;
  margin-bottom: var(--logoloop-gap);
}

.logoloop__node {
  display: inline-flex;
  align-items: center;
}

.logoloop__item img {
  height: var(--logoloop-logoHeight);
  width: auto;
  display: block;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop--scale-hover .logoloop__item {
  overflow: visible;
}

.logoloop--scale-hover .logoloop__item:hover img,
.logoloop--scale-hover .logoloop__item:hover .logoloop__node {
  transform: scale(1.2);
  transform-origin: center center;
}

.logoloop--scale-hover .logoloop__node {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop__link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.logoloop__link:hover {
  opacity: 0.8;
}

.logoloop__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.logoloop--fade::before,
.logoloop--fade::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(24px, 8%, 120px);
  pointer-events: none;
  z-index: 10;
}

.logoloop--fade::before {
  left: 0;
  background: linear-gradient(
    to right,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--fade::after {
  right: 0;
  background: linear-gradient(
    to left,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--vertical.logoloop--fade::before,
.logoloop--vertical.logoloop--fade::after {
  left: 0;
  right: 0;
  width: 100%;
  height: clamp(24px, 8%, 120px);
}

.logoloop--vertical.logoloop--fade::before {
  top: 0;
  bottom: auto;
  background: linear-gradient(
    to bottom,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--vertical.logoloop--fade::after {
  bottom: 0;
  top: auto;
  background: linear-gradient(
    to top,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .logoloop__track {
    transform: translate3d(0, 0, 0) !important;
  }

  .logoloop__item img,
  .logoloop__node {
    transition: none !important;
  }
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\LogoLoop.tsx

"use client";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const useResizeObserver = (callback: () => void, elements: React.RefObject<HTMLElement>[], dependencies: React.DependencyList) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef: React.RefObject<HTMLUListElement>, onLoad: () => void, dependencies: React.DependencyList) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        htmlImg.removeEventListener('load', handleImageLoad);
        htmlImg.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef: React.RefObject<HTMLDivElement>, targetVelocity: number, seqWidth: number, seqHeight: number, isHovered: boolean, hoverSpeed: number | undefined, isVertical: boolean) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
};

interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: string) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style
  }: LogoLoopProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`;
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      } as React.CSSProperties),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        [
          'logoloop',
          isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'logoloop--fade',
          scaleOnHover && 'logoloop--scale-hover',
          className
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: string) => {
        if (renderItem) {
          return (
            <li className="logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          );
        }
        const isNodeItem = 'node' in item;
        const content = isNodeItem ? (
          <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
            {item.node}
          </span>
        ) : (
          <img
            src={item.src}
            srcSet={item.srcSet}
            sizes={item.sizes}
            width={item.width}
            height={item.height}
            alt={item.alt ?? ''}
            title={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        );
        const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
        const itemContent = item.href ? (
          <a
            className="logoloop__link"
            href={item.href}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        );
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {itemContent}
          </li>
        );
      },
      [renderItem]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style, isVertical]
    );

    return (
      <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
        <div className="logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\NavLink.tsx

import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\PageHeader.tsx

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
  >
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold font-display">{title}</h1>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
    {action}
  </motion.div>
);

export default PageHeader;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\Particles.css

.particles-container {
  position: relative;
  width: 100%;
  height: 100%;
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\Particles.tsx

"use client";
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

import './Particles.css';

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className
}: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
        let x, y, z, len;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
          len = x * x + y * y + z * z;
        } while (len > 1 || len === 0);
        const r = Math.cbrt(Math.random());
        positions.set([x * r, y * r, z * r], i * 3);
        randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
        const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
        colors.set(col, i * 3);
      }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
};

export default Particles;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\StatCard.tsx

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "accent" | "success" | "info" | "destructive";
}

const colorMap = {
  primary: "bg-blue-50 text-blue-600",
  accent: "bg-orange-50 text-orange-600",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-sky-50 text-sky-600",
  destructive: "bg-rose-50 text-rose-600",
};

const StatCard = ({ title, value, icon, trend, trendUp, color = "primary" }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileHover={{ y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">{title}</p>
        <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${trendUp ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
              {trendUp ? "â†‘" : "â†“"}
            </span>
            <p className={`text-xs font-bold ${trendUp ? "text-emerald-600" : "text-rose-500"}`}>
              {trend}
            </p>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export default StatCard;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\accordion.tsx

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\alert-dialog.tsx

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\alert.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\aspect-ratio.tsx

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\avatar.tsx

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\badge.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\breadcrumb.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\calendar.tsx

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\card.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\carousel.tsx

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\chart.tsx

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\checkbox.tsx

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\collapsible.tsx

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\command.tsx

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\context-menu.tsx

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\dialog.tsx

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\drawer.tsx

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\dropdown-menu.tsx

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\form.tsx

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\hover-card.tsx

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\input-otp.tsx

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\input.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\label.tsx

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\menubar.tsx

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\navigation-menu.tsx

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\pagination.tsx

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\popover.tsx

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\progress.tsx

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\radio-group.tsx

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\resizable.tsx

import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\scroll-area.tsx

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\select.tsx

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\separator.tsx

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\sheet.tsx

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\sidebar.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    );
  },
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\skeleton.tsx

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\slider.tsx

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\sonner.tsx

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\switch.tsx

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\table.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\tabs.tsx

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\textarea.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\toast.tsx

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\toaster.tsx

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\toggle-group.tsx

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\toggle.tsx

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\tooltip.tsx

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\components\ui\use-toast.ts

import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\contexts\AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "student" | "mess_staff";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ role?: UserRole; error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  const fetchProfile = React.useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      // Get updated user metadata from Auth session as backup
      const { data: { user: authUser } } = await supabase.auth.getUser();

      let parsedEmailName = email.split('@')[0].split('.')[0];
      // Capitalize first letter
      parsedEmailName = parsedEmailName.charAt(0).toUpperCase() + parsedEmailName.slice(1);

      const rawName = data?.full_name || authUser?.user_metadata?.full_name;
      
      let displayName = rawName;
      const cleanName = rawName?.trim().toLowerCase() || "";
      // If the stored name is just the role or a placeholder, fallback to parsed email
      if (!rawName || ['mess', 'mess_staff', 'admin', 'kitchen master', 'kitchen', 'mess manager'].includes(cleanName)) {
          displayName = parsedEmailName;
          // Automatically fix the database record so it stops happening!
          supabase.from('profiles').update({ full_name: parsedEmailName }).eq('id', userId).then();
          supabase.auth.updateUser({ data: { full_name: parsedEmailName } }).catch(e => console.log(e));
      }
      const avatarUrl = data?.avatar_url || authUser?.user_metadata?.avatar_url;

      // If it's a student, try to get their name from the students table
      if (data?.role === 'student' || authUser?.user_metadata?.role === 'student') {
        const { data: studentData } = await supabase
          .from('students')
          .select('name')
          .eq('profile_id', userId)
          .maybeSingle();

        if (studentData?.name) {
          displayName = studentData.name;
        }
      }

      setUser({
        id: userId,
        name: displayName,
        email: email,
        role: (data?.role || authUser?.user_metadata?.role || 'student') as UserRole,
        avatar: avatarUrl,
        phone: data?.phone || authUser?.user_metadata?.phone,
        address: data?.address || authUser?.user_metadata?.address
      });

    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Timeout to prevent stuck loading screen
    const timeoutId = setTimeout(() => {
      // Use a local variable or ref if you want to avoid isLoading dependency here, 
      // but initialization should only happen once.
      setIsLoading(false);
    }, 5000);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeoutId);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error("Auth initialization error:", err);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<{ role?: UserRole; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase Auth Error:", error.message, error.status);
        if (error.message === "Invalid login credentials") {
          return { error: new Error("Invalid email or password. Please try again.") };
        }
        if (error.message === "Email not confirmed") {
          return {
            error: new Error("Login blocked: Email not confirmed. Admin must disable 'Confirm Email' in Supabase Settings or confirm the email manually.")
          };
        }
        return { error };
      }

      if (data.user) {
        // Fetch profile immediately to get the role for the caller
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) return { error: profileError };
        return { role: profile.role as UserRole, error: null };
      }

      return { error: new Error("No user data returned") };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshProfile: () => fetchProfile(user?.id || "", user?.email || ""), isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\hooks\use-mobile.tsx

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\hooks\use-toast.ts

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\lib\supabase.ts


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\lib\utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\Index.tsx

import { Navigate } from "react-router-dom";

const Index = () => <Navigate to="/login" replace />;

export default Index;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\LoginPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlurText from "@/components/BlurText";
import { AuroraText } from "@/components/AuroraText";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import Particles from "@/components/Particles";
const featureLogos = [
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ½ï¸</span> <span className="text-3xl font-bold text-slate-700">Smart Mess</span></div>, title: "Smart Mess" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ </span> <span className="text-3xl font-bold text-slate-700">Room Hub</span></div>, title: "Room Hub" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ“²</span> <span className="text-3xl font-bold text-slate-700">Hostel Pass</span></div>, title: "Hostel Pass" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ“Š</span> <span className="text-3xl font-bold text-slate-700">Food Meter</span></div>, title: "Food Meter" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ””</span> <span className="text-3xl font-bold text-slate-700">Quick Alerts</span></div>, title: "Quick Alerts" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ§¾</span> <span className="text-3xl font-bold text-slate-700">Mess Feedback</span></div>, title: "Mess Feedback" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ› ï¸</span> <span className="text-3xl font-bold text-slate-700">Fix Requests</span></div>, title: "Fix Requests" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ“…</span> <span className="text-3xl font-bold text-slate-700">Leave Desk</span></div>, title: "Leave Desk" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ‘¨â€ðŸ’¼</span> <span className="text-3xl font-bold text-slate-700">Warden Panel</span></div>, title: "Warden Panel" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">ðŸ“¢</span> <span className="text-3xl font-bold text-slate-700">Hostel Updates</span></div>, title: "Hostel Updates" },
];

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Access room, menu & payments" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage hostel operations" },
  { role: "mess_staff", label: "Mess Staff", icon: UtensilsCrossed, desc: "Manage kitchen & food" },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle redirect if already logged in (but not while trying to login with different credentials)
  useEffect(() => {
    if (isAuthenticated && !isLoggingIn && !error && user) {
      const paths: Record<UserRole, string> = { admin: "/admin", student: "/student", mess_staff: "/mess" };
      navigate(paths[user.role]);
    }
  }, [isAuthenticated, isLoggingIn, error, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const { role: userRole, error: loginError } = await login(email, password);

      if (loginError) {
        setError(loginError.message || "Incorrect email or password");
        setIsLoggingIn(false);
        return;
      }

      if (userRole !== selectedRole) {
        const roleNames = { student: "Student", admin: "Admin", mess_staff: "Mess Staff" };
        setError(`Unauthorized: Your account is not registered as ${roleNames[selectedRole]}. Please select the correct role.`);
        await logout();
        setIsLoggingIn(false);
        return;
      }

      const paths: Record<UserRole, string> = { admin: "/admin", student: "/student", mess_staff: "/mess" };
      navigate(paths[userRole]);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950 overflow-y-auto"
    >
      <div
        className="min-h-screen w-full flex items-center p-8 lg:p-24 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      >
        <div className={`absolute inset-0 transition-all duration-1000 ${showLogin ? "bg-black/75 backdrop-blur-[2px]" : "bg-black/30"}`} />

        {/* Top Right Login Toggle */}
        {!showLogin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 right-8 z-30"
          >
            <button
              onClick={() => setShowLogin(true)}
              className="relative p-[1.5px] bg-white/10 dark:bg-black rounded-lg overflow-hidden group shadow-xl transition-all hover:scale-105"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)',
                  animation: 'shimmer-spin 2.5s linear infinite',
                }}
              />
              <span className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md text-white text-base font-bold rounded-lg group-hover:bg-white/20 transition-all">
                <ShieldCheck className="w-5 h-5 text-white" />
                Login
              </span>
            </button>
          </motion.div>
        )}

        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Side: Hero Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-white text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img
                src="/aurora-logo.png"
                alt="Aurora's Hostel Logo"
                className="w-16 h-16 object-contain opacity-90"
              />
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 text-white leading-[1.1] tracking-tight">
              <AuroraText speed={1} colors={["#FFFFFF", "#38BDF8", "#BD4733", "#FFFFFF", "#195DBA"]}>
                Aurora's Hostel & Mess System
              </AuroraText>
            </h1>

            <BlurText
              text="Streamline hostel operations, manage mess services, and enhance student living experience â€” all in one platform."
              delay={30}
              animateBy="words"
              direction="top"
              className="text-lg lg:text-xl text-white max-w-2xl mb-12 leading-relaxed"
            />

            <div className="flex justify-center lg:justify-start gap-10 lg:gap-14">
              {[
                { num: "500+", label: "Students" },
                { num: "120", label: "Rooms" },
                { num: "3", label: "Mess Halls" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl lg:text-3xl font-bold text-orange-500">{s.num}</p>
                  <p className="text-xs lg:text-sm font-medium text-white/80">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Login Card */}
          <div className="w-full lg:w-5/12 flex items-center justify-center">
            <AnimatePresence>
              {showLogin && (
                <motion.div
                  key="login-card"
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-full max-w-md bg-white p-10 lg:p-12 rounded-2xl shadow-2xl relative"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setShowLogin(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                    title="Close"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </button>

                  <h2 className="text-3xl font-bold mb-2 text-slate-900">Login</h2>
                  <p className="text-base text-slate-500 mb-8 font-medium">Identify your role to continue</p>

                  {/* Role selector */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {roles.map(({ role, label, icon: Icon }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedRole === role
                          ? "border-primary bg-primary/5"
                          : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                          }`}
                      >
                        <Icon className={`w-8 h-8 ${selectedRole === role ? "text-primary" : "text-slate-400"}`} />
                        <p className={`text-sm font-bold ${selectedRole === role ? "text-slate-900" : "text-slate-500"}`}>{label}</p>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@aurora.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-base py-6 px-4 rounded-xl border-slate-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" title="password" className="text-sm font-bold text-slate-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="text-base py-6 px-4 pr-12 rounded-xl border-slate-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="relative w-full p-[1.5px] rounded-xl overflow-hidden group shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)',
                          animation: 'shimmer-spin 2.5s linear infinite',
                        }}
                      />
                      <span className="relative z-10 w-full text-xl py-5 bg-[#1e293b] text-white rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#0f172a] transition-all font-black tracking-wide">
                        {isLoggingIn ? (
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                          <>
                            LOGIN <ArrowRight className="w-6 h-6 ml-2" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative bg-[#fafafa] overflow-hidden">
        {/* Diagonal Grid Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={["#14b8a6", "#3b82f6", "#06b6d4"]}
            particleCount={150}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={80}
            moveParticlesOnHover
            alphaParticles={true}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        {/* Core Features Loop */}
        <div className="py-16 relative z-10 overflow-hidden">
          <div className="container mx-auto px-4 mb-10 text-center">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Our Core FACILITIES & Services</h3>
          </div>
          <LogoLoop
            logos={featureLogos}
            speed={40}
            direction="left"
            logoHeight={100}
            gap={160}
            scaleOnHover
            fadeOut
            fadeOutColor="#fafafa"
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;

---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\LoginPageOld.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Access room, menu & payments" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage hostel operations" },
  { role: "mess_staff", label: "Mess Staff", icon: UtensilsCrossed, desc: "Manage kitchen & food" },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Support demo login as advertised in the UI
    let loginEmail = email;
    let loginPassword = password;

    if (!email && !password) {
      if (selectedRole === "student") {
        loginEmail = "sahithi.thavishi@aurora.edu.in";
        loginPassword = "Student@123";
      } else if (selectedRole === "admin") {
        loginEmail = "admin@example.com";
        loginPassword = "admin123";
      } else if (selectedRole === "mess_staff") {
        loginEmail = "vishishta.gunda@aurora.edu.in";
        loginPassword = "Mess@123";
      }
    } else {
      if (selectedRole === "student" && !email.endsWith("@aurora.edu.in")) {
        setError("Student email must end with @aurora.edu.in");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }
    }

    const { error: loginError } = await login(loginEmail, loginPassword);

    if (!loginError) {
      const paths: Record<UserRole, string> = { admin: "/admin", student: "/student", mess_staff: "/mess" };
      navigate(paths[selectedRole]);
    } else {
      setError(loginError.message || "Incorrect password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center bg-cover bg-center relative p-8 lg:p-24"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 text-primary-foreground text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <img
              src="/aurora-logo.png"
              alt="Aurora's Hostel Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold font-display tracking-tight text-white">AURORA'S HOSTEL</h1>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
            Aurora's Hostel & Mess Management
          </h1>
          <p className="text-lg text-primary-foreground/70 leading-relaxed mb-8">
            Streamline hostel operations, manage mess services, and enhance student living experience â€” all in one platform.
          </p>
          <div className="flex justify-center lg:justify-start gap-10">
            {[
              { num: "500+", label: "Students" },
              { num: "120", label: "Rooms" },
              { num: "3", label: "Mess Halls" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold font-display text-accent">{s.num}</p>
                <p className="text-sm text-primary-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Login form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-background/95 backdrop-blur-sm p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/10"
        >
          <h2 className="text-3xl font-bold font-display mb-2">Sign In</h2>
          <p className="text-lg text-muted-foreground mb-8">Select your role and enter credentials</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map(({ role, label, icon: Icon, desc }) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedRole === role
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
                  }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${selectedRole === role ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-base font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xl">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="student@aurora.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 text-lg py-5 px-4"
              />
            </div>
            <div>
              <Label htmlFor="password" title="password" className="text-xl">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 text-lg py-5 px-4"
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full text-xl py-7 shadow-lg shadow-primary/20" size="lg">
              Sign In <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Demo: Select a role and click Sign In (no credentials required)
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\NotFound.tsx

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\test_write.txt

test


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminBlocks.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { blockService, Block } from "@/services/blockService";
import { supabase } from "@/lib/supabase";

const AdminBlocks = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState<Omit<Block, "id">>({
        name: "",
        type: "Boys",
        floors: 1,
        warden: "",
        contact: "",
    });

    useEffect(() => {
        loadBlocks();

        const subscription = supabase
            .channel('blocks_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, () => {
                loadBlocks();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadBlocks = async () => {
        try {
            const data = await blockService.fetchBlocks();
            setBlocks(data);
        } catch (error) {
            console.error("Failed to load blocks:", error);
            // Table might not exist yet, we'll handle gracefully
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBlocks = blocks.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.warden.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.warden) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingId) {
                await blockService.updateBlock(editingId, formData);
                toast.success("Block updated successfully");
            } else {
                await blockService.createBlock(formData);
                toast.success("Block added successfully");
            }
            closeDialog();
        } catch (error) {
            console.error("Error saving block:", error);
            toast.error("Failed to save block. Make sure the 'blocks' table exists in Supabase.");
        }
    };

    const openEditDialog = (block: Block) => {
        setFormData({
            name: block.name,
            type: block.type,
            floors: block.floors,
            warden: block.warden,
            contact: block.contact,
        });
        setEditingId(block.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ name: "", type: "Boys", floors: 1, warden: "", contact: "" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this block?")) return;
        try {
            await blockService.deleteBlock(id);
            toast.success("Block removed successfully");
        } catch (error) {
            console.error("Error deleting block:", error);
            toast.error("Failed to delete block");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Hostel Blocks"
                description="Manage hostel blocks and wings"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Name or Warden..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingId(null)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Block
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Block" : "Add New Block"}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Fill in the details for the hostel block.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Block Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Block A"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val: "Boys" | "Girls" | "Staff") => handleInputChange("type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Boys">Boys Hostel</SelectItem>
                                                <SelectItem value="Girls">Girls Hostel</SelectItem>
                                                <SelectItem value="Staff">Staff Quarters</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="floors">Number of Floors</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        min={1}
                                        value={formData.floors}
                                        onChange={(e) => handleInputChange("floors", parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="warden">Warden Name</Label>
                                    <Input
                                        id="warden"
                                        placeholder="e.g. Mr. Ramesh Kumar"
                                        value={formData.warden}
                                        onChange={(e) => handleInputChange("warden", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact">Contact Number</Label>
                                    <Input
                                        id="contact"
                                        placeholder="e.g. +91 98765 43210"
                                        value={formData.contact}
                                        onChange={(e) => handleInputChange("contact", e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Block"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Hostel Blocks</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Physical infrastructure management</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block Name</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Floors</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Warden</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                                <th className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-slate-400">Loading block data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No blocks defined yet.</td>
                                </tr>
                            ) : (
                                filteredBlocks.map((block) => (
                                    <tr key={block.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8 font-bold text-[#0f172a]">{block.name}</td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                                                block.type === 'Boys' ? 'bg-blue-50 text-blue-600' :
                                                block.type === 'Girls' ? 'bg-pink-50 text-pink-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {block.type}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 font-medium text-slate-500">{block.floors} Floors</td>
                                        <td className="py-5 px-6 font-bold text-slate-700">{block.warden}</td>
                                        <td className="py-5 px-6 text-slate-500 font-medium">{block.contact}</td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(block)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(block.id)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBlocks;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminComplaints.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, Eye, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { complaintService, Complaint } from "@/services/complaintService";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Resolved">("All");
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [complaintIdToDelete, setComplaintIdToDelete] = useState<number | null>(null);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const data = await complaintService.fetchComplaints();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to load complaints:", error);
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredComplaints = complaints.filter((c) => {
        const studentName = c.students?.name || "Unknown";
        const roomNumber = c.students?.rooms?.room_number || "Unknown";
        const matchesSearch =
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleResolve = async (id: number) => {
        try {
            await complaintService.updateComplaintStatus(id, "Resolved");
            setComplaints((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: "Resolved", resolved_at: new Date().toISOString() } : c))
            );
            toast.success("Complaint resolved successfully");
            if (selectedComplaint?.id === id) {
                setSelectedComplaint((prev) => (prev ? { ...prev, status: "Resolved" } : null));
            }
        } catch (error) {
            console.error("Failed to resolve complaint:", error);
            toast.error("Failed to resolve complaint");
        }
    };

    const handleDelete = async () => {
        if (!complaintIdToDelete) return;

        try {
            const { error } = await complaintService.deleteComplaint(complaintIdToDelete);
            if (error) throw error;
            
            setComplaints((prev) => prev.filter((c) => c.id !== complaintIdToDelete));
            toast.success("Complaint deleted successfully");
            if (selectedComplaint?.id === complaintIdToDelete) {
                setSelectedComplaint(null);
            }
        } catch (error: unknown) {
            console.error("Failed to delete complaint:", error);
            const errorMessage = error instanceof Error ? error.message : "Unauthorized";
            toast.error(`Delete failed: ${errorMessage}`);
        } finally {
            setIsDeleteDialogOpen(false);
            setComplaintIdToDelete(null);
        }
    };

    const getStatusColor = (status: Complaint["status"]) => {
        return status === "Resolved"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    };

    const getPriorityColor = (priority: Complaint["priority"]) => {
        switch (priority) {
            case "High": return "text-red-600 font-medium";
            case "Medium": return "text-orange-600";
            case "Low": return "text-blue-600";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Complaints"
                description="View and resolve student complaints"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search complaints..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        value={statusFilter}
                        onValueChange={(val: "All" | "Pending" | "Resolved") => setStatusFilter(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Complaints</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredComplaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredComplaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="font-medium">{complaint.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{complaint.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>{complaint.category}</TableCell>
                                    <TableCell className={getPriorityColor(complaint.priority)}>
                                        {complaint.priority}
                                    </TableCell>
                                    <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => setSelectedComplaint(complaint)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {complaint.status === "Pending" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                                    onClick={() => handleResolve(complaint.id)}
                                                    title="Mark as Resolved"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setComplaintIdToDelete(complaint.id);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                title="Delete Complaint"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Dialog */}
            <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complaint Details</DialogTitle>
                        <DialogDescription>Full details of the issue reported</DialogDescription>
                    </DialogHeader>
                    {selectedComplaint && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Student</h4>
                                    <p className="text-base">{selectedComplaint.students?.name || "Unknown"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Room</h4>
                                    <p className="text-base">{selectedComplaint.students?.rooms?.room_number || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                    <p className="text-base">{selectedComplaint.category}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                    <p className="text-base">{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                                    <span className={`text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                                        {selectedComplaint.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}
                                    >
                                        {selectedComplaint.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedComplaint?.status === "Pending" && (
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => selectedComplaint && handleResolve(selectedComplaint.id)}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Resolved
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this complaint? This action cannot be undone and will remove the record from the database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminComplaints;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminDashboard.tsx

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { Users, BedDouble, CreditCard, MessageSquareWarning } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { studentService } from "@/services/studentService";
import { roomService } from "@/services/roomService";
import { paymentService } from "@/services/paymentService";
import { complaintService } from "@/services/complaintService";

const COLORS = ["hsl(222, 60%, 28%)", "hsl(215, 25%, 92%)"];

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  "In Progress": "bg-info/10 text-info",
  Resolved: "bg-success/10 text-success",
};

interface DashboardStats {
  totalStudents: number;
  roomsOccupied: number;
  totalRooms: number;
  paymentsCollected: number;
  openComplaints: number;
}

interface RecentComplaint {
  id: number;
  student: string;
  type: string;
  status: string;
  desc: string;
}

interface ChartData {
  name?: string;
  month?: string;
  value?: number;
  amount?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    roomsOccupied: 0,
    totalRooms: 0,
    paymentsCollected: 0,
    openComplaints: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([]);
  const [paymentData, setPaymentData] = useState<ChartData[]>([]);
  const [occupancyData, setOccupancyData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [students, rooms, payments, complaints] = await Promise.all([
          studentService.fetchStudents(),
          roomService.fetchRooms(),
          paymentService.fetchPayments(),
          complaintService.fetchComplaints(),
        ]);

        // Calculate Stats
        const totalStudents = students.length;
        const totalRooms = rooms.reduce((acc, r) => acc + r.capacity, 0); // Capacity based
        const occupied = rooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0);

        const totalPayments = payments
          .filter(p => p.status === 'Paid')
          .reduce((acc, p) => acc + p.amount, 0);

        const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

        setStats({
          totalStudents,
          roomsOccupied: occupied,
          totalRooms,
          paymentsCollected: totalPayments,
          openComplaints: openComplaintsCount,
        });

        // Recent Complaints
        setRecentComplaints(complaints.slice(0, 5).map(c => ({
          id: c.id,
          student: c.students?.name || 'Unknown',
          type: c.category || 'General',
          status: c.status,
          desc: c.title,
        })));

        // Payment Data (Group by Month - simplified for last 6 months)
        // This logic can be improved for real monthly aggregation
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const pData = months.slice(0, 6).map(m => ({ month: m, amount: 0 })); // Placeholder logic
        // Real aggregation needs date parsing
        setPaymentData(pData);

        // Occupancy Data
        setOccupancyData([
          { name: "Occupied", value: occupied },
          { name: "Vacant", value: totalRooms - occupied }, // Assuming total capacity
        ]);

      } catch (error: unknown) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of hostel operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6" />}
          trend="Total enrolled"
          trendUp
          color="primary"
        />
        <StatCard
          title="Hostel Occupancy"
          value={`${stats.roomsOccupied}/${stats.totalRooms}`}
          icon={<BedDouble className="w-6 h-6" />}
          trend={`${stats.totalRooms > 0 ? Math.round((stats.roomsOccupied / stats.totalRooms) * 100) : 0}% capacity used`}
          trendUp
          color="accent"
        />
        <StatCard
          title="Revenue Collected"
          value={`â‚¹${(stats.paymentsCollected / 100000).toFixed(2)}L`}
          icon={<CreditCard className="w-6 h-6" />}
          trend="Current Academic Year"
          trendUp
          color="success"
        />
        <StatCard
          title="Active Complaints"
          value={stats.openComplaints}
          icon={<MessageSquareWarning className="w-6 h-6" />}
          trend="Urgent action required"
          trendUp={false}
          color="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Payment chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">Finance Overview</h3>
              <p className="text-sm font-medium text-slate-400 mt-0.5">Monthly fee collection analysis</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-wider">
              Live Data
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `â‚¹${v / 1000}k`} />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] text-white p-3 rounded-xl shadow-2xl border border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.month}</p>
                        <p className="text-base font-black">â‚¹{payload[0].value?.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Occupancy pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#0f172a]">Room Allocation</h3>
            <p className="text-sm font-medium text-slate-400 mt-0.5">Distribution of space</p>
          </div>
          <div className="relative flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" strokeWidth={4} stroke="#fff">
                  <Cell fill="#0f172a" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-[#0f172a]">
                {stats.totalRooms > 0 ? Math.round((stats.roomsOccupied / stats.totalRooms) * 100) : 0}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupied</span>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {occupancyData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-[#0f172a]" : "bg-slate-300"}`} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{d.name}</span>
                </div>
                <span className="text-sm font-black text-[#0f172a]">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent complaints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0f172a]">Student Grievances</h3>
            <p className="text-sm font-medium text-slate-400 mt-0.5">Most recent maintenance and support tickets</p>
          </div>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-2xl transition-colors">
            View All Reports
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Header</th>
                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue Description</th>
                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold italic">No pending grievances found.</td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                  <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8 font-bold text-slate-700">{c.student}</td>
                    <td className="py-5 px-6">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        {c.type}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-slate-500 font-medium">{c.desc}</td>
                    <td className="py-5 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminLeaves.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { leafService, Leaf } from "@/services/leafService";

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState<Leaf[]>([]);
    const [search, setSearch] = useState("");
    const [selectedLeave, setSelectedLeave] = useState<Leaf | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = async () => {
        try {
            const data = await leafService.fetchLeaves();
            setLeaves(data);
        } catch (error) {
            console.error("Failed to load leaves:", error);
            toast.error("Failed to load leave requests");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeaves = leaves.filter((l) => {
        const studentName = l.students?.name || "Unknown";
        const roomNumber = l.students?.rooms?.room_number || "Unknown";
        return (
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleStatusChange = async (id: number, newStatus: "Approved" | "Rejected") => {
        try {
            await leafService.updateLeafStatus(id, newStatus);
            setLeaves((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
            );
            toast.success(`Leave request ${newStatus.toLowerCase()} successfully`);
            if (selectedLeave?.id === id) {
                setSelectedLeave(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: Leaf["status"]) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leave Requests"
                description="Review and manage student leave applications"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Student or Room..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredLeaves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{leave.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">From:</span> {new Date(leave.start_date).toLocaleDateString()}
                                            <br />
                                            <span className="text-muted-foreground">To:</span> {new Date(leave.end_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={leave.reason}>
                                        {leave.reason}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                                        >
                                            {leave.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => setSelectedLeave(leave)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {leave.status === "Pending" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                                        onClick={() => handleStatusChange(leave.id, "Approved")}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                                                        onClick={() => handleStatusChange(leave.id, "Rejected")}
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Dialog */}
            <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>Review full details of the leave application</DialogDescription>
                    </DialogHeader>
                    {selectedLeave && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Student Name</h4>
                                    <p className="text-base">{selectedLeave.students?.name || "Unknown"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Room Number</h4>
                                    <p className="text-base">{selectedLeave.students?.rooms?.room_number || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                                    <p className="text-base">{new Date(selectedLeave.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                                    <p className="text-base">{new Date(selectedLeave.end_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                                <p className="text-base p-3 bg-muted rounded-md mt-1">{selectedLeave.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLeave.status)}`}
                                >
                                    {selectedLeave.status}
                                </span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedLeave?.status === "Pending" && (
                            <>
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => selectedLeave && handleStatusChange(selectedLeave.id, "Rejected")}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => selectedLeave && handleStatusChange(selectedLeave.id, "Approved")}
                                >
                                    Approve
                                </Button>
                            </>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedLeave(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLeaves;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminMenu.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { Edit, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { messService, MessMenu } from "@/services/messService";

const AdminMenu = () => {
    const [menu, setMenu] = useState<MessMenu[]>([]);
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial state representing a full week structure to ensure we display all days even if empty in DB
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await messService.fetchMenu();
            setMenu(data);
        } catch (error) {
            console.error("Failed to load menu:", error);
            toast.error("Failed to load mess menu");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get items for a specific day and meal
    const getMenuItems = (day: string, meal: string) => {
        return menu.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
    };

    const [formData, setFormData] = useState({
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: "",
    });

    const handleEdit = (day: string) => {
        setEditingDay(day);
        setFormData({
            breakfast: getMenuItems(day, 'Breakfast') === '-' ? '' : getMenuItems(day, 'Breakfast'),
            lunch: getMenuItems(day, 'Lunch') === '-' ? '' : getMenuItems(day, 'Lunch'),
            snacks: getMenuItems(day, 'Snacks') === '-' ? '' : getMenuItems(day, 'Snacks'),
            dinner: getMenuItems(day, 'Dinner') === '-' ? '' : getMenuItems(day, 'Dinner'),
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDay) return;

        try {
            // Upsert each meal type
            await Promise.all([
                messService.updateMenu(editingDay, 'Breakfast', formData.breakfast),
                messService.updateMenu(editingDay, 'Lunch', formData.lunch),
                messService.updateMenu(editingDay, 'Snacks', formData.snacks),
                messService.updateMenu(editingDay, 'Dinner', formData.dinner),
            ]);

            toast.success(`${editingDay}'s menu updated successfully`);
            await loadMenu(); // Reload to refresh state
            setEditingDay(null);
        } catch (error) {
            console.error("Failed to save menu:", error);
            toast.error("Failed to save menu");
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Group menu by day for display (since DB stores rows per meal)
    // Actually, `getMenuItems` handles lookup. We just iterate `days`.

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Menu"
                description="Manage weekly food menu"
            />

            {isLoading ? (
                <div className="text-center py-10">Loading menu...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map((day) => (
                        <Card key={day} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${day === "Sunday" ? "bg-red-500" : "bg-primary"
                                }`} />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Utensils className="h-6 w-6 text-muted-foreground" />
                                        {day}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEdit(day)}
                                    >
                                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-base">
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Breakfast:</span>
                                    <span className="text-base">{getMenuItems(day, 'Breakfast')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Lunch:</span>
                                    <span className="text-base">{getMenuItems(day, 'Lunch')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Snacks:</span>
                                    <span className="text-base">{getMenuItems(day, 'Snacks')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Dinner:</span>
                                    <span className="text-base">{getMenuItems(day, 'Dinner')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!editingDay} onOpenChange={(open) => !open && setEditingDay(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Menu - {editingDay}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="breakfast">Breakfast</Label>
                            <Textarea
                                id="breakfast"
                                value={formData.breakfast}
                                onChange={(e) => handleInputChange("breakfast", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lunch">Lunch</Label>
                            <Textarea
                                id="lunch"
                                value={formData.lunch}
                                onChange={(e) => handleInputChange("lunch", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="snacks">Snacks</Label>
                            <Textarea
                                id="snacks"
                                value={formData.snacks}
                                onChange={(e) => handleInputChange("snacks", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dinner">Dinner</Label>
                            <Textarea
                                id="dinner"
                                value={formData.dinner}
                                onChange={(e) => handleInputChange("dinner", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingDay(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMenu;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminPayments.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, DollarSign, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { paymentService, Payment } from "@/services/paymentService";

const AdminPayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [students, setStudents] = useState<{ id: number; name: string; admission_no: string }[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending" | "Failed">("All");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        student_id: 0,
        amount: 5000,
        type: "Hostel Fee" as Payment['type'],
        status: "Pending" as Payment['status'],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [pData, sData] = await Promise.all([
                paymentService.fetchPayments(),
                import("@/services/studentService").then(m => m.studentService.fetchStudents())
            ]);
            setPayments(pData);
            setStudents(sData.map(s => ({ id: s.id, name: s.name, admission_no: s.admission_no })));
        } catch (error: unknown) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load payments and students");
        } finally {
            setIsLoading(false);
        }
    };

    const loadPayments = async () => {
        try {
            const data = await paymentService.fetchPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to load payments:", error);
            toast.error("Failed to load payments");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPayments = payments.filter((p) => {
        const studentName = p.students?.name || "Unknown";
        const roomNumber = p.students?.rooms?.room_number || "Unknown";
        const matchesSearch =
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.student_id || !formData.amount) {
            toast.error("Please select a Student and enter Amount");
            return;
        }

        setIsSubmitting(true);
        try {
            await paymentService.createPayment({
                student_id: formData.student_id,
                amount: formData.amount,
                type: formData.type,
                status: formData.status,
            });
            toast.success("Payment recorded successfully");
            const pData = await paymentService.fetchPayments();
            setPayments(pData);
            setIsDialogOpen(false);
            setFormData({ student_id: 0, amount: 5000, type: "Hostel Fee", status: "Pending" });
        } catch (error: unknown) {
            console.error("Failed to create payment:", error);
            toast.error("Failed to create payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: Payment["status"]) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Failed": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Payments"
                description="Track and manage student fee payments"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Student or Room..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={statusFilter}
                            onValueChange={(val: "All" | "Paid" | "Pending" | "Failed") => setStatusFilter(val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Payments</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Record Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Payment</DialogTitle>
                            <DialogDescription>
                                Enter student details and payment information to record a new transaction.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Select Student</Label>
                                <Select
                                    value={formData.student_id ? formData.student_id.toString() : ""}
                                    onValueChange={(val) => handleInputChange("student_id", parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Search Student..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name} ({s.admission_no})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Payment Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => handleInputChange("type", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hostel Fee">Hostel Fee</SelectItem>
                                        <SelectItem value="Mess Fee">Mess Fee</SelectItem>
                                        <SelectItem value="Fine">Fine</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (â‚¹)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange("amount", parseInt(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: Payment['status']) => handleInputChange("status", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending (Bill Student)</SelectItem>
                                        <SelectItem value="Paid">Paid (Confirmed)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Recording..." : "Record Payment"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{payment.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>â‚¹{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>{payment.type}</TableCell>
                                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-sm">{payment.transaction_id || "-"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminPayments;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminRooms.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { roomService, Room } from "@/services/roomService";
import { supabase } from "@/lib/supabase";

const AdminRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        room_number: "",
        block: "",
        floor: 1,
        type: "AC" as Room['type'],
        capacity: 1,
        status: "Available" as Room['status']
    });

    useEffect(() => {
        loadRooms();

        const subscription = supabase
            .channel('rooms_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
                loadRooms();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadRooms = async () => {
        try {
            const data = await roomService.fetchRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
            toast.error("Failed to load rooms");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRooms = rooms.filter(
        (r) =>
            r.room_number.toLowerCase().includes(search.toLowerCase()) ||
            r.block.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.room_number || !formData.block) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingId) {
                await roomService.updateRoom(editingId, formData);
                toast.success("Room updated successfully");
            } else {
                await roomService.createRoom({
                    room_number: formData.room_number,
                    block: formData.block,
                    floor: formData.floor,
                    type: formData.type,
                    capacity: formData.capacity,
                    status: formData.status
                });
                toast.success("Room added successfully");
            }
            loadRooms();
            closeDialog();
        } catch (error) {
            console.error("Error saving room:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to save room";
            toast.error(errorMessage);
        }
    };

    const openEditDialog = (room: Room) => {
        setFormData({
            room_number: room.room_number,
            block: room.block,
            floor: room.floor || 1,
            type: room.type,
            capacity: room.capacity,
            status: room.status
        });
        setEditingId(room.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ room_number: "", block: "", floor: 1, type: "AC", capacity: 1, status: "Available" });
    };

    // Delete is not implemented in roomService yet? Warning: Referential integrity with students.
    // For now, I'll remove delete button or Implement delete in service if I did.
    // I didn't verify deleteRoom in roomService.
    // Let's check roomService content. It has update, create, get, fetch. NO DELETE.
    // So I will remove Delete button for now or implement it.
    // I'll implement it later if asked.

    const getStatusColor = (status: Room["status"]) => {
        switch (status) {
            case "Available": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Occupied": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Maintenance": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this room? This may fail if students are currently assigned to it.")) return;
        try {
            await roomService.deleteRoom(id);
            toast.success("Room deleted successfully");
            loadRooms();
        } catch (error: unknown) {
            console.error("Error deleting room:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to delete room";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Room Management"
                description="Allocate and manage hostel rooms"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Room or Block..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingId(null)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Room" : "Add New Room"}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Enter the details for the room allocation.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="block">Block</Label>
                                        <Select
                                            value={formData.block}
                                            onValueChange={(val) => handleInputChange("block", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Block" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Block A">Block A</SelectItem>
                                                <SelectItem value="Block B">Block B</SelectItem>
                                                <SelectItem value="Block C">Block C</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room_number">Room Number</Label>
                                        <Input
                                            id="room_number"
                                            placeholder="e.g. 101"
                                            value={formData.room_number}
                                            onChange={(e) => handleInputChange("room_number", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val: "AC" | "Non-AC") => handleInputChange("type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AC">AC</SelectItem>
                                                <SelectItem value="Non-AC">Non-AC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity_type">Occupancy Type</Label>
                                        <Select
                                            value={formData.capacity === 1 ? "Single" : formData.capacity === 2 ? "Double" : "Triple"}
                                            onValueChange={(val) => {
                                                const caps: Record<string, number> = { Single: 1, Double: 2, Triple: 3 };
                                                handleInputChange("capacity", caps[val] || 1);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Occupancy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">Single (1)</SelectItem>
                                                <SelectItem value="Double">Double (2)</SelectItem>
                                                <SelectItem value="Triple">Triple (3)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Capacity (Auto)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Room"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Room Directory</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Manage allocations and maintenance status</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Room Number</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Occupancy</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-slate-400">Syncing room data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No rooms located in this search.</td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8 font-bold text-[#0f172a]">{room.room_number}</td>
                                        <td className="py-5 px-6">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter bg-slate-100 px-2 py-1 rounded-lg">{room.block}</span>
                                        </td>
                                        <td className="py-5 px-6 font-medium text-slate-500">{room.type}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-500 rounded-full ${
                                                            (room.current_occupancy || 0) >= room.capacity ? 'bg-amber-500' : 'bg-blue-500'
                                                        }`}
                                                        style={{ width: `${((room.current_occupancy || 0) / room.capacity) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-slate-400 tracking-tighter">
                                                    {room.current_occupancy} / {room.capacity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                                    room.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    room.status === "Occupied" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}
                                            >
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(room)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRooms;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\admin\AdminStudents.tsx

import { useState, useEffect, useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, RefreshCw, Camera } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { studentService, Student } from "@/services/studentService";
import { roomService } from "@/services/roomService";
import { supabase } from "@/lib/supabase";

const AdminStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [rooms, setRooms] = useState<{ id: number; room_number: string; block: string }[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        admission_no: "",
        name: "",
        course: "",
        year: 1,
        room_id: undefined as number | undefined,
        parent_name: "",
        parent_phone: "",
        blood_group: "",
        emergency_contact: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [sData, rData] = await Promise.all([
                studentService.fetchStudents(),
                roomService.fetchRooms()
            ]);
            setStudents(sData);
            setRooms(rData.map(r => ({ id: r.id, room_number: r.room_number, block: r.block })));
        } catch (error: unknown) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load students and rooms");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.admission_no && s.admission_no.toLowerCase().includes(search.toLowerCase())) ||
            (s.rooms?.room_number && s.rooms.room_number.toLowerCase().includes(search.toLowerCase()))
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.room_id) {
            toast.error("Please fill in all required fields (Name, Assigned Room)");
            return;
        }

        try {
            const studentData = {
                name: formData.name,
                room_id: formData.room_id,
                admission_no: formData.admission_no || `ADM-${Date.now()}`,
                parent_name: formData.parent_name || "Unknown",
                parent_phone: formData.parent_phone || "",
                course: formData.course || "B.Tech",
                year: formData.year || 1,
                blood_group: formData.blood_group || "Unknown",
                emergency_contact: formData.emergency_contact || "",
                email: formData.email || null,
                password: formData.password || undefined,
            };

            if (editingId) {
                await studentService.updateStudent(editingId, studentData);
                toast.success("Student updated successfully");
            } else {
                await studentService.createStudent({
                    ...studentData,
                    status: "Active" as const,
                });
                toast.success("Student added successfully");
            }

            await loadData();
            closeDialog();
        } catch (error: unknown) {
            console.error("Error saving student:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to save student";
            toast.error(errorMessage);
        }
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 8; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const student = students.find(s => s.id === editingId);
        if (!student || !student.profile_id) {
            toast.error("Student must have a registered login before uploading a photo.");
            return;
        }

        setUploadingAvatar(true);
        try {
            const ext = file.name.split(".").pop();
            const fileName = `${student.profile_id}-${Date.now()}.${ext}`;
            const filePath = `avatars/${fileName}`;
            
            const { error: uploadErr } = await supabase.storage
              .from("avatars")
              .upload(filePath, file);
              
            if (uploadErr) throw uploadErr;
            
            const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = publicData.publicUrl;
            
            const { error: updateErr } = await supabase
              .from("profiles")
              .update({ avatar_url: publicUrl })
              .eq("id", student.profile_id);
              
            if (updateErr) throw updateErr;

            toast.success("Student profile photo updated successfully!");
            await loadData(); 
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Failed to upload photo";
            toast.error("Failed to upload photo: " + errorMessage);
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const openAddDialog = () => {
        setEditingId(null);
        setFormData({
            admission_no: "",
            name: "",
            course: "",
            year: 1,
            room_id: undefined,
            parent_name: "",
            parent_phone: "",
            blood_group: "",
            emergency_contact: "",
            email: "",
            password: generatePassword()
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (student: Student) => {
        setFormData({
            admission_no: student.admission_no || "",
            name: student.name || "",
            course: student.course || "",
            year: student.year || 1,
            room_id: student.room_id,
            parent_name: student.parent_name || "",
            parent_phone: student.parent_phone || "",
            blood_group: student.blood_group || "",
            emergency_contact: student.emergency_contact || "",
            email: student.email || "",
            password: ""
        });
        setEditingId(student.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            admission_no: "",
            name: "",
            course: "",
            year: 1,
            room_id: undefined,
            parent_name: "",
            parent_phone: "",
            blood_group: "",
            emergency_contact: "",
            email: "",
            password: ""
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await studentService.deleteStudent(id);
            toast.success("Student removed successfully");
            loadData();
        } catch (error: unknown) {
            console.error("Error deleting student:", error);
            toast.error("Failed to delete student");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Students"
                description="Add, update, and manage student records"
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Enter student details including login credentials.
                            </DialogDescription>
                        </DialogHeader>
                        {editingId && (
                            <div className="flex items-center gap-4 py-2 border-b border-slate-100 mb-2">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                    {students.find(s => s.id === editingId)?.profiles?.avatar_url ? (
                                        <img src={students.find(s => s.id === editingId)!.profiles!.avatar_url!} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-slate-400">{formData.name.charAt(0) || "?"}</span>
                                    )}
                                </div>
                                <div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar || !students.find(s => s.id === editingId)?.profile_id}>
                                        <Camera className="w-4 h-4 mr-2" />
                                        {uploadingAvatar ? "Uploading..." : "Change Photo"}
                                    </Button>
                                    {!students.find(s => s.id === editingId)?.profile_id && (
                                        <p className="text-xs text-slate-400 mt-1">Student must have a login to upload a photo.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Rahul Verma"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admission_no">Admission No</Label>
                                    <Input
                                        id="admission_no"
                                        placeholder="e.g. ADM001"
                                        value={formData.admission_no}
                                        onChange={(e) => handleInputChange("admission_no", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="room_id">Assigned Room</Label>
                                    <Select
                                        value={formData.room_id ? formData.room_id.toString() : "none"}
                                        onValueChange={(val) => handleInputChange("room_id", val === "none" ? undefined : parseInt(val))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Room Assigned</SelectItem>
                                            {rooms.map(r => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    {r.block} - Room {r.room_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course</Label>
                                    <Input
                                        id="course"
                                        placeholder="e.g. B.Tech CS"
                                        value={formData.course}
                                        onChange={(e) => handleInputChange("course", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Login Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </div>
                                {!editingId && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Login Password (Generated)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="password"
                                                type="text"
                                                placeholder="Initial password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleInputChange("password", generatePassword())}
                                                title="Regenerate Password"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone">Parent Phone</Label>
                                    <Input
                                        id="parent_phone"
                                        placeholder="Emergency contact"
                                        value={formData.parent_phone}
                                        onChange={(e) => handleInputChange("parent_phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Student"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Student Directory</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Comprehensive list of all registered residents</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Admission No</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block / Room</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-slate-400">Loading directory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No students matching your search.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8 font-mono text-[11px] font-black text-slate-400 uppercase tracking-wider">{student.admission_no}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                                    {student.profiles?.avatar_url ? (
                                                        <img src={student.profiles.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-400">{student.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-700">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0f172a]">{student.rooms?.room_number || "Unassigned"}</span>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{student.rooms?.block || "No Block"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-slate-500 font-medium">{student.parent_phone || "-"}</td>
                                        <td className="py-5 px-6">
                                            <span
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${student.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(student)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\mess\MessAttendance.tsx

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import { QrCode, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { messService, MessAttendance as IMessAttendance } from "@/services/messService";

const MessAttendance = () => {
    const [logs, setLogs] = useState<IMessAttendance[]>([]);
    const [studentId, setStudentId] = useState("");
    const [selectedMeal, setSelectedMeal] = useState<"Breakfast" | "Lunch" | "Snacks" | "Dinner">("Breakfast");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadAttendance = useCallback(async () => {
        try {
            const data = await messService.fetchAttendance();
            setLogs(data);
        } catch (error) {
            console.error("Failed to load attendance:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Set default meal based on current time
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setSelectedMeal("Breakfast");
        else if (hour < 16) setSelectedMeal("Lunch");
        else if (hour < 19) setSelectedMeal("Snacks");
        else setSelectedMeal("Dinner");

        loadAttendance();
    }, [loadAttendance]);

    const handleMarkAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputId = studentId.trim();
        if (!inputId) {
            toast.error("Please enter a Student ID");
            return;
        }

        try {
            setIsSubmitting(true);
            await messService.markAttendance(inputId, selectedMeal);
            toast.success(`Attendance marked for ${inputId}`);
            setStudentId("");
            loadAttendance(); // Refresh list
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to mark attendance. Check if ID is correct.";
            console.error("Failed to mark attendance:", error);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Meal Attendance"
                description="Mark and track student meal attendance"
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Attendance Marking Section */}
                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5 text-primary" />
                            Mark Attendance
                        </CardTitle>
                        <CardDescription>Enter Admission Number to mark attendance manually</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Meal</label>
                                <Select
                                    value={selectedMeal}
                                    onValueChange={(val: "Breakfast" | "Lunch" | "Snacks" | "Dinner") => setSelectedMeal(val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                                        <SelectItem value="Lunch">Lunch</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                        <SelectItem value="Dinner">Dinner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Admission Number</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. ADM2024001"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        autoFocus
                                        disabled={isSubmitting}
                                    />
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark"}
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-2 text-center text-[10px] text-muted-foreground bg-muted/30 p-2 rounded-lg border border-dashed">
                                <p>Ensure the ID matches the admission number in records.</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-accent" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest attendance logs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : logs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4 italic text-sm">No activity recorded for today.</p>
                            ) : (
                                logs.slice(0, 5).map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-success/10 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{log.students?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                                    {log.meal_type} â€¢ {log.students?.admission_no}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            {new Date(log.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full Logs Table */}
            <Card className="shadow-card border-border overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg">Daily Attendance History</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[120px]">Time</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Admission No</TableHead>
                                <TableHead>Meal</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                                        No logs found in the database.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium text-xs">
                                            {new Date(log.marked_at).toLocaleDateString()} {new Date(log.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell className="font-bold">{log.students?.name || "System Record"}</TableCell>
                                        <TableCell className="text-muted-foreground">{log.students?.admission_no || "-"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.meal_type === 'Breakfast' ? 'bg-blue-100 text-blue-700' :
                                                    log.meal_type === 'Lunch' ? 'bg-orange-100 text-orange-700' :
                                                        log.meal_type === 'Snacks' ? 'bg-pink-100 text-pink-700' :
                                                            'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {log.meal_type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase">
                                                Verified
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default MessAttendance;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\mess\MessComplaints.tsx

import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { complaintService, Complaint } from "@/services/complaintService";
import { supabase } from "@/lib/supabase";

const MessComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [complaintIdToDelete, setComplaintIdToDelete] = useState<number | null>(null);

    const loadComplaints = useCallback(async () => {
        try {
            setIsLoading(true);
            const allComplaints = await complaintService.fetchComplaints();
            // Filter for 'Mess' or 'Other' (assuming 'Other' is often used for mess if 'Mess' category is new)
            const messComplaints = allComplaints.filter(c => 
                c.category?.toLowerCase() === 'mess' || 
                c.category?.toLowerCase() === 'other'
            );
            setComplaints(messComplaints);
        } catch (error) {
            console.error("Error loading complaints:", error);
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComplaints();

        const channel = supabase
            .channel('mess_complaints_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
                loadComplaints();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadComplaints]);

    const handleResolve = async () => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        if (selectedComplaint) {
            try {
                // We're using the status update, but in the future we might want to store the response too
                // For now, we'll just update the status to 'Resolved'
                await complaintService.updateComplaintStatus(selectedComplaint.id, 'Resolved');

                toast.success("Complaint resolved successfully");
                setSelectedComplaint(null);
                setResponseText("");
                loadComplaints(); // Reload
            } catch (error) {
                console.error("Failed to resolve complaint:", error);
                toast.error("Failed to resolve complaint");
            }
        }
    };

    const handleDelete = async () => {
        if (!complaintIdToDelete) return;

        try {
            const { error } = await complaintService.deleteComplaint(complaintIdToDelete);
            if (error) throw error;
            
            toast.success("Complaint deleted successfully");
            loadComplaints();
        } catch (error: unknown) {
            console.error("Failed to delete complaint:", error);
            const errorMessage = error instanceof Error ? error.message : "Unauthorized";
            toast.error(`Delete failed: ${errorMessage}`);
        } finally {
            setIsDeleteDialogOpen(false);
            setComplaintIdToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading mess complaints...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Complaints"
                description="View and respond to student feedback"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {complaints.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                        No mess-related complaints found.
                    </div>
                ) : (
                    complaints.map((complaint) => (
                        <Card key={complaint.id} className="flex flex-col shadow-card border-border hover:shadow-elevated transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="overflow-hidden">
                                        <CardTitle className="text-base truncate">{complaint.students?.name || "Unknown Student"}</CardTitle>
                                        <CardDescription className="text-xs truncate">Room: {complaint.students?.rooms?.room_number || "N/A"}</CardDescription>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${complaint.status === "Resolved"
                                        ? "bg-success/10 text-success"
                                        : complaint.status === "In Progress"
                                            ? "bg-info/10 text-info"
                                            : "bg-warning/10 text-warning"
                                        }`}>
                                        {complaint.status}
                                    </div>
                                </div>
                                <CardDescription className="text-[10px] mt-1">
                                    {new Date(complaint.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="font-semibold text-sm mb-1">{complaint.title}</p>
                                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0 gap-2">
                                {complaint.status !== "Resolved" ? (
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedComplaint(complaint)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" /> Reply
                                    </Button>
                                ) : (
                                    <div className="flex items-center justify-center flex-1 text-sm text-success font-medium">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Resolved
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setComplaintIdToDelete(complaint.id);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                    title="Delete Complaint"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Respond to Complaint</DialogTitle>
                        <DialogDescription>
                            Review the student's complaint and provide a resolution response.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-muted rounded-md text-sm border border-border">
                            <p className="font-semibold mb-1 text-primary">{selectedComplaint?.students?.name}:</p>
                            <p className="font-medium mb-1">{selectedComplaint?.title}</p>
                            <p className="text-muted-foreground">{selectedComplaint?.description}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Internal Note / Response</label>
                            <Textarea
                                placeholder="Typing a response will mark the complaint as resolved..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResolve}>Mark as Resolved</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this complaint? This will permanently remove the record from the database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessComplaints;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\mess\MessDashboard.tsx

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { UtensilsCrossed, Users, Package, MessageSquareWarning, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { messService, MessInventory } from "@/services/messService";
import { studentService } from "@/services/studentService";
import { complaintService } from "@/services/complaintService";
import { supabase } from "@/lib/supabase";

const stockStatus: Record<string, string> = {
  Good: "bg-success/10 text-success",
  Low: "bg-warning/10 text-warning",
  Critical: "bg-destructive/10 text-destructive",
};

const MessDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<MessInventory[]>([]);
  const [stats, setStats] = useState({
    expectedMeals: 0,
    totalStudents: 0,
    inventoryCount: 0,
    lowStockCount: 0,
    pendingComplaints: 0,
    newComplaints: 0
  });
  interface AttendanceChartData {
    meal: string;
    present: number;
    absent: number;
  }
  const [attendanceData, setAttendanceData] = useState<AttendanceChartData[]>([]);

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);

      // 1. Fetch Students
      const students = await studentService.fetchStudents();
      const activeStudents = students.filter(s => s.status === 'Active').length;

      // 2. Fetch Inventory
      const invData = await messService.fetchInventory();
      const lowStock = invData.filter(item => item.threshold && item.quantity <= item.threshold).length;

      // 3. Fetch Complaints
      const complaints = await complaintService.fetchComplaints();
      const messComplaints = complaints.filter(c => 
        c.category?.toLowerCase() === 'mess' || 
        c.category?.toLowerCase() === 'other'
      );
      const pending = messComplaints.filter(c => c.status === 'Pending').length;
      const recent = messComplaints.filter(c => {
        const createdDate = new Date(c.created_at);
        const now = new Date();
        return (now.getTime() - createdDate.getTime()) < 24 * 60 * 60 * 1000;
      }).length;

      setInventory(invData);
      setStats({
        expectedMeals: activeStudents * 3, // 3 meals per active student
        totalStudents: activeStudents,
        inventoryCount: invData.length,
        lowStockCount: lowStock,
        pendingComplaints: pending,
        newComplaints: recent
      });

      // 4. Generate Chart Data based on actual occupancy
      const total = activeStudents;
      setAttendanceData([
        { meal: "Breakfast", present: total > 0 ? Math.floor(total * 0.8) : 0, absent: total > 0 ? Math.ceil(total * 0.2) : 0 },
        { meal: "Lunch", present: total > 0 ? Math.floor(total * 0.9) : 0, absent: total > 0 ? Math.ceil(total * 0.1) : 0 },
        { meal: "Snacks", present: total > 0 ? Math.floor(total * 0.7) : 0, absent: total > 0 ? Math.ceil(total * 0.3) : 0 },
        { meal: "Dinner", present: total > 0 ? Math.floor(total * 0.85) : 0, absent: total > 0 ? Math.ceil(total * 0.15) : 0 },
      ]);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);

    // Real-time subscriptions
    const inventoryChannel = supabase
      .channel('mess_dashboard_inv')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_inventory' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const complaintsChannel = supabase
      .channel('mess_dashboard_comp')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const studentsChannel = supabase
      .channel('mess_dashboard_stud')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(complaintsChannel);
      supabase.removeChannel(studentsChannel);
    };
  }, [fetchDashboardData]);

  const getStatusLabel = (item: MessInventory) => {
    if (!item.threshold) return "Good";
    if (item.quantity <= item.threshold * 0.5) return "Critical";
    if (item.quantity <= item.threshold) return "Low";
    return "Good";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium text-lg">Syncing kitchen data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 lg:p-4 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Mess Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Real-time <span className="text-orange-600 font-bold">Kitchen Operations</span> oversight.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 uppercase tracking-widest shadow-sm">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Kitchen Live
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Estimated Meals"
          value={stats.expectedMeals.toLocaleString()}
          icon={<UtensilsCrossed className="w-6 h-6" />}
          color="primary"
          trend="Projected for today"
          trendUp
        />
        <StatCard
          title="Active Diners"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6" />}
          trend="Registered students"
          trendUp
          color="accent"
        />
        <StatCard
          title="Pantry Items"
          value={stats.inventoryCount}
          icon={<Package className="w-6 h-6" />}
          trend={`${stats.lowStockCount} items low stock`}
          trendUp={false}
          color="info"
        />
        <StatCard
          title="Mess Feedback"
          value={stats.pendingComplaints}
          icon={<MessageSquareWarning className="w-6 h-6" />}
          trend={`${stats.newComplaints} new today`}
          trendUp={false}
          color="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance chart */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0f172a]">Meal Attendance Forecast</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Expected daily turnout analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="meal" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{payload[0].payload.meal}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-bold flex items-center justify-between gap-4">
                            <span className="text-emerald-400">Expected:</span>
                            <span className="font-black">{payload[0].value}</span>
                          </p>
                          <p className="text-sm font-bold flex items-center justify-between gap-4">
                            <span className="text-slate-400">Opt-out:</span>
                            <span className="font-black">{payload[1].value}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="present" fill="#10b981" radius={[6, 6, 6, 6]} barSize={32} />
              <Bar dataKey="absent" fill="#f1f5f9" radius={[6, 6, 6, 6]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Expected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Opt-out</span>
            </div>
          </div>
        </motion.div>

        {/* Inventory Status List */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">Pantry Inventory</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Current stock levels</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
              Live Tracker
            </div>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[420px]">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-50">
                  <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Item Identifier</th>
                  <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                  <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center text-slate-400 font-bold italic">No kitchen items registered.</td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const status = getStatusLabel(item);
                    return (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 px-8">
                          <span className="text-base font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{item.item_name}</span>
                        </td>
                        <td className="py-5 px-6 font-black text-slate-900">
                          {item.quantity} <span className="text-[10px] text-slate-400 uppercase font-black">{item.unit}</span>
                        </td>
                        <td className="py-5 px-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${stockStatus[status]}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MessDashboard;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\mess\MessInventory.tsx

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, AlertTriangle, Trash2, Loader2, Package } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { messService, MessInventory as IMessInventory } from "@/services/messService";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const MessInventory = () => {
    const [inventory, setInventory] = useState<IMessInventory[]>([]);
    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] = useState<IMessInventory | null>(null);
    const [itemToDelete, setItemToDelete] = useState<IMessInventory | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        item_name: "",
        quantity: 0,
        unit: "kg",
        threshold: 0,
    });

    useEffect(() => {
        loadInventory();

        const channel = supabase
            .channel('mess_inventory_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_inventory' }, () => {
                loadInventory();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadInventory = async () => {
        try {
            setIsLoading(true);
            const data = await messService.fetchInventory();
            setInventory(data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInventory = inventory.filter((item) =>
        item.item_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = (item: IMessInventory) => {
        setEditingItem(item);
        setFormData({
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            threshold: item.threshold || 0,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            setIsSubmitting(true);
            await messService.deleteInventoryItem(itemToDelete.id);
            toast.success(`${itemToDelete.item_name} deleted`);
            loadInventory();
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete item:", error);
            toast.error("Failed to delete item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.item_name) {
            toast.error("Item Name is required");
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingItem) {
                await messService.updateInventoryItem(editingItem.id, formData);
                toast.success("Item updated successfully");
            } else {
                await messService.addInventoryItem(formData);
                toast.success("Item added successfully");
            }
            loadInventory();
            setIsDialogOpen(false);
            setEditingItem(null);
            setFormData({ item_name: "", quantity: 0, unit: "kg", threshold: 0 });
        } catch (error) {
            console.error("Failed to save item:", error);
            toast.error("Failed to save item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddDialog = () => {
        setEditingItem(null);
        setFormData({ item_name: "", quantity: 0, unit: "kg", threshold: 0 });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Food Inventory"
                description="Manage kitchen stock levels and thresholds"
            />

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm"
            >
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search pantry items..."
                        className="pl-10 bg-muted/20 border-border focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={openAddDialog} className="w-full sm:w-auto shadow-elevated transition-transform hover:scale-105 active:scale-95">
                    <Plus className="h-4 w-4 mr-2" /> Add New Item
                </Button>
            </motion.div>

            {/* Dialog for Add/Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Enter the details for the mess inventory item including stock levels and threshold.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="item_name">Item Name</Label>
                            <Input
                                id="item_name"
                                placeholder="e.g. Basmati Rice"
                                value={formData.item_name}
                                onChange={(e) => handleInputChange("item_name", e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Stock Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.1"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value))}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <select
                                    id="unit"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.unit}
                                    onChange={(e) => handleInputChange("unit", e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="kg">kg</option>
                                    <option value="litres">litres</option>
                                    <option value="packets">packets</option>
                                    <option value="units">units</option>
                                    <option value="bags">bags</option>
                                    <option value="tins">tins</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="threshold" className="flex items-center gap-2 text-warning">
                                <AlertTriangle className="w-3 h-3" />
                                Alert Threshold
                            </Label>
                            <Input
                                id="threshold"
                                type="number"
                                step="0.1"
                                placeholder="Notify if below..."
                                value={formData.threshold}
                                onChange={(e) => handleInputChange("threshold", parseFloat(e.target.value))}
                                disabled={isSubmitting}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingItem ? "Update Item" : "Save Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for Delete */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {itemToDelete?.item_name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the item from your inventory logs.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Item Name</TableHead>
                            <TableHead className="font-bold">Total Stock</TableHead>
                            <TableHead className="font-bold">Min Threshold</TableHead>
                            <TableHead className="font-bold">Health Status</TableHead>
                            <TableHead className="font-bold">Last Restocked</TableHead>
                            <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground animate-pulse">Scanning inventory...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredInventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">
                                    {search ? `No items matching "${search}"` : "Pantry is empty. Start adding items!"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            <AnimatePresence>
                                {filteredInventory.map((item, index) => {
                                    const isLowStock = item.quantity <= (item.threshold || 0);
                                    const isCritical = item.quantity <= ((item.threshold || 0) * 0.5);

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-muted/30 transition-colors"
                                        >
                                            <TableCell className="font-bold text-base">{item.item_name}</TableCell>
                                            <TableCell className="text-base">
                                                <span className={isCritical ? 'text-destructive font-black' : isLowStock ? 'text-warning font-bold' : ''}>
                                                    {item.quantity}
                                                </span>
                                                <span className="text-[10px] ml-1 text-muted-foreground uppercase">{item.unit}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.threshold} <span className="text-[10px] uppercase">{item.unit}</span>
                                            </TableCell>
                                            <TableCell>
                                                {isCritical ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-bold text-[10px] border border-destructive/20 animate-pulse">
                                                        <AlertTriangle className="h-3 w-3" /> CRITICAL
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning font-bold text-[10px] border border-warning/20">
                                                        <AlertTriangle className="h-3 w-3" /> LOW STOCK
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success font-bold text-[10px] border border-success/20">
                                                        HEALTHY
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {item.last_updated ? new Date(item.last_updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => setItemToDelete(item)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MessInventory;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\mess\MessMenu.tsx

import AdminMenu from "@/pages/admin/AdminMenu";

const MessMenu = () => {
    return <AdminMenu />;
};

export default MessMenu;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentAttendance.tsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { messService, MessAttendance } from "@/services/messService";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Utensils, Calendar, Clock, CheckCircle2, Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const StudentAttendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<MessAttendance[]>([]);
    const [studentData, setStudentData] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadAttendance = useCallback(async () => {
        try {
            if (!user) return;
            setIsLoading(true);

            // 1. Get student ID from profile (Proactive check)
            const student = await studentService.getStudentByProfileId(user.id);
            
            if (student) {
                setStudentData(student);
                console.log("Student record found:", student.id);
                // 2. Fetch specific student attendance
                const data = await messService.fetchAttendanceByStudentId(student.id);
                setAttendance(data);
            } else {
                console.warn("No student record linked to profile ID:", user.id);
            }
        } catch (error) {
            console.error("Failed to load attendance:", error);
            toast.error("Failed to load attendance history");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadAttendance();

        // Add real-time listener
        const channel = supabase
            .channel('student-attendance-changes')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'mess_attendance' }, 
                () => {
                    loadAttendance(); // Refresh when any new attendance is marked
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadAttendance]);

    const filteredAttendance = attendance.filter(item => 
        item.meal_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(item.marked_at).toLocaleDateString().includes(searchTerm)
    );

    // Calculate Analytics (Full History - Real Data)
    const today = new Date();
    const joinDate = studentData?.created_at ? new Date(studentData.created_at) : today;
    
    // Difference in days
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const daysSinceJoining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    const expectedTotal = daysSinceJoining * 3; // 3 meals per day
    const presentCount = attendance.filter(a => 
        ['Breakfast', 'Lunch', 'Dinner'].includes(a.meal_type)
    ).length;
    const absentCount = Math.max(0, expectedTotal - presentCount);

    const getMealIcon = (type: string) => {
        switch(type) {
            case 'Breakfast': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'Lunch': return <Utensils className="w-4 h-4 text-green-500" />;
            case 'Snacks': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Dinner': return <Utensils className="w-4 h-4 text-purple-500" />;
            default: return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Attendance"
                description="Your personal record of meals taken in the mess"
            />

            {/* Analytics Summary Cards (Requested Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <p className="text-xl font-medium text-slate-800">Total</p>
                    <h3 className="text-4xl font-black text-blue-800">{expectedTotal}</h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-xl font-medium text-slate-800">Present</p>
                    </div>
                    <h3 className="text-4xl font-black text-green-600">{presentCount}</h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center">
                            <span className="text-red-500 font-bold text-xl">âœ•</span>
                        </div>
                        <p className="text-xl font-medium text-slate-800">Absent</p>
                    </div>
                    <h3 className="text-4xl font-black text-red-600 underline decoration-red-200 underline-offset-8">{absentCount}</h3>
                </motion.div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-black text-slate-900">Attendance History</h3>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search meals or dates..." 
                            className="pl-9 bg-slate-50 border-none rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Meal Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Info className="w-8 h-8 text-slate-200" />
                                            <p className="text-slate-400 font-medium italic">No attendance records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((record, index) => (
                                    <motion.tr 
                                        key={record.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    {getMealIcon(record.meal_type)}
                                                </div>
                                                <span className="font-bold text-slate-700">{record.meal_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {new Date(record.marked_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium tabular-nums">
                                            {new Date(record.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">
                                                Present
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentComplaints.tsx

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { complaintService, Complaint } from "@/services/complaintService";
import { studentService, Student } from "@/services/studentService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  "In Progress": "bg-info/10 text-info",
  Resolved: "bg-success/10 text-success",
};

const StudentComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Other" as Complaint['category'],
    description: "",
    priority: "Medium" as Complaint['priority'],
  });

  const loadStudentAndComplaints = useCallback(async () => {
    try {
      if (!user) return;

      // 1. Get Student Profile linked to User
      const student = await studentService.getStudentByProfileId(user.id);
      setStudentProfile(student);

      if (student) {
        // Fetch only this student's complaints
        const myComplaints = await complaintService.fetchComplaintsByStudentId(student.id);
        setComplaints(myComplaints);
      } else {
        setComplaints([]);
      }

    } catch (error) {
      console.error("Error loading complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStudentAndComplaints();
    }
  }, [user, loadStudentAndComplaints]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!studentProfile) {
      toast.error("Student profile not found. Cannot submit complaint.");
      return;
    }

    try {
      await complaintService.createComplaint({
        student_id: studentProfile.id,
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        status: 'Pending',
      });

      toast.success("Complaint submitted successfully");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        category: "Other",
        description: "",
        priority: "Medium",
      });
      loadStudentAndComplaints(); // Reload
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      toast.error("Failed to submit complaint");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading complaints...</div>;
  }

  return (
    <div>
      <PageHeader
        title="My Complaints"
        description="Submit and track your complaints"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!studentProfile}><Plus className="w-4 h-4 mr-2" />New Complaint</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Complaint</DialogTitle>
                <DialogDescription>
                  Please provide details about the issue you are facing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Subject</Label>
                  <Input
                    id="title"
                    placeholder="e.g. AC not working"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => handleInputChange("category", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                        <SelectItem value="Mess">Mess</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => handleInputChange("priority", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Complaint</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12 px-4 text-muted-foreground bg-card rounded-xl border border-dashed">
            {studentProfile ? (
              "No complaints found. Everything seems good!"
            ) : (
              <div className="space-y-3">
                <p className="text-destructive font-medium">Student profile not linked!</p>
                <p className="text-xs max-w-xs mx-auto">
                  Your user account is not yet linked to a student record.
                  Please ask the administrator to add your email ({user?.email}) in the student management section.
                </p>
                <Button variant="outline" size="sm" onClick={() => loadStudentAndComplaints()}>
                  Check Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          complaints.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{c.title}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{c.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.priority === 'High' ? 'bg-red-100 text-red-700' :
                      c.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                      {c.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted: {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[c.status]}`}>{c.status}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentComplaints;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentDashboard.tsx

import PageHeader from "@/components/PageHeader";
import { BedDouble, UtensilsCrossed, CreditCard, FileText, Clock, ArrowUpRight, DollarSign, Users, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { messService, MessMenu } from "@/services/messService";
import { studentService, Student } from "@/services/studentService";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useCallback } from "react";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [menuData, sData] = await Promise.all([
        messService.fetchMenu(),
        user?.id ? studentService.getStudentByProfileId(user.id) : null
      ]);
      setMenu(menuData);
      setStudentData(sData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
    const subscription = supabase
      .channel('mess_menu_changes_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_menu' }, () => {
        loadData();
      })
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [user?.id, loadData]);

  const getMenuItems = (day: string, meal: string) => {
    return menu?.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
  };

  return (
    <div className="p-2 lg:p-4 space-y-8 animate-in fade-in duration-700">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, <span className="text-orange-600 font-bold">{user?.name}</span> ðŸ‘‹ 
            <span className="hidden sm:inline"> Here's what's happening in your hostel.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Live
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Room Allocation",
            value: studentData?.rooms?.room_number || "Unassigned",
            sub: studentData?.rooms?.block ? `Block ${studentData.rooms.block}` : "Waiting allocation",
            icon: BedDouble,
            gradient: "from-blue-500 to-blue-600",
            lightBg: "bg-blue-50",
            textColor: "text-blue-600"
          },
          {
            title: "Mess Status",
            value: studentData?.status === "Active" ? "Active" : "Inactive",
            sub: "Daily meal service enabled",
            icon: UtensilsCrossed,
            gradient: "from-orange-500 to-orange-600",
            lightBg: "bg-orange-50",
            textColor: "text-orange-600"
          },
          {
            title: "Admission Number",
            value: studentData?.admission_no || "N/A",
            sub: studentData?.course || "Course not assigned",
            icon: FileText,
            gradient: "from-purple-500 to-purple-600",
            lightBg: "bg-purple-50",
            textColor: "text-purple-600"
          },
          {
            title: "Profile Status",
            value: "Verified",
            sub: "All documents approved",
            icon: Activity,
            gradient: "from-emerald-500 to-emerald-600",
            lightBg: "bg-emerald-50",
            textColor: "text-emerald-600"
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.lightBg} ${card.textColor} group-hover:bg-gradient-to-br ${card.gradient} group-hover:text-white transition-all duration-300`}>
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
                {isLoading ? (
                  <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
                ) : card.value}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
                {isLoading ? "Loading..." : card.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content: Menu Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
          <div>
            <h3 className="text-xl font-bold text-[#0f172a]">Weekly Mess Menu</h3>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Stay updated with the latest meal schedule</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/20">
            <Clock className="w-4 h-4" />
            Updated Weekly
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left py-5 px-8 text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-200">Day</th>
                <th className="text-left py-5 px-6 text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-200">Breakfast</th>
                <th className="text-left py-5 px-6 text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-200">Lunch</th>
                <th className="text-left py-5 px-6 text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-200">Dinner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-400">Loading Menu Schedule...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                days.map((day, idx) => {
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                  return (
                    <tr 
                      key={day} 
                      className={`group transition-colors ${isToday ? "bg-orange-50/30" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          {isToday && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />}
                          <span className={`text-base font-bold ${isToday ? "text-orange-600" : "text-slate-700"}`}>
                            {day}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                          {getMenuItems(day, 'Breakfast')}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                          {getMenuItems(day, 'Lunch')}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                          {getMenuItems(day, 'Dinner')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentLeaves.tsx

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { leafService, Leaf } from "@/services/leafService";
import { studentService, Student } from "@/services/studentService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Approved: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

const StudentLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "Leave" as Leaf['type'],
    reason: "",
    start_date: "",
    end_date: "",
  });

  const loadStudentAndLeaves = useCallback(async () => {
    try {
      if (!user) return;

      const student = await studentService.getStudentByProfileId(user.id);
      setStudentProfile(student);

      if (student) {
        const myLeaves = await leafService.fetchLeavesByStudentId(student.id);
        setLeaves(myLeaves);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error("Failed to load leaves:", error);
      toast.error("Failed to load leave requests");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStudentAndLeaves();
    }
  }, [user, loadStudentAndLeaves]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!studentProfile || !user) {
      toast.error("Student profile not found. Cannot apply for leave.");
      return;
    }

    try {
      await leafService.createLeaf({
        student_id: studentProfile.id,
        user_id: user.id,
        type: formData.type,
        reason: formData.reason,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),

      });

      toast.success("Leave application submitted");
      setIsDialogOpen(false);
      setFormData({
        type: "Leave",
        reason: "",
        start_date: "",
        end_date: "",
      });
      loadStudentAndLeaves();
    } catch (error) {
      console.error("Failed to submit leave:", error);
      toast.error("Failed to submit leave application");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading leaves...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Leave Requests"
        description="Manage your leave applications"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!studentProfile}><Plus className="w-4 h-4 mr-2" />Apply Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Enter the dates and reason for your leave or outing request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => handleInputChange("type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leave">Leave</SelectItem>
                      <SelectItem value="Outing">Outing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">From Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange("start_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">To Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange("end_date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Reason for leave/outing..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Application</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4">
        {leaves.length === 0 ? (
          <div className="text-center py-12 px-4 text-muted-foreground bg-card rounded-xl border border-dashed">
            {studentProfile ? (
              "No leave requests found."
            ) : (
              <div className="space-y-3">
                <p className="text-destructive font-medium">Student profile not linked!</p>
                <p className="text-xs max-w-xs mx-auto">
                  Your user account is not yet linked to a student record.
                  Please ask the administrator to add your email ({user?.email}) in the student management section.
                </p>
                <Button variant="outline" size="sm" onClick={() => loadStudentAndLeaves()}>
                  Check Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          leaves.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{l.reason}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{l.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(l.start_date).toLocaleDateString()} â†’ {new Date(l.end_date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentLeaves;



---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentMenu.tsx

import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { messService, MessMenu } from "@/services/messService";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentMenu = () => {
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMenu = async () => {
    try {
      const data = await messService.fetchMenu();
      setMenu(data);
    } catch (error) {
      console.error("Failed to load menu:", error);
      toast.error("Failed to load mess menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('mess_menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mess_menu'
        },
        (payload) => {
          loadMenu();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getMenuItems = (day: string, meal: string) => {
    return menu.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu...</div>;
  }

  return (
    <div>
      <PageHeader title="Mess Menu" description="Weekly mess menu schedule" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">Day</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">ðŸŒ… Breakfast</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">â˜€ï¸ Lunch</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">ðŸŒ™ Dinner</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">â˜• Snacks</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-5 px-6 font-semibold text-lg">{day}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Breakfast')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Lunch')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Dinner')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Snacks')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentMenu;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentPayments.tsx

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Download, Loader2, CheckCircle2, ChevronDown, Share2, Plus, Info, ShieldCheck, User, QrCode, Clock, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService, Payment } from "@/services/paymentService";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const StudentPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [paymentOutcome, setPaymentOutcome] = useState<'Success' | 'Pending' | 'Rejected'>('Success');
  const [timeLeft, setTimeLeft] = useState(30);
  const [pendingPayment, setPendingPayment] = useState<Payment | null>(null);

  const handlePayNow = () => {
    if (!pendingPayment) {
      toast.info("You have no pending payments at this time.");
      return;
    }
    setIsScannerOpen(true);
    setTimeLeft(30);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isScannerOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isScannerOpen && timeLeft === 0) {
      setIsScannerOpen(false);
      
      // Determine outcome (Randomized for demo purposes as requested)
      const outcomes: ('Success' | 'Pending' | 'Rejected')[] = ['Success', 'Pending', 'Rejected'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setPaymentOutcome(randomOutcome);
      setIsOutcomeModalOpen(true);
    }
    return () => clearInterval(timer);
  }, [isScannerOpen, timeLeft]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        if (!user) return;

        const student = await studentService.getStudentByProfileId(user.id);
        
        if (student) {
          const [allPayments, currentPending] = await Promise.all([
            paymentService.fetchPayments(),
            paymentService.getPendingPaymentForStudent(student.id)
          ]);
          
          const myPayments = allPayments.filter(p => p.student_id === student.id);
          setPayments(myPayments);
          setPendingPayment(currentPending);
        } else {
          setPayments([]);
          setPendingPayment(null);
        }
      } catch (error) {
        console.error("Failed to load payments:", error);
        toast.error("Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPayments();
    }
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading payments...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="View and manage your fee payments"
        action={<Button onClick={handlePayNow}><CreditCard className="w-4 h-4 mr-2" />Pay Now</Button>}
      />

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">No payment history found.</td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-6 font-medium">{p.type}</td>
                    <td className="py-3 px-6">â‚¹{p.amount.toLocaleString()}</td>
                    <td className="py-3 px-6 text-muted-foreground">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "Paid" ? "bg-success/10 text-success" :
                        p.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {p.status === "Paid" ? (
                        <button className="flex items-center gap-1 text-primary hover:underline text-xs">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      ) : "-"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Payment Scanner Modal - Simplified to show only QR */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-xs p-6 bg-white border-none shadow-3xl rounded-[32px] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Payment Scanner</DialogTitle>
            <DialogDescription>Use your UPI app to scan and pay the current fee.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">Scan to Pay</h3>
              {pendingPayment && (
                <p className="text-primary font-bold text-lg">â‚¹{pendingPayment.amount.toLocaleString()}</p>
              )}
            </div>

            {/* Payment QR Image Display */}
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-100 transition-all duration-500 hover:scale-[1.05]">
              <div className="w-full max-w-[280px] aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/payment-qr.png" 
                  alt="Payment QR" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const amount = pendingPayment?.amount || 0;
                    const upiId = "shaik.mubeen@upi"; // Placeholder
                    const studentName = user?.name || "Student";
                    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(studentName)}&am=${amount}&cu=INR`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x350&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=000000`;
                    
                    e.currentTarget.src = qrUrl;
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            </div>

            {/* Timer and Instructions */}
            <div className="text-center space-y-4 w-full">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment active...</p>
              
              <div className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <p className="text-sm font-bold text-slate-600">Completing in <span className="text-slate-900 font-black tabular-nums">{timeLeft}s</span></p>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setIsScannerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Outcome Modal */}
      <Dialog open={isOutcomeModalOpen} onOpenChange={setIsOutcomeModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-3xl p-0 overflow-hidden rounded-[32px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Payment {paymentOutcome}</DialogTitle>
            <DialogDescription>Details regarding your transaction result.</DialogDescription>
          </DialogHeader>
          
          <div className={`p-8 text-center bg-gradient-to-b ${
            paymentOutcome === 'Success' ? 'from-emerald-50' : 
            paymentOutcome === 'Pending' ? 'from-amber-50' : 'from-red-50'
          } to-white`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                paymentOutcome === 'Success' ? 'bg-emerald-100 shadow-emerald-500/20' : 
                paymentOutcome === 'Pending' ? 'bg-amber-100 shadow-amber-500/20' : 'bg-red-100 shadow-red-500/20'
              }`}
            >
              {paymentOutcome === 'Success' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
              {paymentOutcome === 'Pending' && <Clock className="w-12 h-12 text-amber-500 animate-pulse" />}
              {paymentOutcome === 'Rejected' && <XCircle className="w-12 h-12 text-red-500" />}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                {paymentOutcome === 'Success' ? 'Congratulations!' : 
                 paymentOutcome === 'Pending' ? 'Payment Pending' : 'Payment Failed'}
              </h2>
              <p className="text-slate-500 font-medium mb-8 px-4">
                {paymentOutcome === 'Success' && (
                  <>Your payment of <span className="text-slate-900 font-bold">â‚¹{(pendingPayment?.amount || 0).toLocaleString()}</span> has been successfully processed. The receipt is now available.</>
                )}
                {paymentOutcome === 'Pending' && (
                  <>We are verifying your transaction with the bank. Please check back in a few minutes to confirm your status.</>
                )}
                {paymentOutcome === 'Rejected' && (
                  <>Unfortunately, the transaction could not be completed at this time. Please try again or use a different payment method.</>
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button 
                onClick={() => setIsOutcomeModalOpen(false)} 
                className={`w-full h-14 text-white rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] ${
                  paymentOutcome === 'Success' ? 'bg-slate-900 shadow-slate-900/10' : 
                  paymentOutcome === 'Pending' ? 'bg-amber-600 shadow-amber-600/10' : 'bg-red-600 shadow-red-600/10'
                }`}
              >
                {paymentOutcome === 'Rejected' ? 'Try Again' : 'Continue Flow'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsOutcomeModalOpen(false)}
                className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                View Transaction History
              </Button>
            </motion.div>
          </div>
          
          {/* Decorative circles with dynamic colors */}
          <div className={`absolute top-0 left-0 w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2 ${
            paymentOutcome === 'Success' ? 'bg-emerald-400/10' : 
            paymentOutcome === 'Pending' ? 'bg-amber-400/10' : 'bg-red-400/10'
          }`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-1/3 translate-y-1/3 ${
            paymentOutcome === 'Success' ? 'bg-blue-400/10' : 
            paymentOutcome === 'Pending' ? 'bg-amber-400/10' : 'bg-red-400/10'
          }`} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPayments;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\pages\student\StudentRoom.tsx

import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { BedDouble, Wifi, Wind, Bath } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService, Student } from "@/services/studentService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StudentRoom = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!user?.id) return;
      try {
        const data = await studentService.getStudentByProfileId(user.id);
        setStudent(data);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
        toast.error("Failed to fetch room details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [user?.id]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading room details...</div>;
  }

  if (!student) {
    return (
      <div>
        <PageHeader title="My Room" description="Your hostel room details" />
        <div className="bg-card rounded-xl p-8 text-center border border-border">
          <h3 className="text-lg font-medium text-muted-foreground">Student record not found.</h3>
          <p className="text-sm text-muted-foreground mt-2">Please contact the admin to update your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Room" description="Your hostel room details" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-lg mb-4">Room Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Block</span>
              <span className="font-medium text-sm">{student.rooms?.block || "Not Assigned"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Room Number</span>
              <span className="font-medium text-sm">{student.rooms?.room_number || "Not Assigned"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Type</span>
              <span className="font-medium text-sm">Standard</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Admission No</span>
              <span className="font-medium text-sm">{student.admission_no}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-lg mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BedDouble, label: "Bed", available: !!student.rooms },
              { icon: Wifi, label: "Wi-Fi", available: true },
              { icon: Wind, label: "Air Conditioning", available: false }, // Assuming non-AC for now or need to fetch from room type
              { icon: Bath, label: "Attached Bathroom", available: false },
            ].map((a) => (
              <div key={a.label} className={`p-4 rounded-lg border ${a.available ? "bg-green-500/5 border-green-500/20" : "bg-muted border-border"}`}>
                <a.icon className={`w-5 h-5 mb-2 ${a.available ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium">{a.label}</p>
                <p className={`text-xs ${a.available ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>{a.available ? "Available" : "Not Available"}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRoom;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\blockService.ts

import { supabase } from "@/lib/supabase";

export interface Block {
    id: number;
    name: string;
    type: "Boys" | "Girls" | "Staff";
    floors: number;
    warden: string;
    contact: string;
}

export const blockService = {
    async fetchBlocks() {
        const { data, error } = await supabase
            .from("blocks")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return data as Block[];
    },

    async createBlock(block: Omit<Block, "id">) {
        const { data, error } = await supabase
            .from("blocks")
            .insert([block])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateBlock(id: number, updates: Partial<Block>) {
        const { data, error } = await supabase
            .from("blocks")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBlock(id: number) {
        const { error } = await supabase
            .from("blocks")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\complaintService.ts

import { supabase } from "@/lib/supabase";

export interface Complaint {
    id: number;
    student_id?: number;
    user_id?: string;
    title: string;
    description: string;
    category: 'Electrical' | 'Plumbing' | 'Furniture' | 'Cleanliness' | 'Mess' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Resolved';
    created_at: string;
    resolved_at?: string;
    students?: {
        name: string;
        room_id: number;
        profile_id?: string;
        rooms: {
            room_number: string;
            block: string;
        };
    };
}

export const complaintService = {
    async fetchComplaints() {
        const { data, error } = await supabase
            .from("complaints")
            .select(`
        *,
        students (
          name,
          room_id,
          profile_id,
          rooms (
            room_number,
            block
          )
        )
      `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Complaint[];
    },

    async fetchComplaintsByStudentId(studentId: number) {
        const { data, error } = await supabase
            .from("complaints")
            .select(`
        *,
        students (
          name,
          room_id,
          profile_id,
          rooms (
            room_number,
            block
          )
        )
      `)
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Complaint[];
    },

    async createComplaint(complaint: Omit<Complaint, "id" | "created_at" | "students" | "resolved_at">) {
        const { data, error } = await supabase
            .from("complaints")
            .insert([complaint])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateComplaintStatus(id: number, status: Complaint['status']) {
        const updates: { status: Complaint['status']; resolved_at?: string } = { status };
        if (status === 'Resolved') {
            updates.resolved_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("complaints")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteComplaint(id: number) {
        return await supabase
            .from("complaints")
            .delete()
            .eq("id", id);
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\leafService.ts

import { supabase } from "@/lib/supabase";

export interface Leaf {
    id: number;
    student_id: number;
    user_id: string;
    type: 'Outing' | 'Leave';
    reason: string;
    start_date: string; // ISO string
    end_date: string; // ISO string
    status: 'Pending' | 'Approved' | 'Rejected';
    created_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const leafService = {
    async fetchLeaves() {
        const { data, error } = await supabase
            .from("leaves")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Leaf[];
    },

    async fetchLeavesByStudentId(studentId: number) {
        const { data, error } = await supabase
            .from("leaves")
            .select("*, students(name, admission_no, rooms(room_number))")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Leaf[];
    },

    async createLeaf(leaf: Omit<Leaf, "id" | "status" | "created_at" | "students">) {
        const { data, error } = await supabase
            .from("leaves")
            .insert([leaf])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateLeafStatus(id: number, status: 'Approved' | 'Rejected') {
        const { data, error } = await supabase
            .from("leaves")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\messService.ts

import { supabase } from "@/lib/supabase";

export interface MessMenu {
    id: number;
    day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
    items: string;
}

export interface MessInventory {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    threshold?: number;
    last_updated?: string;
}

export interface MessAttendance {
    id: number;
    student_id: number;
    meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
    marked_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const messService = {
    async fetchAttendance() {
        const { data, error } = await supabase
            .from("mess_attendance")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("marked_at", { ascending: false });

        if (error) throw error;
        return data as MessAttendance[];
    },

    async fetchAttendanceByStudentId(studentId: number) {
        const { data, error } = await supabase
            .from("mess_attendance")
            .select("*")
            .eq("student_id", studentId)
            .order("marked_at", { ascending: false });

        if (error) throw error;
        return data as MessAttendance[];
    },

    async markAttendance(admissionNo: string, mealType: string) {
        // 1. Get student ID from admission number
        const { data: student, error: studentError } = await supabase
            .from("students")
            .select("id")
            .eq("admission_no", admissionNo)
            .single();

        if (studentError) throw new Error("Student not found");

        // 2. Check for existing attendance for this meal today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const { data: existing, error: checkError } = await supabase
            .from("mess_attendance")
            .select("id")
            .eq("student_id", student.id)
            .eq("meal_type", mealType)
            .gte("marked_at", startOfDay)
            .lte("marked_at", endOfDay)
            .maybeSingle();

        if (existing) {
            throw new Error(`Attendance for ${mealType} already marked for today!`);
        }

        // 3. Insert attendance record
        const { data, error } = await supabase
            .from("mess_attendance")
            .insert([{
                student_id: student.id,
                meal_type: mealType as 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner',
                marked_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async fetchMenu() {
        const { data, error } = await supabase
            .from("mess_menu")
            .select("*")
            .order("id"); // Ordering by ID assumes insertion order roughly matches week/meal or handled in UI

        if (error) throw error;
        return data as MessMenu[];
    },

    async updateMenu(day: string, meal: string, items: string) {
        const { data, error } = await supabase
            .from("mess_menu")
            .upsert({ day_of_week: day, meal_type: meal, items }, { onConflict: 'day_of_week, meal_type' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async fetchInventory() {
        const { data, error } = await supabase
            .from("mess_inventory")
            .select("*")
            .order("item_name");

        if (error) throw error;
        return data as MessInventory[];
    },

    async addInventoryItem(item: Omit<MessInventory, "id" | "last_updated">) {
        const { data, error } = await supabase
            .from("mess_inventory")
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateInventoryItem(id: number, updates: Partial<MessInventory>) {
        const { data, error } = await supabase
            .from("mess_inventory")
            .update({ ...updates, last_updated: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteInventoryItem(id: number) {
        const { error } = await supabase
            .from("mess_inventory")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\paymentService.ts

import { supabase } from "@/lib/supabase";

export interface Payment {
    id: number;
    student_id: number;
    amount: number;
    type: 'Hostel Fee' | 'Mess Fee' | 'Fine' | 'Other';
    status: 'Paid' | 'Pending' | 'Failed';
    payment_date?: string;
    transaction_id?: string;
    created_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const paymentService = {
    async fetchPayments() {
        const { data, error } = await supabase
            .from("payments")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Payment[];
    },

    async createPayment(payment: Omit<Payment, "id" | "created_at" | "students">) {
        const { data, error } = await supabase
            .from("payments")
            .insert([payment])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getPendingPaymentForStudent(studentId: number) {
        const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("student_id", studentId)
            .eq("status", "Pending")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data as Payment | null;
    },

    async updatePaymentStatus(id: number, status: 'Paid' | 'Failed', transaction_id?: string) {
        const updates: { status: 'Paid' | 'Failed'; payment_date?: string; transaction_id?: string } = { status };
        if (status === 'Paid') {
            updates.payment_date = new Date().toISOString();
            if (transaction_id) updates.transaction_id = transaction_id;
        }

        const { data, error } = await supabase
            .from("payments")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\roomService.ts

import { supabase } from "@/lib/supabase";

export interface Room {
    id: number;
    room_number: string;
    block: string;
    capacity: number;
    current_occupancy: number;
    type: 'AC' | 'Non-AC';
    status: 'Available' | 'Occupied' | 'Maintenance';
    floor: number;
}

export const roomService = {
    async fetchRooms() {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .order("room_number", { ascending: true });

        if (error) throw error;
        return data as Room[];
    },

    async getRoomById(id: number) {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Room;
    },

    async createRoom(room: Omit<Room, "id" | "current_occupancy">) {
        const { data, error } = await supabase
            .from("rooms")
            .insert([room])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateRoom(id: number, updates: Partial<Room>) {
        const { data, error } = await supabase
            .from("rooms")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getRoomByNumberAndBlock(roomNumber: string, block: string) {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("room_number", roomNumber)
            .eq("block", block)
            .maybeSingle();

        if (error) throw error;
        return data as Room | null;
    },

    async deleteRoom(id: number) {
        const { error } = await supabase
            .from("rooms")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\services\studentService.ts

import { supabase } from "@/lib/supabase";
import { type SupabaseClient } from '@supabase/supabase-js';

export interface Student {
    id: number;
    profile_id?: string;
    admission_no: string;
    name: string;
    course: string;
    year: number;
    room_id?: number;
    parent_name: string;
    parent_phone: string;
    blood_group: string;
    emergency_contact: string;
    status: 'Active' | 'Inactive' | 'Alumni';
    email?: string;
    password?: string;
    rooms?: {
        room_number: string;
        block: string;
    };
    profiles?: {
        avatar_url?: string;
    };
}

// Special client for background user creation to avoid logging out the Admin
let tempAuthClient: SupabaseClient | null = null;

const getTempAuthClient = async (): Promise<SupabaseClient> => {
    if (tempAuthClient) return tempAuthClient;
    
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { createClient } = await import('@supabase/supabase-js');
    
    tempAuthClient = createClient(url, key, {
        auth: { 
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
    return tempAuthClient;
};

export const studentService = {
    async fetchStudents() {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Student[];
    },

    async getStudentById(id: number) {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Student;
    },

    async getStudentByProfileId(profileId: string) {
        // 1. First try by exact profile_id match
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .eq("profile_id", profileId)
            .maybeSingle();

        if (data) return data as Student;

        // 2. If not found, get the user's email and try matching by email
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            const { data: emailData, error: emailError } = await supabase
                .from("students")
                .select("*, rooms(room_number, block), profiles(avatar_url)")
                .eq("email", user.email)
                .is("profile_id", null)
                .maybeSingle();

            if (emailData) {
                // Automaticaly link the profile_id if matched by email
                await this.updateStudent(emailData.id, { profile_id: profileId });
                return emailData as Student;
            }
        }

        if (error && error.code !== 'PGRST116') throw error;
        return null;
    },

    async getProfileByEmail(email: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data.id;
    },

    async createStudent(student: Omit<Student, "id" | "rooms">) {
        const { password, ...dataToInsert } = student;

        // 1. If password and email are provided, create the Auth user first
        if (password && student.email) {
            const tempClient = await getTempAuthClient();

            const { data: authData, error: authError } = await tempClient.auth.signUp({
                email: student.email,
                password: password,
                options: {
                    data: {
                        full_name: student.name,
                        role: 'student'
                    }
                }
            });

            if (authError) {
                console.error("Auth creation error:", authError);
                throw new Error("Failed to create student login: " + authError.message);
            }

            if (authData.user) {
                dataToInsert.profile_id = authData.user.id;
            }
        }

        const { data, error } = await supabase
            .from("students")
            .insert([dataToInsert])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateStudent(id: number, updates: Partial<Student>) {
        const { data, error } = await supabase
            .from("students")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteStudent(id: number) {
        const { error } = await supabase
            .from("students")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\test\example.test.ts

import { describe, it, expect } from "vitest";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\frontend\src\test\setup.ts

import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\.env



---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\add_student_email.sql

-- 1. Add email column to students table
alter table public.students add column if not exists email text unique;

-- 2. Update existing students to have emails from their profiles (if they were already linked)
update public.students s
set email = p.email
from public.profiles p
where s.profile_id = p.id
and s.email is null;

-- 3. Update the handle_new_user function to automatically link matching students
create or replace function public.handle_new_user()
returns trigger as $$
declare
  existing_student_id bigint;
begin
  -- Insert into profiles
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');

  -- Look for a student record with this email that isn't already linked
  select id into existing_student_id
  from public.students
  where email = new.email
  and profile_id is null
  limit 1;

  -- If found, link it
  if existing_student_id is not null then
    update public.students
    set profile_id = new.id
    where id = existing_student_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\add_student_email_utf8.sql

-- 1. Add email column to students table
alter table public.students add column if not exists email text unique;

-- 2. Update existing students to have emails from their profiles (if they were already linked)
update public.students s
set email = p.email
from public.profiles p
where s.profile_id = p.id
and s.email is null;

-- 3. Update the handle_new_user function to automatically link matching students
create or replace function public.handle_new_user()
returns trigger as $$
declare
  existing_student_id bigint;
begin
  -- Insert into profiles
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');

  -- Look for a student record with this email that isn't already linked
  select id into existing_student_id
  from public.students
  where email = new.email
  and profile_id is null
  limit 1;

  -- If found, link it
  if existing_student_id is not null then
    update public.students
    set profile_id = new.id
    where id = existing_student_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\auto-fix.js


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function autoFix() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Attempting to auto-fix for:', email)

    try {
        // 1. Get User ID (we need to be "logged in" or know the ID)
        // Since we don't have the user's password, we can't sign in.
        // However, if the user ran the SQL, we might find the ID in auth.users
        // But anon key can't read auth.users.

        // Let's see if we can at least create a student record with just the email
        // if RLS is off.
        const { data, error } = await supabase
            .from('students')
            .insert([
                {
                    name: 'Sahithi Thavishi',
                    email: email,
                    admission_no: 'AUTO' + Math.floor(Math.random() * 10000),
                    status: 'Active'
                }
            ])
            .select()

        if (error) {
            console.error('Failed to insert student (This is expected if RLS is ON):', error)
            console.log('This confirms you MUST run the SQL in the Supabase Dashboard.')
        } else {
            console.log('SUCCESS! Auto-created student record:', data)
            console.log('Now refresh your app!')
        }

    } catch (err) {
        console.error('Error:', err)
    }
}

autoFix()


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\check-avatar-column.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lubwqxppmnekdkohszhe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking profiles table...");
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('avatar_url').limit(1);
  if (pErr) console.error("Profiles error:", pErr.message);
  else console.log("Profiles queried successfully. avatar_url column exists:", profiles !== null);

  console.log("Checking storage buckets...");
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) console.error("Buckets error:", bErr.message);
  else {
    console.log("Buckets:", buckets?.map(b => b.name));
    const avatarsBucket = buckets?.find(b => b.name === 'avatars');
    if (avatarsBucket) {
      console.log("avatars bucket found. Public:", avatarsBucket.public);
    } else {
      console.log("avatars bucket NOT FOUND.");
    }
  }
}

check();


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\check-student-status.js


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStudentStatus() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Checking status for:', email)

    try {
        // 1. Check Profile
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        console.log('Profile:', profile)

        // 2. Check Student
        const { data: student, error: sError } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        console.log('Student by Email:', student)

        if (profile) {
            const { data: studentById, error: sIdError } = await supabase
                .from('students')
                .select('*')
                .eq('profile_id', profile.id)
                .maybeSingle()
            console.log('Student by Profile ID:', studentById)
        }

    } catch (err) {
        console.error('Error:', err)
    }
}

checkStudentStatus()


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_admin_short_email.sql

-- Create the user with the email EXACTLY as typed in the screenshot (ending in .edu)
-- Password: Mubeen@123

DO $$
BEGIN
    -- 1. Create user in auth.users if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mubeenahmed.shaik@aurora.edu') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            'mubeenahmed.shaik@aurora.edu', crypt('Mubeen@123', gen_salt('bf')), 
            now(), '{"full_name":"Mubeen Ahmed"}', now(), now()
        );
    END IF;

    -- 2. Ensure they have the admin role
    INSERT INTO public.profiles (id, email, full_name, role)
    SELECT id, email, 'Mubeen Ahmed', 'admin'
    FROM auth.users
    WHERE email = 'mubeenahmed.shaik@aurora.edu'
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';

END $$;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_admin_user.sql

-- Create an admin user in auth.users
-- Note: This requires the pgcrypto extension, which is usually enabled by default in Supabase
-- If not, run: create extension if not exists "pgcrypto";

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')), -- Password is 'admin123'
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- The trigger handle_new_user() should automatically create the profile entry
-- but let's update it to ensure it has the 'admin' role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_attendance_table.sql

CREATE TABLE IF NOT EXISTS public.mess_attendance (id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, student_id bigint REFERENCES public.students(id) ON DELETE CASCADE NOT NULL, meal_type text CHECK (meal_type IN ('Breakfast', 'Lunch', 'Snacks', 'Dinner')) NOT NULL, marked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL);


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_attendance_table_utf8.sql

CREATE TABLE IF NOT EXISTS public.mess_attendance (id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, student_id bigint REFERENCES public.students(id) ON DELETE CASCADE NOT NULL, meal_type text CHECK (meal_type IN ('Breakfast', 'Lunch', 'Snacks', 'Dinner')) NOT NULL, marked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL);


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_avatars_bucket.sql

-- Insert the storage bucket for avatars if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Ensure RLS is enabled on storage.objects
alter table storage.objects enable row level security;

-- Drop existing policies if any
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Users can update their own avatar." on storage.objects;
drop policy if exists "Users can delete their own avatar." on storage.objects;

-- Allow public read access to the avatars bucket
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatars
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow users to update their own avatars
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow users to delete their own avatars
create policy "Users can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_custom_admin.sql

-- 1. Reload the schema cache to fix "Database error querying schema"
NOTIFY pgrst, 'reload config';

-- 2. Create the custom admin user safely
DO $$
BEGIN
    -- Create user in auth.users if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mubeenahmed.shaik@aurora.edu.in') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            'mubeenahmed.shaik@aurora.edu.in', crypt('Mubeen@123', gen_salt('bf')), 
            now(), '{"full_name":"Mubeen Ahmed"}', now(), now()
        );
    END IF;

    -- Ensure the user has the 'admin' role in public.profiles
    -- We use an INSERT ... ON CONFLICT to handle cases where the profile might already exist
    INSERT INTO public.profiles (id, email, full_name, role)
    SELECT id, email, 'Mubeen Ahmed', 'admin'
    FROM auth.users
    WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', full_name = 'Mubeen Ahmed';

END $$;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_mess_staff_user.sql

-- Create a mess staff user in auth.users
-- Password is 'Mess@123'

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'vishishta.gunda@aurora.edu.in',
  crypt('Mess@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Mess Manager"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Ensure the profile is created/updated with the correct role
-- The trigger should handle creation, but we update role to be sure
UPDATE public.profiles
SET role = 'mess_staff'
WHERE email = 'vishishta.gunda@aurora.edu.in';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\create_student_user.sql

-- Create a student user in auth.users
-- Password is 'Student@123'

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'sahithi.thavishi@aurora.edu.in',
  crypt('Student@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Student"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Ensure the profile is created/updated with the correct role
-- The trigger should handle creation, but we update role to be sure
UPDATE public.profiles
SET role = 'student'
WHERE email = 'sahithi.thavishi@aurora.edu.in';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\debug-db.js


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugDatabase() {
    console.log('Debugging database content...')

    try {
        // Check Profiles count
        const { count: profileCount, error: pError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        console.log('Total Profiles:', profileCount)

        // Check Students count
        const { count: studentCount, error: sError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })

        console.log('Total Students:', studentCount)

        // List some emails from profiles
        const { data: profiles, error: pListData } = await supabase
            .from('profiles')
            .select('email, role')
            .limit(5)

        console.log('Recent Profiles:', profiles)

        // List some emails from students
        const { data: students, error: sListData } = await supabase
            .from('students')
            .select('email, name')
            .limit(5)

        console.log('Recent Students:', students)

    } catch (err) {
        console.error('Error:', err)
    }
}

debugDatabase()


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix.mjs

import dotenv from 'dotenv';
import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (const p of profiles) {
     const rawName = p.full_name?.toLowerCase();
     if (!rawName || rawName.includes('kitchen master') || rawName.includes('mess') || rawName.includes('admin')) {
        let name = p.email.split('@')[0].split('.')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        await supabase.from('profiles').update({full_name: name}).eq('id', p.id);
        await supabase.auth.admin.updateUserById(p.id, { user_metadata: { full_name: name } }); // Note: anon key might not allow this, but profiles table will be updated ok.
     }
  }
}
fix();


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_admin_update.sql

-- Fix 1: Allow Admins to update user profiles (so they can save profile pictures for students)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING ( public.is_admin() );

-- Fix 2: Give the Mess Staff a proper name instead of just 'mess'
-- (This will update any mess staff profile whose name isn't set properly)
UPDATE public.profiles
SET full_name = 'Kitchen Master'
WHERE role = 'mess_staff' AND (full_name IS NULL OR full_name = '' OR full_name ILIKE '%mess%');


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_auth_error.sql

-- 1. Correct the Profile Trigger to be more robust (prevents 500 errors)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
  return new;
end;
$$ language plpgsql security definer;

-- 2. Ensure RLS doesn't block the trigger (security definer should handle this, but good to check)
alter function public.handle_new_user() security definer;

-- 3. Cleanup: If you had failed attempts, ensure no orphaned students exist with the email you tried
-- Replace 'target@email.com' with the email you were trying if it still fails.
-- DELETE FROM public.students WHERE email = 'target@email.com';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_auth_error_resilient.sql

-- RESILIENT AUTH TRIGGER
-- This script prevents 500 errors by handling conflicts and ignoring non-critical failures

create or replace function public.handle_new_user()
returns trigger as $$
begin
  begin
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id, 
      new.email, 
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
      coalesce(new.raw_user_meta_data->>'role', 'student')
    )
    on conflict (id) do update set
      email = excluded.email,
      full_name = excluded.full_name,
      role = excluded.role;
  exception when others then
    -- Log the error but allow the auth.user to be created anyway
    -- This prevents the "500 Database error" from stopping the signup
    raise warning 'Error in handle_new_user for %: %', new.email, SQLERRM;
  end;
  return new;
end;
$$ language plpgsql security definer;

-- Re-attach trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CLEANUP potential blockers
-- If a student/profile exists with an email but no auth user, the signup might still fail.
-- Uncomment and run the lines below ONLY if you are still getting 500 errors 
-- for a SPECIFIC email (change 'test@email.com' to that email):

-- DELETE FROM public.profiles WHERE email = 'test@example.com';
-- DELETE FROM public.students WHERE email = 'test@example.com';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_login_profile.sql

-- Ensure profile exists for the user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users
WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_mess_attendance_lookup.sql

-- Re-run this in Supabase SQL Editor if attendance is failing
-- This ensures the Mess Staff has permission to search for students and mark attendance

-- 1. Ensure Mess Staff can see ALL students (Required for marking attendance)
DROP POLICY IF EXISTS "Mess staff can view student info" ON public.students;
CREATE POLICY "Mess staff can view student info"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- 2. Ensure Mess Staff can insert attendance records
DROP POLICY IF EXISTS "Staff can manage attendance" ON public.mess_attendance;
CREATE POLICY "Staff can manage attendance"
  ON public.mess_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- 3. Verify the students table RLS is enabled
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_attendance ENABLE ROW LEVEL SECURITY;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\fix_student_link.sql

-- COMPREHENSIVE FIX: Run this in your Supabase SQL Editor
-- This script ensures all tables exist and links your account correctly.

-- 1. Ensure tables exist (Safety check)
DO $$ 
BEGIN
    -- Create profiles if missing
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
            email text UNIQUE NOT NULL,
            full_name text,
            role text CHECK (role IN ('admin', 'student', 'mess_staff')) NOT NULL DEFAULT 'student',
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;

    -- Create students if missing
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
        CREATE TABLE public.students (
            id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            profile_id uuid REFERENCES public.profiles(id),
            admission_no text UNIQUE NOT NULL,
            name text NOT NULL,
            email text UNIQUE,
            status text CHECK (status IN ('Active', 'Inactive', 'Alumni')) DEFAULT 'Active'
        );
    END IF;
END $$;

-- 2. Link your current user account
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Find your user ID by email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'sahithi.thavishi@aurora.edu.in';

  IF v_user_id IS NOT NULL THEN
    -- Ensure profile exists in public.profiles
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (v_user_id, 'sahithi.thavishi@aurora.edu.in', 'Test Student', 'student')
    ON CONFLICT (id) DO UPDATE SET role = 'student';

    -- Create or update the student record
    INSERT INTO public.students (profile_id, admission_no, name, email, status)
    VALUES (v_user_id, 'ADM' || floor(random() * 100000), 'Test Student', 'sahithi.thavishi@aurora.edu.in', 'Active')
    ON CONFLICT (email) DO UPDATE SET profile_id = v_user_id;
    
    RAISE NOTICE 'SUCCESS: Your account is now linked to a student record!';
  ELSE
    RAISE NOTICE 'ERROR: Account for sahithi.thavishi@aurora.edu.in not found. Please sign out and sign in again.';
  END IF;
END $$;


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\lint.log


> vite_react_shadcn_ts@0.0.0 lint
> eslint .


C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\badge.tsx
  29:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\button.tsx
  47:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\command.tsx
  24:11  error  An interface declaring no members is equivalent to its supertype  @typescript-eslint/no-empty-object-type

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\form.tsx
  129:10  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\navigation-menu.tsx
  111:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\sidebar.tsx
  636:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\sonner.tsx
  27:19  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\textarea.tsx
  5:18  error  An interface declaring no members is equivalent to its supertype  @typescript-eslint/no-empty-object-type

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\toggle.tsx
  37:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\contexts\AuthContext.tsx
  80:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\LoginPage.tsx
  61:9  error  Parsing error: JSX element 'motion.div' has no corresponding closing tag

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\tailwind.config.ts
  90:13  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

Γ£û 12 problems (4 errors, 8 warnings)



---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\lint_output.txt


C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\student\StudentDashboard.tsx
   18:27  error    Unexpected any. Specify a different type                                                                              @typescript-eslint/no-explicit-any
   78:11  error    'stats' is never reassigned. Use 'const' instead                                                                      prefer-const
  154:6   warning  React Hook useEffect has a missing dependency: 'loadDashboardData'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

Γ£û 3 problems (2 errors, 1 warning)
  1 error and 0 warnings potentially fixable with the `--fix` option.



---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\lint_report.txt


> vite_react_shadcn_ts@0.0.0 lint
> eslint .


C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\badge.tsx
  29:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\button.tsx
  47:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\form.tsx
  129:10  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\navigation-menu.tsx
  111:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\sidebar.tsx
  636:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\sonner.tsx
  27:19  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\components\ui\toggle.tsx
  37:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\contexts\AuthContext.tsx
  104:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\PlaceholderPages.tsx
  4:7  warning  Fast refresh only works when a file has exports. Move your component(s) to a separate file  react-refresh/only-export-components

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\admin\AdminDashboard.tsx
  28:60  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  29:50  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  30:54  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\admin\AdminPayments.tsx
  95:18  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\admin\AdminRooms.tsx
  86:22  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  91:25  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\admin\AdminStudents.tsx
   90:32  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  116:25  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\student\StudentComplaints.tsx
  54:6  warning  React Hook useEffect has a missing dependency: 'loadStudentAndComplaints'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\student\StudentLeaves.tsx
  54:6  warning  React Hook useEffect has a missing dependency: 'loadStudentAndLeaves'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\pages\student\StudentPayments.tsx
  20:6  warning  React Hook useEffect has a missing dependency: 'loadPayments'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\services\complaintService.ts
  59:24  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\SHAIK MUBEEN AHEMAD\OneDrive\Desktop\campus-haven-manager-main\src\services\paymentService.ts
  44:24  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

Γ£û 22 problems (10 errors, 12 warnings)



---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\package-lock.json

{
    "name": "campus-haven-backend",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
            "name": "campus-haven-backend",
            "version": "1.0.0",
            "dependencies": {
                "@supabase/supabase-js": "^2.99.1"
            }
        },
        "node_modules/@supabase/auth-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/auth-js/-/auth-js-2.99.1.tgz",
            "integrity": "sha512-x7lKKTvKjABJt/FYcRSPiTT01Xhm2FF8RhfL8+RHMkmlwmRQ88/lREupIHKwFPW0W6pTCJqkZb7Yhpw/EZ+fNw==",
            "license": "MIT",
            "dependencies": {
                "tslib": "2.8.1"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@supabase/functions-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/functions-js/-/functions-js-2.99.1.tgz",
            "integrity": "sha512-WQE62W5geYImCO4jzFxCk/avnK7JmOdtqu2eiPz3zOaNiIJajNRSAwMMDgEGd2EMs+sUVYj1LfBjfmW3EzHgIA==",
            "license": "MIT",
            "dependencies": {
                "tslib": "2.8.1"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@supabase/postgrest-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/postgrest-js/-/postgrest-js-2.99.1.tgz",
            "integrity": "sha512-gtw2ibJrADvfqrpUWXGNlrYUvxttF4WVWfPpTFKOb2IRj7B6YRWMDgcrYqIuD4ZEabK4m6YKQCCGy6clgf1lPA==",
            "license": "MIT",
            "dependencies": {
                "tslib": "2.8.1"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@supabase/realtime-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/realtime-js/-/realtime-js-2.99.1.tgz",
            "integrity": "sha512-9EDdy/5wOseGFqxW88ShV9JMRhm7f+9JGY5x+LqT8c7R0X1CTLwg5qie8FiBWcXTZ+68yYxVWunI+7W4FhkWOg==",
            "license": "MIT",
            "dependencies": {
                "@types/phoenix": "^1.6.6",
                "@types/ws": "^8.18.1",
                "tslib": "2.8.1",
                "ws": "^8.18.2"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@supabase/storage-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/storage-js/-/storage-js-2.99.1.tgz",
            "integrity": "sha512-mf7zPfqofI62SOoyQJeNUVxe72E4rQsbWim6lTDPeLu3lHija/cP5utlQADGrjeTgOUN6znx/rWn7SjrETP1dw==",
            "license": "MIT",
            "dependencies": {
                "iceberg-js": "^0.8.1",
                "tslib": "2.8.1"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@supabase/supabase-js": {
            "version": "2.99.1",
            "resolved": "https://registry.npmjs.org/@supabase/supabase-js/-/supabase-js-2.99.1.tgz",
            "integrity": "sha512-5MRoYD9ffXq8F6a036dm65YoSHisC3by/d22mauKE99Vrwf792KxYIIr/iqCX7E4hkuugbPZ5EGYHTB7MKy6Vg==",
            "license": "MIT",
            "dependencies": {
                "@supabase/auth-js": "2.99.1",
                "@supabase/functions-js": "2.99.1",
                "@supabase/postgrest-js": "2.99.1",
                "@supabase/realtime-js": "2.99.1",
                "@supabase/storage-js": "2.99.1"
            },
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/@types/node": {
            "version": "25.3.2",
            "resolved": "https://registry.npmjs.org/@types/node/-/node-25.3.2.tgz",
            "integrity": "sha512-RpV6r/ij22zRRdyBPcxDeKAzH43phWVKEjL2iksqo1Vz3CuBUrgmPpPhALKiRfU7OMCmeeO9vECBMsV0hMTG8Q==",
            "license": "MIT",
            "dependencies": {
                "undici-types": "~7.18.0"
            }
        },
        "node_modules/@types/phoenix": {
            "version": "1.6.7",
            "resolved": "https://registry.npmjs.org/@types/phoenix/-/phoenix-1.6.7.tgz",
            "integrity": "sha512-oN9ive//QSBkf19rfDv45M7eZPi0eEXylht2OLEXicu5b4KoQ1OzXIw+xDSGWxSxe1JmepRR/ZH283vsu518/Q==",
            "license": "MIT"
        },
        "node_modules/@types/ws": {
            "version": "8.18.1",
            "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",
            "integrity": "sha512-ThVF6DCVhA8kUGy+aazFQ4kXQ7E1Ty7A3ypFOe0IcJV8O/M511G99AW24irKrW56Wt44yG9+ij8FaqoBGkuBXg==",
            "license": "MIT",
            "dependencies": {
                "@types/node": "*"
            }
        },
        "node_modules/iceberg-js": {
            "version": "0.8.1",
            "resolved": "https://registry.npmjs.org/iceberg-js/-/iceberg-js-0.8.1.tgz",
            "integrity": "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA==",
            "license": "MIT",
            "engines": {
                "node": ">=20.0.0"
            }
        },
        "node_modules/tslib": {
            "version": "2.8.1",
            "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
            "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
            "license": "0BSD"
        },
        "node_modules/undici-types": {
            "version": "7.18.2",
            "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.18.2.tgz",
            "integrity": "sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w==",
            "license": "MIT"
        },
        "node_modules/ws": {
            "version": "8.19.0",
            "resolved": "https://registry.npmjs.org/ws/-/ws-8.19.0.tgz",
            "integrity": "sha512-blAT2mjOEIi0ZzruJfIhb3nps74PRWTCz1IjglWEEpQl5XS/UNama6u2/rjFkDDouqr4L67ry+1aGIALViWjDg==",
            "license": "MIT",
            "engines": {
                "node": ">=10.0.0"
            },
            "peerDependencies": {
                "bufferutil": "^4.0.1",
                "utf-8-validate": ">=5.0.2"
            },
            "peerDependenciesMeta": {
                "bufferutil": {
                    "optional": true
                },
                "utf-8-validate": {
                    "optional": true
                }
            }
        }
    }
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\package.json

{
    "name": "campus-haven-backend",
    "version": "1.0.0",
    "type": "module",
    "description": "Database scripts and utility functions",
    "dependencies": {
        "@supabase/supabase-js": "^2.99.1"
    }
}


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\reset_admin_password.sql

-- 1. Reload the schema cache
NOTIFY pgrst, 'reload config';

-- 2. Ensure pgcrypto extension is enabled for password hashing
create extension if not exists "pgcrypto";

-- 3. Update the password for the custom admin user to be absolutely sure
-- Password will be reset to: Mubeen@123
UPDATE auth.users
SET encrypted_password = crypt('Mubeen@123', gen_salt('bf'))
WHERE email = 'mubeenahmed.shaik@aurora.edu.in';

-- 4. If the user doesn't exist, create them again (SAFETY CHECK)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mubeenahmed.shaik@aurora.edu.in') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            'mubeenahmed.shaik@aurora.edu.in', crypt('Mubeen@123', gen_salt('bf')), 
            now(), '{"full_name":"Mubeen Ahmed"}', now(), now()
        );
    END IF;
END $$;

-- 5. Force update the profile role to 'admin'
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Mubeen Ahmed', 'admin'
FROM auth.users
WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\revert_kitchen_master.sql

UPDATE public.profiles
SET full_name = NULL
WHERE role = 'mess_staff' AND full_name = 'Kitchen Master';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\supabase_rls.sql

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_attendance ENABLE ROW LEVEL SECURITY;

-- FUNCTIONS
-- A helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure function runs with a predictable search_path
  PERFORM set_config('search_path', 'public, pg_temp', true);

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- A helper function to check if the current user is mess staff
CREATE OR REPLACE FUNCTION public.is_mess_staff()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'mess_staff'
  );
END;
$$;

-- PROFILES
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Users can insert their own profile (e.g. during signup if trigger fails)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Admin view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ( public.is_admin() );


-- ROOMS
DROP POLICY IF EXISTS "Authenticated users can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can manage rooms" ON public.rooms;

-- Everyone (authenticated) can view rooms
CREATE POLICY "Authenticated users can view rooms"
  ON public.rooms FOR SELECT
  TO authenticated
  USING ( true );

-- Only admins can insert/update/delete rooms
CREATE POLICY "Admins can manage rooms"
  ON public.rooms FOR ALL
  USING ( public.is_admin() );


-- STUDENTS
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
DROP POLICY IF EXISTS "Students can view own record" ON public.students;

-- Admins can manage students
CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING ( public.is_admin() );

-- Students can view their own record (linked via profile_id)
CREATE POLICY "Students can view own record"
  ON public.students FOR SELECT
  USING ( profile_id = auth.uid() );

-- Mess staff can view student info for attendance verification
CREATE POLICY "Mess staff can view student info"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );


-- COMPLAINTS
DROP POLICY IF EXISTS "Students can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Students can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can manage complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can manage complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can view complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can delete complaints" ON public.complaints;

-- Students can insert their own complaints
CREATE POLICY "Students can create complaints"
  ON public.complaints FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

-- Students can view their own complaints
CREATE POLICY "Students can view own complaints"
  ON public.complaints FOR SELECT
  USING ( user_id = auth.uid() );

-- Admins can view and update all complaints
CREATE POLICY "Admins can manage complaints"
  ON public.complaints FOR ALL
  TO authenticated
  USING ( public.is_admin() );

-- Mess staff can manage complaints (filtered in UI)
CREATE POLICY "Mess staff can view complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING ( public.is_mess_staff() );

CREATE POLICY "Mess staff can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING ( public.is_mess_staff() );

CREATE POLICY "Mess staff can delete complaints"
  ON public.complaints FOR DELETE
  TO authenticated
  USING ( public.is_mess_staff() );


-- LEAVES
DROP POLICY IF EXISTS "Students can create leave requests" ON public.leaves;
DROP POLICY IF EXISTS "Students can view own leave requests" ON public.leaves;
DROP POLICY IF EXISTS "Admins can manage leave requests" ON public.leaves;

-- Students can insert their own leave requests
CREATE POLICY "Students can create leave requests"
  ON public.leaves FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

-- Students can view their own leave requests
CREATE POLICY "Students can view own leave requests"
  ON public.leaves FOR SELECT
  USING ( user_id = auth.uid() );

-- Admins can view and update all leave requests
CREATE POLICY "Admins can manage leave requests"
  ON public.leaves FOR ALL
  USING ( public.is_admin() );


-- PAYMENTS
DROP POLICY IF EXISTS "Students can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;

-- Students can view their own payments via student relationship
CREATE POLICY "Students can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = payments.student_id
      AND students.profile_id = auth.uid()
    )
  );

-- Admins can manage payments
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING ( public.is_admin() );


-- MESS MENU
DROP POLICY IF EXISTS "Everyone can view mess menu" ON public.mess_menu;
DROP POLICY IF EXISTS "Staff can manage menu" ON public.mess_menu;

-- Everyone can view the menu
CREATE POLICY "Everyone can view mess menu"
  ON public.mess_menu FOR SELECT
  TO authenticated
  USING ( true );

-- Admin and Mess Staff can manage menu
CREATE POLICY "Staff can manage menu"
  ON public.mess_menu FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );


-- MESS ATTENDANCE
DROP POLICY IF EXISTS "Staff can manage attendance" ON public.mess_attendance;
DROP POLICY IF EXISTS "Students can view own attendance" ON public.mess_attendance;

-- Admin and Mess Staff can manage attendance
CREATE POLICY "Staff can manage attendance"
  ON public.mess_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- Students can view their own attendance records
CREATE POLICY "Students can view own attendance"
  ON public.mess_attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = mess_attendance.student_id
      AND students.profile_id = auth.uid()
    )
  );


-- MESS INVENTORY
DROP POLICY IF EXISTS "Staff can manage inventory" ON public.mess_inventory;

-- Admin and Mess Staff can manage inventory
CREATE POLICY "Staff can manage inventory"
  ON public.mess_inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\supabase_schema.sql

-- Enable Row Level Security (RLS) is generally good practice, but we'll start simple for exploration
-- You can enable RLS later and add policies for fine-grained control.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'student', 'mess_staff')) not null default 'student',
  avatar_url text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.rooms (
  id bigint generated by default as identity primary key,
  room_number text not null unique,
  block text not null, 
  capacity int not null,
  current_occupancy int default 0,
  type text check (type in ('AC', 'Non-AC')) not null,
  status text check (status in ('Available', 'Occupied', 'Maintenance')) default 'Available',
  floor int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.students (
  id bigint generated by default as identity primary key,
  profile_id uuid references public.profiles(id),
  admission_no text unique not null,
  name text not null,
  course text,
  year int,
  room_id bigint references public.rooms(id),
  parent_name text,
  parent_phone text,
  blood_group text,
  emergency_contact text,
  status text check (status in ('Active', 'Inactive', 'Alumni')) default 'Active',
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.complaints (
  id bigint generated by default as identity primary key,
  student_id bigint references public.students(id),
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  category text check (category in ('Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Mess', 'Other')),
  priority text check (priority in ('Low', 'Medium', 'High')),
  status text check (status in ('Pending', 'In Progress', 'Resolved')) default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

create table if not exists public.leaves (
  id bigint generated by default as identity primary key,
  student_id bigint references public.students(id),
  user_id uuid references auth.users(id),
  type text check (type in ('Outing', 'Leave')),
  reason text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.payments (
  id bigint generated by default as identity primary key,
  student_id bigint references public.students(id),
  amount decimal(10, 2) not null,
  type text check (type in ('Hostel Fee', 'Mess Fee', 'Fine', 'Other')),
  status text check (status in ('Paid', 'Pending', 'Failed')) default 'Pending',
  payment_date timestamp with time zone,
  transaction_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.mess_menu (
  id bigint generated by default as identity primary key,
  day_of_week text check (day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  meal_type text check (meal_type in ('Breakfast', 'Lunch', 'Snacks', 'Dinner')),
  items text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(day_of_week, meal_type)
);

create table if not exists public.mess_inventory (
  id bigint generated by default as identity primary key,
  item_name text not null,
  quantity decimal(10, 2) not null,
  unit text not null,
  threshold decimal(10, 2),
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\sync_profiles.sql

-- SYNC PROFILES SCRIPT
-- This script ensures all existing auth users have a corresponding profile entry.
-- Run this in the Supabase SQL Editor to fix login issues for existing users.

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- If you want to force specific roles for known users, do it here:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- UPDATE public.profiles SET role = 'mess_staff' WHERE email = 'mess@example.com';


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\test-supabase.js


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log('Testing connection to Supabase...')
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1)
        if (error) {
            console.error('Supabase Error:', error)
        } else {
            console.log('Success! Data:', data)
        }
    } catch (err) {
        console.error('Unexpected Error:', err)
    }
}

testConnection()


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\update_schema.sql

ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_category_check; ALTER TABLE complaints ADD CONSTRAINT complaints_category_check CHECK (category IN ('Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Mess', 'Other'));


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\update_schema_utf8.sql

ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_category_check; ALTER TABLE complaints ADD CONSTRAINT complaints_category_check CHECK (category IN ('Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Mess', 'Other'));


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\upsert_student.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function upsertStudent() {
  const name = "Rithish";
  const email = "jyothirithish.jaman@aurora.edu.in";
  const admissionNo = "241U1R2004";
  const password = "Student@123";

  console.log(`Processing student: ${name} (${admissionNo})...`);

  // 1. Check if student exists by admission number
  const { data: existingStudent, error: findError } = await supabase
    .from('students')
    .select('*')
    .eq('admission_no', admissionNo)
    .maybeSingle();

  if (existingStudent) {
    console.log(`Student ${admissionNo} exists. Updating name and email to '${name}' and '${email}'...`);
    const { error: updateError } = await supabase
      .from('students')
      .update({ name: name, email: email })
      .eq('id', existingStudent.id);
    
    if (updateError) console.error("Update error:", updateError);
    else console.log("Student record updated successfully.");
  } else {
    console.log(`Creating new student record for ${name}...`);
    const { error: insertError } = await supabase
      .from('students')
      .insert([{
        name: name,
        email: email,
        admission_no: admissionNo,
        course: 'B.Tech',
        year: 1,
        status: 'Active',
        parent_name: 'Parent',
        parent_phone: '0000000000',
        blood_group: 'Unknown',
        emergency_contact: '0000000000'
      }]);
    
    if (insertError) console.error("Insert error:", insertError);
    else console.log("Student record created successfully.");
  }
}

upsertStudent();


---

### FILE: C:\Users\Sahithi\OneDrive\Desktop\campus-haven-manager-main\campus-haven-manager-main\backend\verify-fix.js


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkFix() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Final verification for:', email)

    try {
        const { data: profile, error: pError } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()
        const { data: student, error: sError } = await supabase.from('students').select('*').eq('email', email).maybeSingle()

        console.log('Profile found:', !!profile)
        console.log('Student found:', !!student)

        if (profile && student) {
            console.log('VERIFICATION SUCCESSFUL!')
        } else {
            console.log('VERIFICATION FAILED: Data still missing.')
        }
    } catch (err) {
        console.error('Error:', err)
    }
}

checkFix()


---


