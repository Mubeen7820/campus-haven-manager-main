import { useState, useEffect, useRef } from "react";
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
import { Plus, Search, Edit, Trash2, RefreshCw, Camera } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { studentService, Student } from "@/services/studentService";
import { roomService } from "@/services/roomService";
import { supabase } from "@/lib/supabase";

const AdminStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [rooms, setRooms] = useState<{ id: number; room_number: string; block: string }[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        password: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [sData, rData] = await Promise.all([
                studentService.fetchStudents(),
                roomService.fetchRooms()
            ]);
            setStudents(sData);
            setRooms(rData.map(r => ({ id: r.id, room_number: r.room_number, block: r.block })));
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

        if (!formData.name || !formData.room_id) {
            toast.error("Please fill in all required fields (Name, Assigned Room)");
            return;
        }

        try {
            const studentData = {
                name: formData.name,
                room_id: formData.room_id,
                admission_no: formData.admission_no || `ADM-${Date.now()}`,
                parent_name: formData.parent_name || "Unknown",
                parent_phone: formData.parent_phone || "",
                course: formData.course || "B.Tech",
                year: formData.year || 1,
                blood_group: formData.blood_group || "Unknown",
                emergency_contact: formData.emergency_contact || "",
                email: formData.email || null,
                password: formData.password || undefined,
            };

            if (editingId) {
                await studentService.updateStudent(editingId, studentData);
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
            const errorMessage = error instanceof Error ? error.message : "Failed to save student";
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

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const student = students.find(s => s.id === editingId);
        if (!student || !student.profile_id) {
            toast.error("Student must have a registered login before uploading a photo.");
            return;
        }

        setUploadingAvatar(true);
        try {
            const ext = file.name.split(".").pop();
            const fileName = `${student.profile_id}-${Date.now()}.${ext}`;
            const filePath = `avatars/${fileName}`;
            
            const { error: uploadErr } = await supabase.storage
              .from("avatars")
              .upload(filePath, file);
              
            if (uploadErr) throw uploadErr;
            
            const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = publicData.publicUrl;
            
            const { error: updateErr } = await supabase
              .from("profiles")
              .update({ avatar_url: publicUrl })
              .eq("id", student.profile_id);
              
            if (updateErr) throw updateErr;

            toast.success("Student profile photo updated successfully!");
            await loadData(); 
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Failed to upload photo";
            toast.error("Failed to upload photo: " + errorMessage);
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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
            password: generatePassword()
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
            password: ""
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
            password: ""
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await studentService.deleteStudent(id);
            toast.success("Student removed successfully");
            loadData();
        } catch (error: unknown) {
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
                        {editingId && (
                            <div className="flex items-center gap-4 py-2 border-b border-slate-100 mb-2">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                    {students.find(s => s.id === editingId)?.profiles?.avatar_url ? (
                                        <img src={students.find(s => s.id === editingId)!.profiles!.avatar_url!} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-slate-400">{formData.name.charAt(0) || "?"}</span>
                                    )}
                                </div>
                                <div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar || !students.find(s => s.id === editingId)?.profile_id}>
                                        <Camera className="w-4 h-4 mr-2" />
                                        {uploadingAvatar ? "Uploading..." : "Change Photo"}
                                    </Button>
                                    {!students.find(s => s.id === editingId)?.profile_id && (
                                        <p className="text-xs text-slate-400 mt-1">Student must have a login to upload a photo.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
                                            {rooms.map(r => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    {r.block} - Room {r.room_number}
                                                </SelectItem>
                                            ))}
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
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                                    {student.profiles?.avatar_url ? (
                                                        <img src={student.profiles.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-400">{student.name.charAt(0)}</span>
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
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
