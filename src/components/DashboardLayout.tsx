import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-border px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="lg:hidden w-10" /> {/* spacer for mobile menu button */}
            <h2 className="text-lg font-semibold font-display hidden lg:block">
              Welcome back, {user?.name?.split(" ")[0]}
            </h2>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
