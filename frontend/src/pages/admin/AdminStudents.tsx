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
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, RefreshCw, Users, Camera } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { studentService, Student } from "@/services/studentService";
import { roomService } from "@/services/roomService";
import { blockService, Block } from "@/services/blockService";
import { supabase } from "@/lib/supabase";

const AdminStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [rooms, setRooms] = useState<{ id: number; room_number: string; block: string; capacity: number; current_occupancy: number }[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        admission_no: "",
        name: "",
        course: "",
        year: 1,
        room_id: undefined as number | undefined,
        parent_name: "",
        parent_phone: "",
        blood_group: "",
        emergency_contact: "",
        email: "",
        password: "",
        avatar_url: ""
    });

    // We store profiles to link avatars
    const [profiles, setProfiles] = useState<Record<string, string>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [sData, rData, pData, bData] = await Promise.all([
                studentService.fetchStudents(),
                roomService.fetchRooms(),
                supabase.from('profiles').select('id, avatar_url'),
                blockService.fetchBlocks().catch(() => [] as Block[])
            ]);
            setStudents(sData);
            setRooms(rData.map(r => ({ 
                id: r.id, 
                room_number: r.room_number, 
                block: r.block,
                capacity: r.capacity,
                current_occupancy: r.current_occupancy
            })));
            setBlocks(bData);
            
            // Create a mapping of profile_id to avatar_url
            const profileMap: Record<string, string> = {};
            pData.data?.forEach(p => {
                if (p.avatar_url) profileMap[p.id] = p.avatar_url;
            });
            setProfiles(profileMap);
        } catch (error: unknown) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load students and rooms");
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

    const handleInputChange = (field: keyof typeof formData, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Please fill in the student's name");
            return;
        }

        try {
            // Check room capacity using real-time count from student list
            const selectedRoomIdStr = formData.room_id ? String(formData.room_id) : "none";
            
            if (selectedRoomIdStr !== "none") {
                const selectedRoomIdNum = Number(selectedRoomIdStr);
                const room = rooms.find(r => r.id === selectedRoomIdNum);
                
                if (room) {
                    // Count actual students currently in this room right now
                    const actualOccupancy = students.filter(s => s.room_id === selectedRoomIdNum).length;
                    
                    console.log(`Verifying Capacity: Room ${room.room_number}, Max: ${room.capacity}, Current: ${actualOccupancy}`);

                    if (actualOccupancy >= room.capacity) {
                        // Find out if the student we are EDITING is already in this room
                        const originalStudent = editingId ? students.find(s => s.id === editingId) : null;
                        const wasAlreadyInThisRoom = originalStudent && originalStudent.room_id === selectedRoomIdNum;
                        
                        // Only block them if they are a NEW student or are CHANGING into this full room
                        if (!wasAlreadyInThisRoom) {
                            toast.error(
                                `STOP! Room ${room.room_number} is FULL. It only allows ${room.capacity} students and already has ${actualOccupancy}.`, 
                                { duration: 5000 }
                            );
                            return; // PREVENT SUBMISSION
                        }
                    }
                }
            }

            const studentData = {
                name: formData.name,
                room_id: formData.room_id ? Number(formData.room_id) : null,
                admission_no: formData.admission_no || `ADM-${Date.now()}`,
                parent_name: formData.parent_name || "Unknown",
                parent_phone: formData.parent_phone || "",
                course: formData.course || "B.Tech",
                year: formData.year || 1,
                blood_group: formData.blood_group || "Unknown",
                emergency_contact: formData.emergency_contact || "",
                email: formData.email || null,
                password: formData.password || undefined
            };

            if (editingId) {
                await studentService.updateStudent(editingId, studentData);
                
                // Update profile picture separately if modified
                if (formData.avatar_url) {
                    const student = students.find(s => s.id === editingId);
                    if (student?.profile_id) {
                        await supabase.from('profiles').update({ avatar_url: formData.avatar_url }).eq('id', student.profile_id);
                    }
                }
                
                toast.success("Student updated successfully");
            } else {
                await studentService.createStudent({
                    ...studentData,
                    status: "Active" as const,
                });
                toast.success("Student added successfully");
            }

            await loadData();
            closeDialog();
        } catch (error: unknown) {
            console.error("Error saving student:", error);
            
            // Refined error extraction for TypeScript safety
            let errorMessage = "Failed to save student";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = String((error as Record<string, unknown>).message);
            }
            
            // Helpful translation for common permissions errors
            if (errorMessage.includes("row-level security policy") || errorMessage.includes("permission denied")) {
                errorMessage = "Access Denied: Your account doesn't have Admin permissions in the database. Please run the SQL fix script.";
            }
            
            toast.error(errorMessage);
        }
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 8; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    const openAddDialog = () => {
        setEditingId(null);
        setFormData({
            admission_no: "",
            name: "",
            course: "",
            year: 1,
            room_id: undefined,
            parent_name: "",
            parent_phone: "",
            blood_group: "",
            emergency_contact: "",
            email: "",
            password: generatePassword(),
            avatar_url: ""
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (student: Student) => {
        setFormData({
            admission_no: student.admission_no || "",
            name: student.name || "",
            course: student.course || "",
            year: student.year || 1,
            room_id: student.room_id,
            parent_name: student.parent_name || "",
            parent_phone: student.parent_phone || "",
            blood_group: student.blood_group || "",
            emergency_contact: student.emergency_contact || "",
            email: student.email || "",
            password: "",
            avatar_url: student.profile_id ? profiles[student.profile_id] || "" : ""
        });
        setEditingId(student.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            admission_no: "",
            name: "",
            course: "",
            year: 1,
            room_id: undefined,
            parent_name: "",
            parent_phone: "",
            blood_group: "",
            emergency_contact: "",
            email: "",
            password: "",
            avatar_url: ""
        });
    };

    const handleDelete = async (id: number | string | undefined) => {
        if (!id) return;
        setDeleteId(Number(id));
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await studentService.deleteStudent(deleteId);
            toast.success("Student removed successfully.");
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
            await loadData();
        } catch (error: any) {
            console.error("Critical error deleting student:", error);
            const msg = error?.message || "Deletion blocked by records (Complaints/Payments).";
            toast.error(`Deletion failed: ${msg}`);
            setIsDeleteDialogOpen(false);
        }
    };
    

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Students"
                description="Add, update, and manage student records"
            />

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
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Enter student details including login credentials.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            {/* Profile Picture Upload Section */}
                            {editingId && (
                                <div className="flex flex-col items-center justify-center space-y-4 pb-6 border-b border-slate-100">
                                    <div className="relative">
                                        {/* Avatar Container */}
                                        <div className="w-28 h-28 rounded-full border-[3px] border-blue-600 p-0.5 shadow-md bg-white">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                                                {formData.avatar_url ? (
                                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <Users className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Camera Badge over Image */}
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                                            <Camera className="w-4 h-4 text-white" />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                                        </label>
                                    </div>
                                    
                                    {/* Link Text */}
                                    <label className="text-sm font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer decoration-2 underline-offset-4">
                                        Change Profile Photo
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    <Label htmlFor="room_id">Assigned Room</Label>
                                    <Select
                                        value={formData.room_id ? formData.room_id.toString() : "none"}
                                        onValueChange={(val) => handleInputChange("room_id", val === "none" ? undefined : parseInt(val))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Room Assigned</SelectItem>
                                            {(() => {
                                                // Function to normalize name (e.g. "Block A" -> "A")
                                                const normalize = (name: string) => name.replace(/^block\s+/i, '').trim().toUpperCase();

                                                // Dynamically get gender from blocks table
                                                const blockGender: Record<string, string> = {};
                                                blocks.forEach(b => { 
                                                    blockGender[normalize(b.name)] = b.type; 
                                                });
                                                
                                                const grouped: Record<string, typeof rooms> = {};
                                                rooms.forEach(r => {
                                                    if (!grouped[r.block]) grouped[r.block] = [];
                                                    grouped[r.block].push(r);
                                                });
                                                
                                                return Object.entries(grouped).map(([block, blockRooms]) => {
                                                    // Find gender using normalized name
                                                    const gender = blockGender[normalize(block)];
                                                    
                                                    return blockRooms.map(r => (
                                                        <SelectItem key={r.id} value={r.id.toString()}>
                                                            {r.block} {gender ? `(${gender === 'Boys' ? 'Boys' : 'Girls'})` : ''} - Room {r.room_number}
                                                        </SelectItem>
                                                    ));
                                                });
                                            })()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course</Label>
                                    <Input
                                        id="course"
                                        placeholder="e.g. B.Tech CS"
                                        value={formData.course}
                                        onChange={(e) => handleInputChange("course", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Login Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </div>
                                {!editingId && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Login Password (Generated)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="password"
                                                type="text"
                                                placeholder="Initial password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleInputChange("password", generatePassword())}
                                                title="Regenerate Password"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone">Parent Phone</Label>
                                    <Input
                                        id="parent_phone"
                                        placeholder="Emergency contact"
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

                {/* Custom Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">Remove Student?</DialogTitle>
                            <DialogDescription className="pt-2 text-slate-500 font-medium text-sm">
                                This action is permanent. All complaints, payments, and attendance logs for this student will be lost.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-6 flex gap-3">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">Remove Student</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Student Directory</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Comprehensive list of all registered residents</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Admission No</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block / Room</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-slate-400">Loading directory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No students matching your search.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8 font-mono text-[11px] font-black text-slate-400 uppercase tracking-wider">{student.admission_no}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0">
                                                    {student.profile_id && profiles[student.profile_id] ? (
                                                        <img src={profiles[student.profile_id]} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Users className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-700">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0f172a]">{student.rooms?.room_number || "Unassigned"}</span>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{student.rooms?.block || "No Block"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-slate-500 font-medium">{student.parent_phone || "-"}</td>
                                        <td className="py-5 px-6">
                                            <span
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${student.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(student)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm("Are you sure you want to delete this student?")) {
                                                            handleDelete(student.id);
                                                        }
                                                    }}
                                                    type="button"
                                                    className="relative z-30 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100 cursor-pointer shadow-sm"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 className="h-4 w-4 pointer-events-none" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
