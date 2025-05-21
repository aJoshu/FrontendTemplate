import { BASE_URL } from "@/constants/Network";
import axios from "axios";

export const signupAPI = async (email: string, password: string, code: string) => {
    const data = { email, password, code };

    try {
        const response = await axios.post(`${BASE_URL}/signup`, data);
        // Expect an authToken (or similar) in the response data upon successful account creation
        return response.data;
    } catch (error: any) {
        console.error("Signup error:", error.response?.data || error.message);
        throw error;
    }
};