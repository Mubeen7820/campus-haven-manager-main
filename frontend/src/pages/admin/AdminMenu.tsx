import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { Edit, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { messService, MessMenu } from "@/services/messService";

const AdminMenu = () => {
    const [menu, setMenu] = useState<MessMenu[]>([]);
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial state representing a full week structure to ensure we display all days even if empty in DB
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await messService.fetchMenu();
            setMenu(data);
        } catch (error) {
            console.error("Failed to load menu:", error);
            toast.error("Failed to load mess menu");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get items for a specific day and meal
    const getMenuItems = (day: string, meal: string) => {
        return menu.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
    };

    const [formData, setFormData] = useState({
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: "",
    });

    const handleEdit = (day: string) => {
        setEditingDay(day);
        setFormData({
            breakfast: getMenuItems(day, 'Breakfast') === '-' ? '' : getMenuItems(day, 'Breakfast'),
            lunch: getMenuItems(day, 'Lunch') === '-' ? '' : getMenuItems(day, 'Lunch'),
            snacks: getMenuItems(day, 'Snacks') === '-' ? '' : getMenuItems(day, 'Snacks'),
            dinner: getMenuItems(day, 'Dinner') === '-' ? '' : getMenuItems(day, 'Dinner'),
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDay) return;

        try {
            // Upsert each meal type
            await Promise.all([
                messService.updateMenu(editingDay, 'Breakfast', formData.breakfast),
                messService.updateMenu(editingDay, 'Lunch', formData.lunch),
                messService.updateMenu(editingDay, 'Snacks', formData.snacks),
                messService.updateMenu(editingDay, 'Dinner', formData.dinner),
            ]);

            toast.success(`${editingDay}'s menu updated successfully`);
            await loadMenu(); // Reload to refresh state
            setEditingDay(null);
        } catch (error) {
            console.error("Failed to save menu:", error);
            toast.error("Failed to save menu");
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Group menu by day for display (since DB stores rows per meal)
    // Actually, `getMenuItems` handles lookup. We just iterate `days`.

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Menu"
                description="Manage weekly food menu"
            />

            {isLoading ? (
                <div className="text-center py-10">Loading menu...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map((day) => (
                        <Card key={day} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${day === "Sunday" ? "bg-red-500" : "bg-primary"
                                }`} />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Utensils className="h-6 w-6 text-muted-foreground" />
                                        {day}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEdit(day)}
                                    >
                                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-base">
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Breakfast:</span>
                                    <span className="text-base">{getMenuItems(day, 'Breakfast')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Lunch:</span>
                                    <span className="text-base">{getMenuItems(day, 'Lunch')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Snacks:</span>
                                    <span className="text-base">{getMenuItems(day, 'Snacks')}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                                    <span className="font-semibold text-muted-foreground text-base">Dinner:</span>
                                    <span className="text-base">{getMenuItems(day, 'Dinner')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!editingDay} onOpenChange={(open) => !open && setEditingDay(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Menu - {editingDay}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="breakfast">Breakfast</Label>
                            <Textarea
                                id="breakfast"
                                value={formData.breakfast}
                                onChange={(e) => handleInputChange("breakfast", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lunch">Lunch</Label>
                            <Textarea
                                id="lunch"
                                value={formData.lunch}
                                onChange={(e) => handleInputChange("lunch", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="snacks">Snacks</Label>
                            <Textarea
                                id="snacks"
                                value={formData.snacks}
                                onChange={(e) => handleInputChange("snacks", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dinner">Dinner</Label>
                            <Textarea
                                id="dinner"
                                value={formData.dinner}
                                onChange={(e) => handleInputChange("dinner", e.target.value)}
                                rows={2}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingDay(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMenu;
