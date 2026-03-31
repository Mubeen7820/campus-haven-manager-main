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

export interface MessAttendance {
    id: number;
    student_id: number;
    meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
    marked_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const messService = {
    async fetchAttendance() {
        const { data, error } = await supabase
            .from("mess_attendance")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("marked_at", { ascending: false });

        if (error) throw error;
        return data as MessAttendance[];
    },

    async fetchStudentAttendance(studentId: number) {
        const { data, error } = await supabase
            .from("mess_attendance")
            .select("*")
            .eq("student_id", studentId)
            .order("marked_at", { ascending: false });

        if (error) throw error;
        return data as MessAttendance[];
    },

    async markAttendance(admissionNo: string, mealType: string) {
        // 1. Get student ID from admission number
        const { data: student, error: studentError } = await supabase
            .from("students")
            .select("id")
            .eq("admission_no", admissionNo)
            .single();

        if (studentError) throw new Error("Student not found");

        // 1.5 Check if already marked for this meal today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: existingAttendance } = await supabase
            .from("mess_attendance")
            .select("id")
            .eq("student_id", student.id)
            .eq("meal_type", mealType)
            .gte("marked_at", today.toISOString())
            .limit(1);

        if (existingAttendance && existingAttendance.length > 0) {
            throw new Error(`Already marked for ${mealType} today.`);
        }

        // 2. Insert attendance record
        const { data, error } = await supabase
            .from("mess_attendance")
            .insert([{
                student_id: student.id,
                meal_type: mealType as 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner',
                marked_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

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
