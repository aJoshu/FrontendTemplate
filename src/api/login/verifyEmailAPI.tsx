import axios from "axios";

import { BASE_URL } from "@/constants/Network";

export const verifyEmailAPI = async (email: string) => {
    const data = { email };

    try {
        const response = await axios.post(`${BASE_URL}/verifyEmail`, data);
        // Backend generates and sends a confirmation, but does NOT return the actual code
        return response.data;
    } catch (error: any) {
        console.error("Verify email error:", error.response?.data || error.message);
        throw error;
    }
};