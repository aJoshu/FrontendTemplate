import axios from "axios";
import { BASE_URL } from "@/constants/Network";

export const fetchUserCards = async () => {
  const idToken = localStorage.getItem("firebaseIdToken");
  if (!idToken) throw new Error("Missing auth token");

  const response = await axios.get(`${BASE_URL}/getCardsByUser`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data.cards;
};
