import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import { QrCode, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface AttendanceLog {
    id: string;
    studentName: string;
    room: string;
    meal: "Breakfast" | "Lunch" | "Snacks" | "Dinner";
    time: string;
    status: "Marked";
}

const mockLogs: AttendanceLog[] = [
    { id: "1", studentName: "Priya Sharma", room: "B-204", meal: "Lunch", time: "12:30 PM", status: "Marked" },
    { id: "2", studentName: "Rahul Verma", room: "B-205", meal: "Lunch", time: "12:35 PM", status: "Marked" },
];

const MessAttendance = () => {
    const [logs, setLogs] = useState<AttendanceLog[]>(mockLogs);
    const [studentId, setStudentId] = useState("");
    const [selectedMeal, setSelectedMeal] = useState<"Breakfast" | "Lunch" | "Snacks" | "Dinner">("Breakfast");

    // Set default meal based on current time
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setSelectedMeal("Breakfast");
        else if (hour < 16) setSelectedMeal("Lunch");
        else if (hour < 19) setSelectedMeal("Snacks");
        else setSelectedMeal("Dinner");
    }, []);

    const handleMarkAttendance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId.trim()) {
            toast.error("Please enter a Student ID");
            return;
        }

        // Simulate identifying student
        const newLog: AttendanceLog = {
            id: Math.random().toString(36).substr(2, 9),
            studentName: `Student ${studentId}`, // Mock name
            room: "Unknown", // Mock room
            meal: selectedMeal,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "Marked",
        };

        setLogs((prev) => [newLog, ...prev]);
        toast.success(`Attendance marked for Student ${studentId}`);
        setStudentId("");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Meal Attendance"
                description="Mark and track student meal attendance"
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Attendance Marking Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Mark Attendance
                        </CardTitle>
                        <CardDescription>Enter Student ID to mark attendance manually</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Meal</label>
                                <Select
                                    value={selectedMeal}
                                    onValueChange={(val: "Breakfast" | "Lunch" | "Snacks" | "Dinner") => setSelectedMeal(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                                        <SelectItem value="Lunch">Lunch</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                        <SelectItem value="Dinner">Dinner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Student ID / Roll No</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter ID..."
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        autoFocus
                                    />
                                    <Button type="submit">Mark</Button>
                                </div>
                            </div>
                            <div className="pt-2 text-center text-sm text-muted-foreground">
                                <p>Scanner integration coming soon.</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest attendance logs for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {logs.slice(0, 5).map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{log.studentName}</p>
                                            <p className="text-xs text-muted-foreground">{log.room} • {log.meal}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        {log.time}
                                    </span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No attendance marked yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Meal</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.time}</TableCell>
                                    <TableCell className="font-medium">{log.studentName}</TableCell>
                                    <TableCell>{log.room}</TableCell>
                                    <TableCell>{log.meal}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            {log.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MessAttendance;
