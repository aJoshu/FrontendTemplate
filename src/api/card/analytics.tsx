import axios from "axios";
import { BASE_URL } from "@/constants/Network";

export const trackCardView = async (cardId: string) => {
  const sessionKey = `viewed_${cardId}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "true");

  try {
    await axios.post(`${BASE_URL}/analytics/view`, { cardId }); // ✅ should be the internal UUID
  } catch (err) {
    console.error("View tracking failed:", err);
  }
};

export const trackProjectClick = async (cardId: string, projectLink: string) => {
  const sessionKey = `clicked_${cardId}_${projectLink}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "true");

  try {
    await axios.post(`${BASE_URL}/analytics/click`, {
      cardId, // ✅ must be the Firestore UUID
      projectLink,
    });
  } catch (err) {
    console.error("Click tracking failed:", err);
  }
};
