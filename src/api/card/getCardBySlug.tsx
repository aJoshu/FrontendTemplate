// lib/api/getCardBySlug.ts
import { BASE_URL } from "@/constants/Network";

export const getCardBySlug = async (slug: string) => {
  const res = await fetch(`${BASE_URL}/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const { card } = await res.json();
  return card;
};
