import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface ChatStore {
    users: any[];
    fetchUsers: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    // fetchUsers: async () => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const response = await axiosInstance.get("/users");
    //         set({ users: response.data });
    //     } catch (error:any) {
    //         set({ error: error.response.data.message });
    //     }finally {
    //         set({ isLoading: false });
    //     }
    // },

    fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
        const response = await axiosInstance.get("/users");
        // Backend trả về dạng { users: [...] }, nên cần lấy response.data.users
        set({
            users: Array.isArray(response.data?.users)
                ? response.data.users
                : [],
        });
    } catch (error: any) {
        set({
            error:
                error.response?.data?.message ||
                "Không thể tải danh sách người dùng",
        });
    } finally {
        set({ isLoading: false });
    }
},
}));