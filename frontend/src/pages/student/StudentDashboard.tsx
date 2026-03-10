import PageHeader from "@/components/PageHeader";
import { BedDouble, UtensilsCrossed, CreditCard, FileText, Clock, ArrowUpRight, DollarSign, Users, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { messService, MessMenu } from "@/services/messService";
import { studentService } from "@/services/studentService";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";



const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
    const subscription = supabase
      .channel('mess_menu_changes_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_menu' }, () => {
        loadData();
      })
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [user?.id]);

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
            Welcome back, <span className="text-orange-600 font-bold">{user?.name}</span> 👋 
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
              <tr className="bg-white">
                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Day</th>
                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Breakfast</th>
                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Lunch</th>
                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Dinner</th>
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
