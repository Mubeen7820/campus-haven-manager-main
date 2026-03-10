import { supabase } from "@/lib/supabase";

export interface Leaf {
    id: number;
    student_id: number;
    user_id: string;
    type: 'Outing' | 'Leave';
    reason: string;
    start_date: string; // ISO string
    end_date: string; // ISO string
    status: 'Pending' | 'Approved' | 'Rejected';
    created_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const leafService = {
    async fetchLeaves() {
        const { data, error } = await supabase
            .from("leaves")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Leaf[];
    },

    async fetchLeavesByStudentId(studentId: number) {
        const { data, error } = await supabase
            .from("leaves")
            .select("*, students(name, admission_no, rooms(room_number))")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Leaf[];
    },

    async createLeaf(leaf: Omit<Leaf, "id" | "status" | "created_at" | "students">) {
        const { data, error } = await supabase
            .from("leaves")
            .insert([leaf])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateLeafStatus(id: number, status: 'Approved' | 'Rejected') {
        const { data, error } = await supabase
            .from("leaves")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
