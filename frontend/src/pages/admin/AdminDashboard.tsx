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
        const occupied = students.filter(s => s.room_id).length;

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
          value={`₹${(stats.paymentsCollected / 100000).toFixed(2)}L`}
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
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] text-white p-3 rounded-xl shadow-2xl border border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.month}</p>
                        <p className="text-base font-black">₹{payload[0].value?.toLocaleString()}</p>
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
