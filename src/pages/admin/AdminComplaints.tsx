import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, Eye } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { complaintService, Complaint } from "@/services/complaintService";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Resolved">("All");
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const data = await complaintService.fetchComplaints();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to load complaints:", error);
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredComplaints = complaints.filter((c) => {
        const studentName = c.students?.name || "Unknown";
        const roomNumber = c.students?.rooms?.room_number || "Unknown";
        const matchesSearch =
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleResolve = async (id: number) => {
        try {
            await complaintService.updateComplaintStatus(id, "Resolved");
            setComplaints((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: "Resolved", resolved_at: new Date().toISOString() } : c))
            );
            toast.success("Complaint resolved successfully");
            if (selectedComplaint?.id === id) {
                setSelectedComplaint((prev) => (prev ? { ...prev, status: "Resolved" } : null));
            }
        } catch (error) {
            console.error("Failed to resolve complaint:", error);
            toast.error("Failed to resolve complaint");
        }
    };

    const getStatusColor = (status: Complaint["status"]) => {
        return status === "Resolved"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    };

    const getPriorityColor = (priority: Complaint["priority"]) => {
        switch (priority) {
            case "High": return "text-red-600 font-medium";
            case "Medium": return "text-orange-600";
            case "Low": return "text-blue-600";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Complaints"
                description="View and resolve student complaints"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search complaints..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        value={statusFilter}
                        onValueChange={(val: "All" | "Pending" | "Resolved") => setStatusFilter(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Complaints</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredComplaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredComplaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="font-medium">{complaint.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{complaint.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>{complaint.category}</TableCell>
                                    <TableCell className={getPriorityColor(complaint.priority)}>
                                        {complaint.priority}
                                    </TableCell>
                                    <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => setSelectedComplaint(complaint)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {complaint.status === "Pending" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                                    onClick={() => handleResolve(complaint.id)}
                                                    title="Mark as Resolved"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Dialog */}
            <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complaint Details</DialogTitle>
                        <DialogDescription>Full details of the issue reported</DialogDescription>
                    </DialogHeader>
                    {selectedComplaint && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Student</h4>
                                    <p className="text-base">{selectedComplaint.students?.name || "Unknown"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Room</h4>
                                    <p className="text-base">{selectedComplaint.students?.rooms?.room_number || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                    <p className="text-base">{selectedComplaint.category}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                    <p className="text-base">{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                                    <span className={`text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                                        {selectedComplaint.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}
                                    >
                                        {selectedComplaint.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedComplaint?.status === "Pending" && (
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => selectedComplaint && handleResolve(selectedComplaint.id)}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Resolved
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminComplaints;
