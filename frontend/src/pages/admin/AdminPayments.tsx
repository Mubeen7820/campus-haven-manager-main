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
import { Search, Plus, DollarSign, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { paymentService, Payment } from "@/services/paymentService";

const AdminPayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [students, setStudents] = useState<{ id: number; name: string; admission_no: string }[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending" | "Failed">("All");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        student_id: 0,
        amount: 5000,
        type: "Hostel Fee" as Payment['type'],
        status: "Pending" as Payment['status'],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [pData, sData] = await Promise.all([
                paymentService.fetchPayments(),
                import("@/services/studentService").then(m => m.studentService.fetchStudents())
            ]);
            setPayments(pData);
            setStudents(sData.map(s => ({ id: s.id, name: s.name, admission_no: s.admission_no })));
        } catch (error: unknown) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load payments and students");
        } finally {
            setIsLoading(false);
        }
    };

    const loadPayments = async () => {
        try {
            const data = await paymentService.fetchPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to load payments:", error);
            toast.error("Failed to load payments");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPayments = payments.filter((p) => {
        const studentName = p.students?.name || "Unknown";
        const roomNumber = p.students?.rooms?.room_number || "Unknown";
        const matchesSearch =
            studentName.toLowerCase().includes(search.toLowerCase()) ||
            roomNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.student_id || !formData.amount) {
            toast.error("Please select a Student and enter Amount");
            return;
        }

        setIsSubmitting(true);
        try {
            await paymentService.createPayment({
                student_id: formData.student_id,
                amount: formData.amount,
                type: formData.type,
                status: formData.status,
            });
            toast.success("Payment recorded successfully");
            const pData = await paymentService.fetchPayments();
            setPayments(pData);
            setIsDialogOpen(false);
            setFormData({ student_id: 0, amount: 5000, type: "Hostel Fee", status: "Pending" });
        } catch (error: unknown) {
            console.error("Failed to create payment:", error);
            toast.error("Failed to create payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: Payment["status"]) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Failed": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Payments"
                description="Track and manage student fee payments"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Student or Room..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={statusFilter}
                            onValueChange={(val: "All" | "Paid" | "Pending" | "Failed") => setStatusFilter(val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Payments</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Record Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Payment</DialogTitle>
                            <DialogDescription>
                                Enter student details and payment information to record a new transaction.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Select Student</Label>
                                <Select
                                    value={formData.student_id ? formData.student_id.toString() : ""}
                                    onValueChange={(val) => handleInputChange("student_id", parseInt(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Search Student..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name} ({s.admission_no})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Payment Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => handleInputChange("type", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hostel Fee">Hostel Fee</SelectItem>
                                        <SelectItem value="Mess Fee">Mess Fee</SelectItem>
                                        <SelectItem value="Fine">Fine</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₹)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange("amount", parseInt(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: Payment['status']) => handleInputChange("status", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending (Bill Student)</SelectItem>
                                        <SelectItem value="Paid">Paid (Confirmed)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Recording..." : "Record Payment"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.students?.name || "Unknown"}</TableCell>
                                    <TableCell>{payment.students?.rooms?.room_number || "-"}</TableCell>
                                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>{payment.type}</TableCell>
                                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-sm">{payment.transaction_id || "-"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminPayments;
