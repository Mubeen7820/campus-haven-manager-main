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
import { blockService, Block } from "@/services/blockService";
import { supabase } from "@/lib/supabase";

const AdminBlocks = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState<Omit<Block, "id">>({
        name: "",
        type: "Boys",
        floors: 1,
        warden: "",
        contact: "",
    });

    useEffect(() => {
        loadBlocks();

        const subscription = supabase
            .channel('blocks_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, () => {
                loadBlocks();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadBlocks = async () => {
        try {
            const data = await blockService.fetchBlocks();
            setBlocks(data);
        } catch (error) {
            console.error("Failed to load blocks:", error);
            // Table might not exist yet, we'll handle gracefully
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBlocks = blocks.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.warden.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.warden) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingId) {
                await blockService.updateBlock(editingId, formData);
                toast.success("Block updated successfully");
            } else {
                await blockService.createBlock(formData);
                toast.success("Block added successfully");
            }
            closeDialog();
        } catch (error) {
            console.error("Error saving block:", error);
            toast.error("Failed to save block. Make sure the 'blocks' table exists in Supabase.");
        }
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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this block?")) return;
        try {
            await blockService.deleteBlock(id);
            toast.success("Block removed successfully");
        } catch (error) {
            console.error("Error deleting block:", error);
            toast.error("Failed to delete block");
        }
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
                            <DialogDescription className="sr-only">
                                Fill in the details for the hostel block.
                            </DialogDescription>
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

            {/* Data Table Container */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-bold text-[#0f172a]">Hostel Blocks</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">Physical infrastructure management</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="text-left py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Block Name</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Floors</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Warden</th>
                                <th className="text-left py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                                <th className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-slate-400">Loading block data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">No blocks defined yet.</td>
                                </tr>
                            ) : (
                                filteredBlocks.map((block) => (
                                    <tr key={block.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8 font-bold text-[#0f172a]">{block.name}</td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                                                block.type === 'Boys' ? 'bg-blue-50 text-blue-600' :
                                                block.type === 'Girls' ? 'bg-pink-50 text-pink-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {block.type}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 font-medium text-slate-500">{block.floors} Floors</td>
                                        <td className="py-5 px-6 font-bold text-slate-700">{block.warden}</td>
                                        <td className="py-5 px-6 text-slate-500 font-medium">{block.contact}</td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditDialog(block)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(block.id)}
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

export default AdminBlocks;
