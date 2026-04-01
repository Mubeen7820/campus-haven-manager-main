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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { roomService, Room } from "@/services/roomService";
import { studentService, Student } from "@/services/studentService";
import { supabase } from "@/lib/supabase";

const AdminRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        room_number: "",
        block: "",
        floor: 1,
        type: "AC" as Room['type'],
        capacity: 1,
        status: "Available" as Room['status']
    });

    useEffect(() => {
        loadRooms();

        const subscription = supabase
            .channel('rooms_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
                loadRooms();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadRooms = async () => {
        try {
            const [rData, sData] = await Promise.all([
                roomService.fetchRooms(),
                studentService.fetchStudents()
            ]);
            setRooms(rData);
            setStudents(sData);
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load room data");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRooms = rooms.filter(
        (r) =>
            r.room_number.toLowerCase().includes(search.toLowerCase()) ||
            r.block.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.room_number || !formData.block) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingId) {
                await roomService.updateRoom(editingId, formData);
                toast.success("Room updated successfully");
            } else {
                await roomService.createRoom({
                    room_number: formData.room_number,
                    block: formData.block,
                    floor: formData.floor,
                    type: formData.type,
                    capacity: formData.capacity,
                    status: formData.status
                });
                toast.success("Room added successfully");
            }
            loadRooms();
            closeDialog();
        } catch (error) {
            console.error("Error saving room:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to save room";
            toast.error(errorMessage);
        }
    };

    const openEditDialog = (room: Room) => {
        setFormData({
            room_number: room.room_number,
            block: room.block,
            floor: room.floor || 1,
            type: room.type,
            capacity: room.capacity,
            status: room.status
        });
        setEditingId(room.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ room_number: "", block: "", floor: 1, type: "AC", capacity: 1, status: "Available" });
    };

    // Delete is not implemented in roomService yet? Warning: Referential integrity with students.
    // For now, I'll remove delete button or Implement delete in service if I did.
    // I didn't verify deleteRoom in roomService.
    // Let's check roomService content. It has update, create, get, fetch. NO DELETE.
    // So I will remove Delete button for now or implement it.
    // I'll implement it later if asked.

    const getStatusColor = (status: Room["status"]) => {
        switch (status) {
            case "Available": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Occupied": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Maintenance": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const handleDelete = async (id: number | string | undefined) => {
        if (!id) return;
        setDeleteId(Number(id));
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        
        try {
            await roomService.deleteRoom(deleteId);
            toast.success("Room removed from directory successfully.");
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
            await loadRooms();
        } catch (error: any) {
            console.error("Critical error deleting room:", error);
            const msg = error?.message || "Deletion failed. Ensure no foreign constraints exist.";
            toast.error(`Deletion failed: ${msg}`);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Room Management"
                description="Allocate and manage hostel rooms"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Room or Block..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingId(null)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Room" : "Add New Room"}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Enter the details for the room allocation.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
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
                                        <Label htmlFor="room_number">Room Number</Label>
                                        <Input
                                            id="room_number"
                                            placeholder="e.g. 101"
                                            value={formData.room_number}
                                            onChange={(e) => handleInputChange("room_number", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val: "AC" | "Non-AC") => handleInputChange("type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AC">AC</SelectItem>
                                                <SelectItem value="Non-AC">Non-AC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity_type">Occupancy Type</Label>
                                        <Select
                                            value={formData.capacity === 1 ? "Single" : formData.capacity === 2 ? "Double" : "Triple"}
                                            onValueChange={(val) => {
                                                const caps: Record<string, number> = { Single: 1, Double: 2, Triple: 3 };
                                                handleInputChange("capacity", caps[val] || 1);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Occupancy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">Single (1)</SelectItem>
                                                <SelectItem value="Double">Double (2)</SelectItem>
                                                <SelectItem value="Triple">Triple (3)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Capacity (Auto)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Room"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Custom Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">Delete Room?</DialogTitle>
                            <DialogDescription className="pt-2 text-slate-500 font-medium">
                                This action will permanently remove this room record. Students assigned to this room will be unassigned.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-6 flex gap-3">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">Delete Room</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Room Directory</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Manage allocations and maintenance status</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Room Number</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Occupancy</th>
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
                                            <p className="text-sm font-bold text-slate-400">Syncing room data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No rooms located in this search.</td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => {
                                    const curOcc = students.filter(s => s.room_id === room.id).length;
                                    const isFull = curOcc >= room.capacity;
                                    const displayStatus = isFull ? "Occupied" : room.status;

                                    return (
                                        <tr key={room.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-8 font-bold text-[#0f172a]">{room.room_number}</td>
                                            <td className="py-5 px-6">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter bg-slate-100 px-2 py-1 rounded-lg">{room.block}</span>
                                            </td>
                                            <td className="py-5 px-6 font-medium text-slate-500">{room.type}</td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-500 rounded-full ${
                                                                isFull ? 'bg-amber-500' : 'bg-blue-500'
                                                            }`}
                                                            style={{ width: `${Math.min((curOcc / room.capacity) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-400 tracking-tighter">
                                                        {curOcc} / {room.capacity}
                                                    </span>
                                                </div>
                                            </td>
                                        <td className="py-5 px-6">
                                            <span
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                                    displayStatus === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    displayStatus === "Occupied" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}
                                            >
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(room)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(room.id);
                                                    }}
                                                    type="button"
                                                    className="relative z-30 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100 cursor-pointer shadow-sm"
                                                    title="Delete Room"
                                                >
                                                    <Trash2 className="h-4 w-4 pointer-events-none" />
                                                </button>
                                            </div>
                                        </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRooms;
