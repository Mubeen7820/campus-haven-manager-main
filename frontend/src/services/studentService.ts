import { supabase } from "@/lib/supabase";
import { type SupabaseClient } from '@supabase/supabase-js';

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
    password?: string;
    rooms?: {
        room_number: string;
        block: string;
    };
    profiles?: {
        avatar_url?: string;
    };
}

// Special client for background user creation to avoid logging out the Admin
let tempAuthClient: SupabaseClient | null = null;

const getTempAuthClient = async (): Promise<SupabaseClient> => {
    if (tempAuthClient) return tempAuthClient;
    
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { createClient } = await import('@supabase/supabase-js');
    
    tempAuthClient = createClient(url, key, {
        auth: { 
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
    return tempAuthClient;
};

export const studentService = {
    async fetchStudents() {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Student[];
    },

    async getStudentById(id: number) {
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Student;
    },

    async getStudentByProfileId(profileId: string) {
        // 1. First try by exact profile_id match
        const { data, error } = await supabase
            .from("students")
            .select("*, rooms(room_number, block), profiles(avatar_url)")
            .eq("profile_id", profileId)
            .maybeSingle();

        if (data) return data as Student;

        // 2. If not found, get the user's email and try matching by email
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            const { data: emailData, error: emailError } = await supabase
                .from("students")
                .select("*, rooms(room_number, block), profiles(avatar_url)")
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
        const { password, ...dataToInsert } = student;

        // 1. If password and email are provided, create the Auth user first
        if (password && student.email) {
            const tempClient = await getTempAuthClient();

            const { data: authData, error: authError } = await tempClient.auth.signUp({
                email: student.email,
                password: password,
                options: {
                    data: {
                        full_name: student.name,
                        role: 'student'
                    }
                }
            });

            if (authError) {
                console.error("Auth creation error:", authError);
                throw new Error("Failed to create student login: " + authError.message);
            }

            if (authData.user) {
                dataToInsert.profile_id = authData.user.id;
            }
        }

        const { data, error } = await supabase
            .from("students")
            .insert([dataToInsert])
            .select()
            .single();

        if (error) throw error;

        // Synchronize room occupancy
        if (data.room_id) {
            const { error: rpcError } = await supabase.rpc('increment_occupancy', { room_id: data.room_id });
            if (rpcError) {
                // Fallback if RPC isn't available or fails
                const { data: room } = await supabase.from('rooms').select('current_occupancy').eq('id', data.room_id).single();
                if (room) {
                    await supabase.from('rooms').update({ current_occupancy: (room.current_occupancy || 0) + 1 }).eq('id', data.room_id);
                }
            }
        }

        return data;
    },

    async updateStudent(id: number, updates: Partial<Student>) {
        // Get old student data to check for room change
        const { data: oldStudent } = await supabase.from('students').select('room_id').eq('id', id).single();

        const { data, error } = await supabase
            .from("students")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        // Handle room occupancy change if needed
        if (oldStudent && updates.room_id !== undefined && updates.room_id !== oldStudent.room_id) {
            // Decrement old
            if (oldStudent.room_id) {
                const { data: oldRoom } = await supabase.from('rooms').select('current_occupancy').eq('id', oldStudent.room_id).single();
                if (oldRoom) {
                    await supabase.from('rooms').update({ current_occupancy: Math.max(0, (oldRoom.current_occupancy || 0) - 1) }).eq('id', oldStudent.room_id);
                }
            }
            // Increment new
            if (updates.room_id) {
                const { data: newRoom } = await supabase.from('rooms').select('current_occupancy').eq('id', updates.room_id).single();
                if (newRoom) {
                    await supabase.from('rooms').update({ current_occupancy: (newRoom.current_occupancy || 0) + 1 }).eq('id', updates.room_id);
                }
            }
        }

        return data;
    },

    async deleteStudent(id: number) {
        // Get student data first to update room occupancy
        const { data: student } = await supabase.from('students').select('room_id').eq('id', id).single();

        const { error } = await supabase
            .from("students")
            .delete()
            .eq("id", id);

        if (error) throw error;

        // Decrement room occupancy
        if (student?.room_id) {
            const { data: room } = await supabase.from('rooms').select('current_occupancy').eq('id', student.room_id).single();
            if (room) {
                await supabase.from('rooms').update({ current_occupancy: Math.max(0, (room.current_occupancy || 0) - 1) }).eq('id', student.room_id);
            }
        }
    }
};
