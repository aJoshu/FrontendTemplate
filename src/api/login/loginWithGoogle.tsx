import { BASE_URL } from "@/constants/Network";
import axios from 'axios';

export const loginWithGoogle = async (idToken: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/googleLogin`, {
            headers: {
                Authorization: `Bearer ${idToken}` // Send the token in the Authorization header
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
