import { supabase } from "@/lib/supabase";

export interface Room {
    id: number;
    room_number: string;
    block: string;
    capacity: number;
    current_occupancy: number;
    type: 'AC' | 'Non-AC';
    status: 'Available' | 'Occupied' | 'Maintenance';
    floor: number;
}

export const roomService = {
    async fetchRooms() {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .order("room_number", { ascending: true });

        if (error) throw error;
        return data as Room[];
    },

    async getRoomById(id: number) {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Room;
    },

    async createRoom(room: Omit<Room, "id" | "current_occupancy">) {
        const { data, error } = await supabase
            .from("rooms")
            .insert([room])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateRoom(id: number, updates: Partial<Room>) {
        const { data, error } = await supabase
            .from("rooms")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getRoomByNumberAndBlock(roomNumber: string, block: string) {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("room_number", roomNumber)
            .eq("block", block)
            .maybeSingle();

        if (error) throw error;
        return data as Room | null;
    }
};
