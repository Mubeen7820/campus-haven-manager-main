import { useState, useEffect, useCallback } from "react";
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
import { QrCode, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { messService, MessAttendance as IMessAttendance } from "@/services/messService";

const MessAttendance = () => {
    const [logs, setLogs] = useState<IMessAttendance[]>([]);
    const [studentId, setStudentId] = useState("");
    const [selectedMeal, setSelectedMeal] = useState<"Breakfast" | "Lunch" | "Snacks" | "Dinner">("Breakfast");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadAttendance = useCallback(async () => {
        try {
            const data = await messService.fetchAttendance();
            setLogs(data);
        } catch (error) {
            console.error("Failed to load attendance:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Set default meal based on current time
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setSelectedMeal("Breakfast");
        else if (hour < 16) setSelectedMeal("Lunch");
        else if (hour < 19) setSelectedMeal("Snacks");
        else setSelectedMeal("Dinner");

        loadAttendance();
    }, [loadAttendance]);

    const handleMarkAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputId = studentId.trim();
        if (!inputId) {
            toast.error("Please enter a Student ID");
            return;
        }

        try {
            setIsSubmitting(true);
            await messService.markAttendance(inputId, selectedMeal);
            toast.success(`Attendance marked for ${inputId}`);
            setStudentId("");
            loadAttendance(); // Refresh list
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to mark attendance. Check if ID is correct.";
            console.error("Failed to mark attendance:", error);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Meal Attendance"
                description="Mark and track student meal attendance"
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Attendance Marking Section */}
                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5 text-primary" />
                            Mark Attendance
                        </CardTitle>
                        <CardDescription>Enter Admission Number to mark attendance manually</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Meal</label>
                                <Select
                                    value={selectedMeal}
                                    onValueChange={(val: "Breakfast" | "Lunch" | "Snacks" | "Dinner") => setSelectedMeal(val)}
                                >
                                    <SelectTrigger className="w-full">
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
                                <label className="text-sm font-medium">Admission Number</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. ADM2024001"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        autoFocus
                                        disabled={isSubmitting}
                                    />
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark"}
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-2 text-center text-[10px] text-muted-foreground bg-muted/30 p-2 rounded-lg border border-dashed">
                                <p>Ensure the ID matches the admission number in records.</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card className="shadow-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-accent" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest attendance logs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : logs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4 italic text-sm">No activity recorded for today.</p>
                            ) : (
                                logs.slice(0, 5).map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-success/10 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{log.students?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                                    {log.meal_type} • {log.students?.admission_no}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            {new Date(log.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full Logs Table */}
            <Card className="shadow-card border-border overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg">Daily Attendance History</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[120px]">Time</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Admission No</TableHead>
                                <TableHead>Meal</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                                        No logs found in the database.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium text-xs">
                                            {new Date(log.marked_at).toLocaleDateString()} {new Date(log.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell className="font-bold">{log.students?.name || "System Record"}</TableCell>
                                        <TableCell className="text-muted-foreground">{log.students?.admission_no || "-"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.meal_type === 'Breakfast' ? 'bg-blue-100 text-blue-700' :
                                                    log.meal_type === 'Lunch' ? 'bg-orange-100 text-orange-700' :
                                                        log.meal_type === 'Snacks' ? 'bg-pink-100 text-pink-700' :
                                                            'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {log.meal_type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase">
                                                Verified
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default MessAttendance;
