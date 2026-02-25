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

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of hostel operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="w-5 h-5" />}
          trend="Updated just now"
          trendUp
          color="primary"
        />
        <StatCard
          title="Occupancy"
          value={`${stats.roomsOccupied}/${stats.totalRooms}`}
          icon={<BedDouble className="w-5 h-5" />}
          trend={`${stats.totalRooms > 0 ? Math.round((stats.roomsOccupied / stats.totalRooms) * 100) : 0}% occupied`}
          trendUp
          color="accent"
        />
        <StatCard
          title="Payments Collected"
          value={`₹${(stats.paymentsCollected / 100000).toFixed(2)}L`}
          icon={<CreditCard className="w-5 h-5" />}
          trend="Total collected"
          trendUp
          color="success"
        />
        <StatCard
          title="Open Complaints"
          value={stats.openComplaints}
          icon={<MessageSquareWarning className="w-5 h-5" />}
          trend="Requires attention"
          color="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Payment chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-semibold font-display text-lg mb-4">Payment Collection</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
              <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Amount"]} />
              <Bar dataKey="amount" fill="hsl(222, 60%, 28%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Occupancy pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-semibold font-display text-lg mb-4">Room Occupancy</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                {occupancyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {occupancyData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent complaints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold font-display text-lg">Recent Complaints</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No recent complaints</td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-6 font-medium">{c.student}</td>
                    <td className="py-3 px-6">{c.type}</td>
                    <td className="py-3 px-6 text-muted-foreground">{c.desc}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>{c.status}</span>
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
