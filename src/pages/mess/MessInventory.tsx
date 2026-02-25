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
import { Search, Plus, Edit, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { messService, MessInventory as IMessInventory } from "@/services/messService";

const MessInventory = () => {
    const [inventory, setInventory] = useState<IMessInventory[]>([]);
    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] = useState<IMessInventory | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        item_name: "",
        quantity: 0,
        unit: "kg",
        threshold: 0,
    });

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const data = await messService.fetchInventory();
            setInventory(data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInventory = inventory.filter((item) =>
        item.item_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = (item: IMessInventory) => {
        setEditingItem(item);
        setFormData({
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            threshold: item.threshold || 0,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.item_name) {
            toast.error("Item Name is required");
            return;
        }

        try {
            if (editingItem) {
                await messService.updateInventoryItem(editingItem.id, formData);
                toast.success("Item updated successfully");
            } else {
                await messService.addInventoryItem(formData);
                toast.success("Item added successfully");
            }
            loadInventory();
            setIsDialogOpen(false);
            setEditingItem(null);
            setFormData({ item_name: "", quantity: 0, unit: "kg", threshold: 0 });
        } catch (error) {
            console.error("Failed to save item:", error);
            toast.error("Failed to save item");
        }
    };

    const openAddDialog = () => {
        setEditingItem(null);
        setFormData({ item_name: "", quantity: 0, unit: "kg", threshold: 0 });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Food Inventory"
                description="Manage kitchen stock levels"
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="item_name">Item Name</Label>
                            <Input
                                id="item_name"
                                value={formData.item_name}
                                onChange={(e) => handleInputChange("item_name", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <select
                                    id="unit"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.unit}
                                    onChange={(e) => handleInputChange("unit", e.target.value)}
                                >
                                    <option value="kg">kg</option>
                                    <option value="litres">litres</option>
                                    <option value="packets">packets</option>
                                    <option value="units">units</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="threshold">Low Stock Threshold</Label>
                            <Input
                                id="threshold"
                                type="number"
                                value={formData.threshold}
                                onChange={(e) => handleInputChange("threshold", parseFloat(e.target.value))}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Threshold</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : filteredInventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInventory.map((item) => {
                                const isLowStock = item.quantity <= (item.threshold || 0);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.item_name}</TableCell>
                                        <TableCell>{item.quantity} {item.unit}</TableCell>
                                        <TableCell>{item.threshold} {item.unit}</TableCell>
                                        <TableCell>
                                            {isLowStock ? (
                                                <span className="inline-flex items-center gap-1 text-red-600 font-medium text-xs">
                                                    <AlertTriangle className="h-3 w-3" /> Low Stock
                                                </span>
                                            ) : (
                                                <span className="text-green-600 text-xs font-medium">In Stock</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.last_updated ? new Date(item.last_updated).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MessInventory;
