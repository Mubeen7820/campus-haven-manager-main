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
              Welcome back, <span className="text-orange-500 font-black">{user?.name?.split(" ")[0]}</span>
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors group">
                <Bell className="w-6 h-6 text-slate-600 group-hover:text-slate-900" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full" />
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-1" />
              <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-[12px] font-black text-white uppercase">
                  {user?.role[0]}
                </div>
                <span className="text-sm font-black text-slate-700 capitalize">{user?.role.replace("_", " ")}</span>
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
