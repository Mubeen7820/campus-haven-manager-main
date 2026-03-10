import { supabase } from "@/lib/supabase";

export interface Block {
    id: number;
    name: string;
    type: "Boys" | "Girls" | "Staff";
    floors: number;
    warden: string;
    contact: string;
}

export const blockService = {
    async fetchBlocks() {
        const { data, error } = await supabase
            .from("blocks")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return data as Block[];
    },

    async createBlock(block: Omit<Block, "id">) {
        const { data, error } = await supabase
            .from("blocks")
            .insert([block])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateBlock(id: number, updates: Partial<Block>) {
        const { data, error } = await supabase
            .from("blocks")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBlock(id: number) {
        const { error } = await supabase
            .from("blocks")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
