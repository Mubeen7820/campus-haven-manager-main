import { supabase } from "@/lib/supabase";

export interface MessMenu {
    id: number;
    day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
    items: string;
}

export interface MessInventory {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    threshold?: number;
    last_updated?: string;
}

export const messService = {
    async fetchMenu() {
        const { data, error } = await supabase
            .from("mess_menu")
            .select("*")
            .order("id"); // Ordering by ID assumes insertion order roughly matches week/meal or handled in UI

        if (error) throw error;
        return data as MessMenu[];
    },

    async updateMenu(day: string, meal: string, items: string) {
        const { data, error } = await supabase
            .from("mess_menu")
            .upsert({ day_of_week: day, meal_type: meal, items }, { onConflict: 'day_of_week, meal_type' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async fetchInventory() {
        const { data, error } = await supabase
            .from("mess_inventory")
            .select("*")
            .order("item_name");

        if (error) throw error;
        return data as MessInventory[];
    },

    async addInventoryItem(item: Omit<MessInventory, "id" | "last_updated">) {
        const { data, error } = await supabase
            .from("mess_inventory")
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateInventoryItem(id: number, updates: Partial<MessInventory>) {
        const { data, error } = await supabase
            .from("mess_inventory")
            .update({ ...updates, last_updated: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteInventoryItem(id: number) {
        const { error } = await supabase
            .from("mess_inventory")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
