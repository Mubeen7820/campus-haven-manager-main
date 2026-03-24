import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { messService, MessAttendance } from "@/services/messService";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Utensils, Calendar, Clock, CheckCircle2, Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const StudentAttendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<MessAttendance[]>([]);
    const [studentData, setStudentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadAttendance = async () => {
        try {
            if (!user) return;
            setIsLoading(true);

            // 1. Get student ID from profile (Proactive check)
            let student = await studentService.getStudentByProfileId(user.id);
            
            if (student) {
                setStudentData(student);
                console.log("Student record found:", student.id);
                // 2. Fetch specific student attendance
                const data = await messService.fetchAttendanceByStudentId(student.id);
                setAttendance(data);
            } else {
                console.warn("No student record linked to profile ID:", user.id);
            }
        } catch (error) {
            console.error("Failed to load attendance:", error);
            toast.error("Failed to load attendance history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();

        // Add real-time listener
        const channel = supabase
            .channel('student-attendance-changes')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'mess_attendance' }, 
                () => {
                    loadAttendance(); // Refresh when any new attendance is marked
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const filteredAttendance = attendance.filter(item => 
        item.meal_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(item.marked_at).toLocaleDateString().includes(searchTerm)
    );

    // Calculate Analytics (Full History - Real Data)
    const today = new Date();
    const joinDate = studentData?.created_at ? new Date(studentData.created_at) : today;
    
    // Difference in days
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const daysSinceJoining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    const expectedTotal = daysSinceJoining * 3; // 3 meals per day
    const presentCount = attendance.filter(a => 
        ['Breakfast', 'Lunch', 'Dinner'].includes(a.meal_type)
    ).length;
    const absentCount = Math.max(0, expectedTotal - presentCount);

    const getMealIcon = (type: string) => {
        switch(type) {
            case 'Breakfast': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'Lunch': return <Utensils className="w-4 h-4 text-green-500" />;
            case 'Snacks': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Dinner': return <Utensils className="w-4 h-4 text-purple-500" />;
            default: return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Attendance"
                description="Your personal record of meals taken in the mess"
            />

            {/* Analytics Summary Cards (Requested Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <p className="text-xl font-medium text-slate-800">Total</p>
                    <h3 className="text-4xl font-black text-blue-800">{expectedTotal}</h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-xl font-medium text-slate-800">Present</p>
                    </div>
                    <h3 className="text-4xl font-black text-green-600">{presentCount}</h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center h-40"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center">
                            <span className="text-red-500 font-bold text-xl">✕</span>
                        </div>
                        <p className="text-xl font-medium text-slate-800">Absent</p>
                    </div>
                    <h3 className="text-4xl font-black text-red-600 underline decoration-red-200 underline-offset-8">{absentCount}</h3>
                </motion.div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-black text-slate-900">Attendance History</h3>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search meals or dates..." 
                            className="pl-9 bg-slate-50 border-none rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Meal Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Info className="w-8 h-8 text-slate-200" />
                                            <p className="text-slate-400 font-medium italic">No attendance records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((record, index) => (
                                    <motion.tr 
                                        key={record.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    {getMealIcon(record.meal_type)}
                                                </div>
                                                <span className="font-bold text-slate-700">{record.meal_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {new Date(record.marked_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium tabular-nums">
                                            {new Date(record.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">
                                                Present
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
