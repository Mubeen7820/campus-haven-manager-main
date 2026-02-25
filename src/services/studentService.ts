import { supabase } from "@/lib/supabase";

export interface Student {
    id: number;
    profile_id?: string;
    admission_no: string;
    name: string;
    course: string;
    year: number;
    room_id?: number;
    parent_name: string;
    parent_phone: string;
    blood_group: string;
    emergency_contact: string;
    status: 'Active' | 'Inactive' | 'Alumni';
    email?: string;
    rooms?: {
        room_number: string;
        block: string;
    };
}

export const studentService = {
    async fetchStudents() {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Student[];
    },

    async getStudentById(id: number) {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Student;
    },

    async getStudentByProfileId(profileId: string) {
        // 1. First try by exact profile_id match
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block)")
            .eq("profile_id", profileId)
            .maybeSingle();

        if (data) return data as Student;

        // 2. If not found, get the user's email and try matching by email
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            const { data: emailData, error: emailError } = await supabase
                .from("students")
                .select("*, rooms(room_number, block)")
                .eq("email", user.email)
                .is("profile_id", null)
                .maybeSingle();

            if (emailData) {
                // Automaticaly link the profile_id if matched by email
                await this.updateStudent(emailData.id, { profile_id: profileId });
                return emailData as Student;
            }
        }

        if (error && error.code !== 'PGRST116') throw error;
        return null;
    },

    async getProfileByEmail(email: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data.id;
    },

    async createStudent(student: Omit<Student, "id" | "rooms">) {
        const { data, error } = await supabase
            .from("students")
            .insert([student])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateStudent(id: number, updates: Partial<Student>) {
        const { data, error } = await supabase
            .from("students")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteStudent(id: number) {
        const { error } = await supabase
            .from("students")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
