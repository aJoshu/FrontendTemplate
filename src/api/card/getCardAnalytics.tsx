// src/api/card/getCardAnalytics.ts
import axios from "axios";
import { BASE_URL } from "@/constants/Network";

export const getCardAnalytics = async () => {
  const idToken = localStorage.getItem("firebaseIdToken");
  if (!idToken) throw new Error("Missing auth token");

  const response = await axios.get(`${BASE_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data; // returns { views, clicks }
};
