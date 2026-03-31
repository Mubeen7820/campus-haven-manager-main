import { supabase } from "@/lib/supabase";

export interface Complaint {
    id: number;
    student_id?: number;
    user_id?: string;
    title: string;
    description: string;
    category: 'Electrical' | 'Plumbing' | 'Furniture' | 'Cleanliness' | 'Mess' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Resolved';
    created_at: string;
    resolved_at?: string;
    resolution_text?: string;
    students?: {
        name: string;
        room_id: number;
        profile_id?: string;
        rooms: {
            room_number: string;
            block: string;
        };
    };
}

export const complaintService = {
    async fetchComplaints() {
        const { data, error } = await supabase
            .from("complaints")
            .select(`
        *,
        students (
          name,
          room_id,
          profile_id,
          rooms (
            room_number,
            block
          )
        )
      `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Complaint[];
    },

    async fetchComplaintsByStudentId(studentId: number) {
        const { data, error } = await supabase
            .from("complaints")
            .select(`
        *,
        students (
          name,
          room_id,
          profile_id,
          rooms (
            room_number,
            block
          )
        )
      `)
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Complaint[];
    },

    async createComplaint(complaint: Omit<Complaint, "id" | "created_at" | "students" | "resolved_at">) {
        const { data, error } = await supabase
            .from("complaints")
            .insert([complaint])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateComplaintStatus(id: number, status: Complaint['status'], resolution_text?: string) {
        // resolution_text is omitted from DB updates because it does not exist in the initial schema
        const updates: { status: Complaint['status']; resolved_at?: string } = { status };
        if (status === 'Resolved') {
            updates.resolved_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("complaints")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
