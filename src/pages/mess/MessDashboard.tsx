import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { UtensilsCrossed, Users, Package, MessageSquareWarning } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const attendanceData = [
  { meal: "Breakfast", present: 320, absent: 167 },
  { meal: "Lunch", present: 410, absent: 77 },
  { meal: "Snacks", present: 280, absent: 207 },
  { meal: "Dinner", present: 395, absent: 92 },
];

const inventory = [
  { item: "Rice (kg)", stock: 250, min: 100, status: "Good" },
  { item: "Wheat Flour (kg)", stock: 80, min: 100, status: "Low" },
  { item: "Cooking Oil (L)", stock: 45, min: 30, status: "Good" },
  { item: "Lentils (kg)", stock: 60, min: 50, status: "Good" },
  { item: "Sugar (kg)", stock: 20, min: 40, status: "Critical" },
  { item: "Milk (L)", stock: 100, min: 80, status: "Good" },
];

const stockStatus: Record<string, string> = {
  Good: "bg-success/10 text-success",
  Low: "bg-warning/10 text-warning",
  Critical: "bg-destructive/10 text-destructive",
};

const MessDashboard = () => (
  <div>
    <PageHeader title="Mess Dashboard" description="Kitchen operations overview" />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatCard title="Today's Meals" value="1,405" icon={<UtensilsCrossed className="w-5 h-5" />} color="primary" />
      <StatCard title="Students Served" value={410} icon={<Users className="w-5 h-5" />} trend="Lunch count" color="accent" />
      <StatCard title="Inventory Items" value={24} icon={<Package className="w-5 h-5" />} trend="3 low stock" color="info" />
      <StatCard title="Mess Complaints" value={5} icon={<MessageSquareWarning className="w-5 h-5" />} trend="2 new" color="destructive" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="font-semibold font-display text-lg mb-4">Today's Meal Attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
            <XAxis dataKey="meal" stroke="hsl(215, 16%, 47%)" fontSize={12} />
            <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="present" fill="hsl(142, 71%, 45%)" name="Present" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="hsl(214, 20%, 88%)" name="Absent" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Inventory */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold font-display text-lg">Inventory Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Item</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Stock</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Min Required</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.item} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-6 font-medium">{item.item}</td>
                  <td className="py-3 px-6">{item.stock}</td>
                  <td className="py-3 px-6 text-muted-foreground">{item.min}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus[item.status]}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </div>
);

export default MessDashboard;
