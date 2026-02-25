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
import { roomService, Room } from "@/services/roomService";

const AdminRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
    }, []);

    const loadRooms = async () => {
        try {
            const data = await roomService.fetchRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
            toast.error("Failed to load rooms");
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
            case "Occupied": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"; // Changed Full to Occupied
            case "Maintenance": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-700";
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
            </div>

            {/* Data Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Block</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Occupancy</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredRooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No rooms found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.room_number}</TableCell>
                                    <TableCell>{room.block}</TableCell>
                                    <TableCell>{room.type}</TableCell>
                                    <TableCell>
                                        {room.current_occupancy} / {room.capacity}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}
                                        >
                                            {room.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => openEditDialog(room)}
                                            >
                                                <Edit className="h-4 w-4" />
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

export default AdminRooms;
