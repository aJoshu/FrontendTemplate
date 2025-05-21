import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/constants/Network";
import { customNotification } from "@/components/notifications/customNotifications";

export const fetchUserCards = async () => {
  if (typeof window !== 'undefined') {
    const idToken = localStorage.getItem("firebaseIdToken");
    if (!idToken) throw new Error("Missing auth token");

    try {
      const response = await axios.get(`${BASE_URL}/getCardsByUser`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return response.data.cards;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        customNotification("Error", error.response.data);
      } else {
        customNotification("Error", "Something went wrong.");
      }
    }
  }
};
