import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "accent" | "success" | "info" | "destructive";
}

const colorMap = {
  primary: "bg-blue-50 text-blue-600",
  accent: "bg-orange-50 text-orange-600",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-sky-50 text-sky-600",
  destructive: "bg-rose-50 text-rose-600",
};

const StatCard = ({ title, value, icon, trend, trendUp, color = "primary" }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileHover={{ y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">{title}</p>
        <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${trendUp ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
              {trendUp ? "↑" : "↓"}
            </span>
            <p className={`text-xs font-bold ${trendUp ? "text-emerald-600" : "text-rose-500"}`}>
              {trend}
            </p>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
