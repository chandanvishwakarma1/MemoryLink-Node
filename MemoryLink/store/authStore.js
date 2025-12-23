import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    login: async (email, password) => {
        set({ isLoading: true })
        try {
            console.log(`hitting url: ${process.env.EXPO_PUBLIC_BACKEND_API_URL}/auth/login`);
            const response = await fetch(`https://memory-link-server-v1.vercel.app/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');


            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true }
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message }
        }
    },

    register: async (username, email, password) => {
        set({isLoading: true});
        try {
            const response = await fetch(`https://memory-link-server-v1.vercel.app/api/auth/register`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                })
            });

            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", JSON.stringify(data.token));

            set({user: data.user, token:data.token, isLoading:false});
            return ({success: true});
        } catch (error) {
            set({isLoading: false})
            console.log("Error registering user: ", error);
            return ({success: false, error: error.message});
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            set({token, user});
        } catch (error) {
            console.log("Auth check failed: ", error);
        } finally {
            set({isCheckingAuth: false})
        }
    },

    logOut: async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            
            set({token: null, user: null});
        } catch (error) {
            console.log("Error logging out: ", error);
        }
    }
}))
