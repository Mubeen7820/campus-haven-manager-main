import PageHeader from "@/components/PageHeader";
import { BedDouble, UtensilsCrossed, CreditCard, FileText, Clock, ArrowUpRight, DollarSign, Users, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { messService, MessMenu } from "@/services/messService";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const notices = [
  { id: 1, title: "Hostel Fee Due", desc: "Last date for fee payment is Feb 28", time: "2 hours ago", type: "payment", initial: "HF" },
  { id: 2, title: "Mess Menu Updated", desc: "New menu effective from Monday", time: "5 hours ago", type: "menu", initial: "MM" },
  { id: 3, title: "Maintenance Notice", desc: "Water supply off on Sunday 8-10 AM", time: "1 day ago", type: "notice", initial: "MN" },
  { id: 4, title: "Guest Policy", desc: "Guests allowed only on weekends", time: "2 days ago", type: "notice", initial: "GP" },
  { id: 5, title: "Sport Event", desc: "Annual hostel cricket tournament on Sat", time: "3 days ago", type: "notice", initial: "SE" },
];

const statCards = [
  {
    title: "Room Number",
    value: "B-204",
    sub: "Block B, Floor 2",
    icon: BedDouble,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Mess Plan",
    value: "Premium",
    sub: "+All meals included",
    icon: UtensilsCrossed,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Pending Fees",
    value: "₹12,500",
    sub: "Due by Feb 28",
    icon: CreditCard,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Leave Status",
    value: "Approved",
    sub: "Last request: Jan 20",
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentDashboard = () => {
  const { user } = useAuth();
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
    const subscription = supabase
      .channel('mess_menu_changes_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_menu' }, () => {
        loadMenu();
      })
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, []);

  const getMenuItems = (day: string, meal: string) => {
    return menu?.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name} 👋 Here's your hostel overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{card.title}</span>
              <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content: Menu Table + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Mess Menu — Table (left, 2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Weekly Mess Menu</h3>
              <p className="text-xs text-slate-400 mt-0.5">Current week's meal schedule</p>
            </div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Live</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wide w-32">Day</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Breakfast</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Lunch</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">Loading menu...</td>
                  </tr>
                ) : (
                  days.map((day, idx) => (
                    <tr key={day} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx === days.length - 1 ? "border-0" : ""}`}>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{day}</td>
                      <td className="py-3.5 px-4 text-slate-500">{getMenuItems(day, 'Breakfast')}</td>
                      <td className="py-3.5 px-4 text-slate-500">{getMenuItems(day, 'Lunch')}</td>
                      <td className="py-3.5 px-4 text-slate-500">{getMenuItems(day, 'Dinner')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Notices — Recent Sales style (right, 1/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-slate-900 text-base">Notices</h3>
            <p className="text-xs text-slate-400 mt-0.5">Recent hostel announcements</p>
          </div>
          <div className="divide-y divide-gray-50">
            {notices.map((n) => (
              <div key={n.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                  {n.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                  <p className="text-xs text-slate-400 truncate">{n.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="whitespace-nowrap">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StudentDashboard;
