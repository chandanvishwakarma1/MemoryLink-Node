import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,
    authCheckFailed: false,
    hasOnBoarded: false,

    login: async (email, password) => {
        set({ isLoading: true })
        try {
            console.log(`hitting url: ${process.env.EXPO_PUBLIC_BACKEND_API_URL}/auth/login`);
            const response = await fetch(`https://memory-link-server-w2fp.vercel.app/api/auth/login`, {
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

    register: async (username, email, password, fullName, birthdate, gender, hasAcceptedTermsAndPrivacy, isVerified, hasOnBoarded) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`https://memory-link-server-w2fp.vercel.app/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    fullName,
                    birthdate,
                    gender,
                    password,
                    hasAcceptedTermsAndPrivacy,
                    isVerified,
                    hasOnBoarded,
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });
            return ({ success: true });
        } catch (error) {
            set({ isLoading: false })
            console.log("Error registering user: ", error);
            return ({ success: false, error: error.message });
        }
    },

    checkAuth: async () => {
        let token = null;
        let user = null;
        let failed = false;
        try {
            token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            user = userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.log("Auth check failed: ", error);
            failed = true;
        } finally {
            set({ token, user, authCheckFailed: failed, isCheckingAuth: false });
        }
    },

    logOut: async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");

            set({ token: null, user: null });
        } catch (error) {
            console.log("Error logging out: ", error);
        }
    },
    updateUser: async ({ data }) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            set({ user: data.user });
        } catch (error) {
            console.log("Error updating user: ", error);
        }
    },
    requestOtp: async ({email}) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/auth/request-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    purpose: "verfiy_email"
                })
            });
            let data;
            try {
                data = await response.json();
            } catch (error) {
                data = { message: `Server error: ${response.status} ${response.statusText}` };
            }
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setLoading(false);
            if (data.success) {
                router.push({
                pathname: '/(auth)/(register)/register',
                params: { ...params, hasAcceptedTermsAndPrivacy: String(hasAcceptedTermsAndPrivacy) }
            })
            }
        } catch (error) {
            console.log("Error:", error);
            Alert.alert("Error", error.message);
        }
    }
}))
