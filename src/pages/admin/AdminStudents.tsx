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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { studentService, Student } from "@/services/studentService";
import { roomService, Room } from "@/services/roomService";

const AdminStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        room: "",
        block: "",
        admission_no: "",
        parent_name: "",
        parent_phone: "",
        email: "",
    });

    useEffect(() => {
        loadStudents();
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await roomService.fetchRooms();
            setAvailableRooms(data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        }
    };

    const loadStudents = async () => {
        try {
            const data = await studentService.fetchStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students:", error);
            toast.error("Failed to load students");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.admission_no && s.admission_no.toLowerCase().includes(search.toLowerCase())) ||
            (s.rooms?.room_number && s.rooms.room_number.toLowerCase().includes(search.toLowerCase()))
    );

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.room || !formData.block) {
            toast.error("Please fill in all required fields (Name, Block, Room)");
            return;
        }

        try {
            // Find room
            const room = await roomService.getRoomByNumberAndBlock(formData.room, formData.block);
            if (!room) {
                toast.error(`Room ${formData.room} in ${formData.block} not found.`);
                return;
            }

            const studentData = {
                name: formData.name,
                room_id: room.id,
                admission_no: formData.admission_no || `ADM-${Date.now()}`,
                parent_name: formData.parent_name || "Unknown",
                parent_phone: formData.parent_phone || "",
                course: "B.Tech",
                year: 1,
                blood_group: "Unknown",
                emergency_contact: "",
                status: "Active" as const,
                email: formData.email || null,
            };

            if (editingId) {
                await studentService.updateStudent(editingId, studentData);
                toast.success("Student updated successfully");
            } else {
                await studentService.createStudent(studentData);
                toast.success("Student added successfully");
            }

            await loadStudents();
            closeDialog();
        } catch (error) {
            console.error("Error saving student:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to save student";
            toast.error(errorMessage);
        }
    };

    const openEditDialog = (student: Student) => {
        setFormData({
            name: student.name,
            room: student.rooms?.room_number || "",
            block: student.rooms?.block || "",
            admission_no: student.admission_no,
            parent_name: student.parent_name,
            parent_phone: student.parent_phone,
            email: student.email || "",
        });
        setEditingId(student.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ name: "", room: "", block: "", admission_no: "", parent_name: "", parent_phone: "", email: "" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await studentService.deleteStudent(id);
            toast.success("Student removed successfully");
            loadStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Failed to delete student");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Students"
                description="Add, update, and manage student records"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingId(null)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Rahul Verma"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admission_no">Admission No</Label>
                                    <Input
                                        id="admission_no"
                                        placeholder="e.g. ADM001"
                                        value={formData.admission_no}
                                        onChange={(e) => handleInputChange("admission_no", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Student Email (Login Email)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Linking this email allows the student to see their details.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="block">Block</Label>
                                        <Select
                                            value={formData.block}
                                            onValueChange={(val) => handleInputChange("block", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Block" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Block A">Block A</SelectItem>
                                                <SelectItem value="Block B">Block B</SelectItem>
                                                <SelectItem value="Block C">Block C</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room">Room Number</Label>
                                        <Select
                                            value={formData.room}
                                            onValueChange={(val) => handleInputChange("room", val)}
                                            disabled={!formData.block}
                                        >
                                            <SelectTrigger id="room">
                                                <SelectValue placeholder={formData.block ? "Select Room" : "Select Block first"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRooms
                                                    .filter(r => r.block === formData.block)
                                                    .map(r => (
                                                        <SelectItem key={r.id} value={r.room_number}>
                                                            {r.room_number} ({r.current_occupancy}/{r.capacity})
                                                        </SelectItem>
                                                    ))
                                                }
                                                {formData.block && availableRooms.filter(r => r.block === formData.block).length === 0 && (
                                                    <div className="p-2 text-xs text-muted-foreground text-center">No rooms found in this block</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone">Parent Phone</Label>
                                    <Input
                                        id="parent_phone"
                                        placeholder="Parent's Mobile"
                                        value={formData.parent_phone}
                                        onChange={(e) => handleInputChange("parent_phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Student"}</Button>
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
                            <TableHead>Admission No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Block / Room</TableHead>
                            <TableHead>Parent Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono text-xs">{student.admission_no}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{student.rooms?.room_number || "Unassigned"}</span>
                                            <span className="text-xs text-muted-foreground">{student.rooms?.block || ""}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.parent_phone || "-"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.status === "Active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => openEditDialog(student)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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

export default AdminStudents;
