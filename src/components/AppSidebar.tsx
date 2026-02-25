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
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const items = navByRole[user.role];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);
    setUploadError(null);
    setUploadSuccess(false);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl + "?t=" + Date.now();
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
      setUploadSuccess(true);
    } catch (err: unknown) {
      // Keep local preview even if upload fails
      setUploadError(err instanceof Error ? err.message : "Upload failed. Preview shown locally.");
    } finally {
      setUploading(false);
    }
  };

  const displayAvatar = avatarUrl || user.avatar;

  const ProfileDialog = () => (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogTrigger asChild>
        <div
          className="flex flex-col items-center p-8 border-b border-slate-100 cursor-pointer group"
          title="Click to view profile"
        >
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-blue-600 p-1 bg-white overflow-hidden group-hover:border-blue-700 transition-colors">
              {displayAvatar ? (
                <img src={displayAvatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-1">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Active
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
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
          {uploadSuccess && !uploading && <p className="text-sm text-green-600 font-medium">✓ Photo updated!</p>}
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
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Full Name</p>
              <p className="text-base font-semibold text-slate-900">{user.name}</p>
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

          {user.phone && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-base font-semibold text-slate-900">{user.phone}</p>
              </div>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Address</p>
                <p className="text-base font-semibold text-slate-900">{user.address}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-900 border-r border-slate-200">
      {/* Profile Section at Top - clickable */}
      <ProfileDialog />

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-4 overflow-y-auto mt-4">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${isActive
                ? "bg-slate-50 text-slate-950 shadow-sm"
                : "text-slate-900 hover:bg-slate-50/50"
                }`}
            >
              <span className={`mr-4 ${isActive ? "text-blue-600" : "text-blue-400/60"}`}>
                <item.icon className="w-6 h-6" />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout at Bottom */}
      <div className="p-6 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-8 py-3 w-full rounded-full text-lg font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
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
      <aside className="hidden lg:block w-[260px] min-h-screen shrink-0">
        <div className="fixed w-[260px] h-screen">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
