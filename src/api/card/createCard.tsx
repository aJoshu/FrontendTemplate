import axios from "axios";
import { BASE_URL } from "@/constants/Network";
import { customNotification } from "@/components/notifications/customNotifications";

interface Project {
  title: string;
  link: string;
}

interface CreateCardPayload {
  title: string;
  description: string;
  projects: Project[];
  bgColor: string;
  buttonColor: string;
  buttonRadius: "xs" | "sm" | "md" | "lg" | "xl";
  effect?: string;
  showGit?: boolean;
  githubUsername?: string;
}


export const createCardAPI = async (card: CreateCardPayload) => {
  try {
    const idToken = localStorage.getItem("firebaseIdToken");
    if (!idToken) throw new Error("No auth token found");

    const normalizedCard = {
      ...card,
      projects: card.projects.map((project) => ({
        ...project,
        link: normalizeUrl(project.link),
      })),
    };

    const response = await axios.post(`${BASE_URL}/createCard`, normalizedCard, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Card creation error:", error.response?.data || error.message);
    if (error.response?.data?.error) {
      customNotification('Error saving', error.response.data.error);
    }
    throw error;
  }
};

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

