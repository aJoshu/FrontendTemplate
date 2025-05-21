import { customNotification } from "@/components/notifications/customNotifications";
import { BASE_URL } from "@/constants/Network";
import axios from "axios";

export const loginAPI = async (email: string, password: string) => {
    const data = { email, password };

    try {
        const response = await axios.post(`${BASE_URL}/login`, data);
        // Expect an authToken in the response data
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        customNotification('Error logging in', 'Incorrect information');
        throw error;
    }
};