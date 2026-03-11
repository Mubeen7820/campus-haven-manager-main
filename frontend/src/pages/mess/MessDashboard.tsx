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
      const messComplaints = complaints.filter(c => c.category === 'Mess' || c.category === 'Other');
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
