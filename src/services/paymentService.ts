import { supabase } from "@/lib/supabase";

export interface Payment {
    id: number;
    student_id: number;
    amount: number;
    type: 'Hostel Fee' | 'Mess Fee' | 'Fine' | 'Other';
    status: 'Paid' | 'Pending' | 'Failed';
    payment_date?: string;
    transaction_id?: string;
    created_at: string;
    students?: {
        name: string;
        admission_no: string;
        rooms?: {
            room_number: string;
        };
    };
}

export const paymentService = {
    async fetchPayments() {
        const { data, error } = await supabase
            .from("payments")
            .select("*, students(name, admission_no, rooms(room_number))")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Payment[];
    },

    async createPayment(payment: Omit<Payment, "id" | "status" | "created_at" | "students">) {
        const { data, error } = await supabase
            .from("payments")
            .insert([payment])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updatePaymentStatus(id: number, status: 'Paid' | 'Failed', transaction_id?: string) {
        const updates: { status: 'Paid' | 'Failed'; payment_date?: string; transaction_id?: string } = { status };
        if (status === 'Paid') {
            updates.payment_date = new Date().toISOString();
            if (transaction_id) updates.transaction_id = transaction_id;
        }

        const { data, error } = await supabase
            .from("payments")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
