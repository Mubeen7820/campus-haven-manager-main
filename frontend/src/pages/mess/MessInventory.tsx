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
import { Search, Plus, Edit, AlertTriangle, Trash2, Loader2, Package } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { messService, MessInventory as IMessInventory } from "@/services/messService";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const MessInventory = () => {
    const [inventory, setInventory] = useState<IMessInventory[]>([]);
    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] = useState<IMessInventory | null>(null);
    const [itemToDelete, setItemToDelete] = useState<IMessInventory | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        item_name: "",
        quantity: 0,
        unit: "kg",
        threshold: 0,
    });

    useEffect(() => {
        loadInventory();

        const channel = supabase
            .channel('mess_inventory_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_inventory' }, () => {
                loadInventory();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadInventory = async () => {
        try {
            setIsLoading(true);
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

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            setIsSubmitting(true);
            await messService.deleteInventoryItem(itemToDelete.id);
            toast.success(`${itemToDelete.item_name} deleted`);
            loadInventory();
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete item:", error);
            toast.error("Failed to delete item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.item_name) {
            toast.error("Item Name is required");
            return;
        }

        try {
            setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
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
                description="Manage kitchen stock levels and thresholds"
            />

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm"
            >
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search pantry items..."
                        className="pl-10 bg-muted/20 border-border focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={openAddDialog} className="w-full sm:w-auto shadow-elevated transition-transform hover:scale-105 active:scale-95">
                    <Plus className="h-4 w-4 mr-2" /> Add New Item
                </Button>
            </motion.div>

            {/* Dialog for Add/Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="item_name">Item Name</Label>
                            <Input
                                id="item_name"
                                placeholder="e.g. Basmati Rice"
                                value={formData.item_name}
                                onChange={(e) => handleInputChange("item_name", e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Stock Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.1"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value))}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <select
                                    id="unit"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.unit}
                                    onChange={(e) => handleInputChange("unit", e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="kg">kg</option>
                                    <option value="litres">litres</option>
                                    <option value="packets">packets</option>
                                    <option value="units">units</option>
                                    <option value="bags">bags</option>
                                    <option value="tins">tins</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="threshold" className="flex items-center gap-2 text-warning">
                                <AlertTriangle className="w-3 h-3" />
                                Alert Threshold
                            </Label>
                            <Input
                                id="threshold"
                                type="number"
                                step="0.1"
                                placeholder="Notify if below..."
                                value={formData.threshold}
                                onChange={(e) => handleInputChange("threshold", parseFloat(e.target.value))}
                                disabled={isSubmitting}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingItem ? "Update Item" : "Save Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for Delete */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {itemToDelete?.item_name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the item from your inventory logs.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Item Name</TableHead>
                            <TableHead className="font-bold">Total Stock</TableHead>
                            <TableHead className="font-bold">Min Threshold</TableHead>
                            <TableHead className="font-bold">Health Status</TableHead>
                            <TableHead className="font-bold">Last Restocked</TableHead>
                            <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground animate-pulse">Scanning inventory...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredInventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">
                                    {search ? `No items matching "${search}"` : "Pantry is empty. Start adding items!"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            <AnimatePresence>
                                {filteredInventory.map((item, index) => {
                                    const isLowStock = item.quantity <= (item.threshold || 0);
                                    const isCritical = item.quantity <= ((item.threshold || 0) * 0.5);

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-muted/30 transition-colors"
                                        >
                                            <TableCell className="font-bold text-base">{item.item_name}</TableCell>
                                            <TableCell className="text-base">
                                                <span className={isCritical ? 'text-destructive font-black' : isLowStock ? 'text-warning font-bold' : ''}>
                                                    {item.quantity}
                                                </span>
                                                <span className="text-[10px] ml-1 text-muted-foreground uppercase">{item.unit}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.threshold} <span className="text-[10px] uppercase">{item.unit}</span>
                                            </TableCell>
                                            <TableCell>
                                                {isCritical ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-bold text-[10px] border border-destructive/20 animate-pulse">
                                                        <AlertTriangle className="h-3 w-3" /> CRITICAL
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning font-bold text-[10px] border border-warning/20">
                                                        <AlertTriangle className="h-3 w-3" /> LOW STOCK
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success font-bold text-[10px] border border-success/20">
                                                        HEALTHY
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {item.last_updated ? new Date(item.last_updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => setItemToDelete(item)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MessInventory;
