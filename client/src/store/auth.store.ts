import { create } from "zustand";
import {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser,
} from "@/services/auth.service";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;

    fetchCurrentUser: () => Promise<void>;

    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    isAuthenticated: false,

    login: async (email, password) => {
        const response = await loginUser({
            email,
            password,
        });

        set({
            user: response.user,
            isAuthenticated: true,
        });
    },

    register: async (name, email, password) => {
        const response = await registerUser({
            name,
            email,
            password,
        });

        set({
            user: response.user,
            isAuthenticated: true,
        });
    },

    fetchCurrentUser: async () => {
        try {
            const response = await getCurrentUser();

            set({
                user: response.user,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
            });
        } finally {
            set({
                loading: false,
            });
        }
    },

    logout: async () => {
        await logoutUser();

        set({
            user: null,
            isAuthenticated: false,
        });
    },
}));