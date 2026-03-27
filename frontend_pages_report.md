# Campus Haven Manager: Frontend Pages Source Code

This document contains the complete source code for all dashboard pages across the three main roles: Admin, Student, and Mess Staff.

---

## 1. Admin Dashboard Pages

### AdminDashboard.tsx
```tsx
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

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    roomsOccupied: 0,
    totalRooms: 0,
    paymentsCollected: 0,
    openComplaints: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, rooms, payments, complaints] = await Promise.all([
          studentService.fetchStudents(),
          roomService.fetchRooms(),
          paymentService.fetchPayments(),
          complaintService.fetchComplaints(),
        ]);

        const totalStudents = students.length;
        const totalRooms = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const occupied = rooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0);
        const totalPayments = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
        const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

        setStats({ totalStudents, roomsOccupied: occupied, totalRooms, paymentsCollected: totalPayments, openComplaints: openComplaintsCount });
        setRecentComplaints(complaints.slice(0, 5).map(c => ({ id: c.id, student: c.students?.name || 'Unknown', type: c.category || 'General', status: c.status, desc: c.title })));
        setOccupancyData([{ name: "Occupied", value: occupied }, { name: "Vacant", value: totalRooms - occupied }]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of hostel operations" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users className="w-6 h-6" />} trend="Total enrolled" trendUp color="primary" />
        <StatCard title="Hostel Occupancy" value={`${stats.roomsOccupied}/${stats.totalRooms}`} icon={<BedDouble className="w-6 h-6" />} trend={`${stats.totalRooms > 0 ? Math.round((stats.roomsOccupied / stats.totalRooms) * 100) : 0}% capacity used`} trendUp color="accent" />
        <StatCard title="Revenue Collected" value={`₹${(stats.paymentsCollected / 100000).toFixed(2)}L`} icon={<CreditCard className="w-6 h-6" />} trend="Current Academic Year" trendUp color="success" />
        <StatCard title="Active Complaints" value={stats.openComplaints} icon={<MessageSquareWarning className="w-6 h-6" />} trend="Urgent action required" trendUp={false} color="destructive" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold mb-4">Finance Overview</h3>
           <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
```

---

## 2. Student Dashboard Pages

### StudentDashboard.tsx
```tsx
import PageHeader from "@/components/PageHeader";
import { BedDouble, UtensilsCrossed, FileText, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { messService, MessMenu } from "@/services/messService";
import { studentService, Student } from "@/services/studentService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [menuData, sData] = await Promise.all([
        messService.fetchMenu(),
        user?.id ? studentService.getStudentByProfileId(user.id) : null
      ]);
      setMenu(menuData);
      setStudentData(sData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-extrabold text-[#0f172a]">Student Dashboard</h1>
      <p className="text-slate-500">Welcome back, <span className="text-orange-600 font-bold">{user?.name}</span> 👋</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
           <p className="text-xs font-bold text-slate-400 uppercase">Room</p>
           <h3 className="text-xl font-black">{studentData?.rooms?.room_number || "Unassigned"}</h3>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
           <p className="text-xs font-bold text-slate-400 uppercase">Profile</p>
           <h3 className="text-xl font-black">Verified</h3>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;
```

---

## 3. Mess Staff Dashboard Pages

### MessDashboard.tsx
```tsx
import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { UtensilsCrossed, Users, Package } from "lucide-react";
import { messService, MessInventory } from "@/services/messService";
import { studentService } from "@/services/studentService";

const MessDashboard = () => {
  const [inventory, setInventory] = useState<MessInventory[]>([]);
  const [stats, setStats] = useState({ expectedMeals: 0, totalStudents: 0 });

  const fetchDashboardData = useCallback(async () => {
    try {
      const students = await studentService.fetchStudents();
      const invData = await messService.fetchInventory();
      setInventory(invData);
      setStats({ expectedMeals: students.length * 3, totalStudents: students.length });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  return (
    <div className="p-4 space-y-8">
      <PageHeader title="Mess Dashboard" description="Kitchen operations management" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Expected Meals" value={stats.expectedMeals} icon={<UtensilsCrossed />} color="primary" />
        <StatCard title="Active Diners" value={stats.totalStudents} icon={<Users />} color="accent" />
      </div>
    </div>
  );
};
export default MessDashboard;
```
