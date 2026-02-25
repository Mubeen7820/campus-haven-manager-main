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
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
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
import { leafService, Leaf } from "@/services/leafService";

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState<Leaf[]>([]);
    const [search, setSearch] = useState("");
    const [selectedLeave, setSelectedLeave] = useState<Leaf | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = async () => {
        try {
            const data = await leafService.fetchLeaves();
            setLeaves(data);
        } catch (error) {
            console.error("Failed to load leaves:", error);
            toast.error("Failed to load leave requests");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeaves = leaves.filter((l) => {
        const studentName = l.students?.name || "Unknown";
        const roomNumber = l.students?.rooms?.room_number || "Unknown";
        return (
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleStatusChange = async (id: number, newStatus: "Approved" | "Rejected") => {
        try {
            await leafService.updateLeafStatus(id, newStatus);
            setLeaves((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
            );
            toast.success(`Leave request ${newStatus.toLowerCase()} successfully`);
            if (selectedLeave?.id === id) {
                setSelectedLeave(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: Leaf["status"]) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leave Requests"
                description="Review and manage student leave applications"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Student or Room..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredLeaves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{leave.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">From:</span> {new Date(leave.start_date).toLocaleDateString()}
                                            <br />
                                            <span className="text-muted-foreground">To:</span> {new Date(leave.end_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={leave.reason}>
                                        {leave.reason}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                                        >
                                            {leave.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => setSelectedLeave(leave)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {leave.status === "Pending" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                                        onClick={() => handleStatusChange(leave.id, "Approved")}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                                                        onClick={() => handleStatusChange(leave.id, "Rejected")}
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
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
            <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>Review full details of the leave application</DialogDescription>
                    </DialogHeader>
                    {selectedLeave && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Student Name</h4>
                                    <p className="text-base">{selectedLeave.students?.name || "Unknown"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Room Number</h4>
                                    <p className="text-base">{selectedLeave.students?.rooms?.room_number || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                                    <p className="text-base">{new Date(selectedLeave.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                                    <p className="text-base">{new Date(selectedLeave.end_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                                <p className="text-base p-3 bg-muted rounded-md mt-1">{selectedLeave.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLeave.status)}`}
                                >
                                    {selectedLeave.status}
                                </span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedLeave?.status === "Pending" && (
                            <>
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => selectedLeave && handleStatusChange(selectedLeave.id, "Rejected")}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => selectedLeave && handleStatusChange(selectedLeave.id, "Approved")}
                                >
                                    Approve
                                </Button>
                            </>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedLeave(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLeaves;
