import axios from "axios";
import { BASE_URL } from "@/constants/Network";
import { customNotification } from "@/components/notifications/customNotifications";

export const fetchUserCards = async () => {
  const idToken = localStorage.getItem("firebaseIdToken");
  if (!idToken) throw new Error("Missing auth token");

  try{
    const response = await axios.get(`${BASE_URL}/getCardsByUser`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data.cards;
  }catch(error){
    customNotification('Error', error.response.data)
  }



};
