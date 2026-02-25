import { useState } from "react";
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

interface Block {
    id: string;
    name: string;
    type: "Boys" | "Girls" | "Staff";
    floors: number;
    warden: string;
    contact: string;
}

const mockBlocks: Block[] = [
    { id: "1", name: "Block A", type: "Boys", floors: 4, warden: "Mr. Ramesh Kumar", contact: "+91 98765 12345" },
    { id: "2", name: "Block B", type: "Girls", floors: 3, warden: "Mrs. Sunita Reddy", contact: "+91 87654 54321" },
    { id: "3", name: "Block C", type: "Staff", floors: 2, warden: "Mr. Suresh Patil", contact: "+91 76543 98765" },
];

const AdminBlocks = () => {
    const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<Block, "id">>({
        name: "",
        type: "Boys",
        floors: 1,
        warden: "",
        contact: "",
    });

    const filteredBlocks = blocks.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.warden.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.warden) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (editingId) {
            setBlocks((prev) =>
                prev.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
            );
            toast.success("Block updated successfully");
        } else {
            const newBlock: Block = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
            };
            setBlocks((prev) => [...prev, newBlock]);
            toast.success("Block added successfully");
        }
        closeDialog();
    };

    const openEditDialog = (block: Block) => {
        setFormData({
            name: block.name,
            type: block.type,
            floors: block.floors,
            warden: block.warden,
            contact: block.contact,
        });
        setEditingId(block.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ name: "", type: "Boys", floors: 1, warden: "", contact: "" });
    };

    const handleDelete = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
        toast.success("Block removed successfully");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Hostel Blocks"
                description="Manage hostel blocks and wings"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Name or Warden..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingId(null)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Block
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Block" : "Add New Block"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Block Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Block A"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val: "Boys" | "Girls" | "Staff") => handleInputChange("type", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Boys">Boys Hostel</SelectItem>
                                                <SelectItem value="Girls">Girls Hostel</SelectItem>
                                                <SelectItem value="Staff">Staff Quarters</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="floors">Number of Floors</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        min={1}
                                        value={formData.floors}
                                        onChange={(e) => handleInputChange("floors", parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="warden">Warden Name</Label>
                                    <Input
                                        id="warden"
                                        placeholder="e.g. Mr. Ramesh Kumar"
                                        value={formData.warden}
                                        onChange={(e) => handleInputChange("warden", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact">Contact Number</Label>
                                    <Input
                                        id="contact"
                                        placeholder="e.g. +91 98765 43210"
                                        value={formData.contact}
                                        onChange={(e) => handleInputChange("contact", e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Add Block"}</Button>
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
                            <TableHead>Block Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Floors</TableHead>
                            <TableHead>Warden</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBlocks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No blocks found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBlocks.map((block) => (
                                <TableRow key={block.id}>
                                    <TableCell className="font-medium">{block.name}</TableCell>
                                    <TableCell>{block.type}</TableCell>
                                    <TableCell>{block.floors}</TableCell>
                                    <TableCell>{block.warden}</TableCell>
                                    <TableCell>{block.contact}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => openEditDialog(block)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(block.id)}
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

export default AdminBlocks;
