// src/app/[slug]/page.tsx
import { getCardBySlug } from '@/api/card/getCardBySlug';
import DefaultCard from '../templates/card/default';
import { lightenHexColor } from '@/components/lightenHexColor';
import { notFound } from 'next/navigation';

const reservedSlugs = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'og.png'];

export const dynamic = 'force-dynamic';

export default async function CardPage({ params }: any) {
  const { slug } = params;

  if (reservedSlugs.includes(slug)) return notFound();

  const card = await getCardBySlug(slug);
  if (!card) return notFound();

  return (
    <div className="overflow-hidden">
      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          background: `linear-gradient(145deg, ${lightenHexColor(
            card.bgColor,
            10
          )}, ${lightenHexColor(card.bgColor, 30)})`,
        }}
      >
        <DefaultCard
          cardId={card.id}
          title={card.title}
          description={card.description}
          projects={card.projects}
          editor={false}
          effect={card.effect}
          bgColor={card.bgColor}
          buttonColor={card.buttonColor}
          buttonRadius={card.buttonRadius}
          showGit={card.showGit}
          githubUsername={card.githubUsername}
          size="full"
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}

// 🚨 Use `any` or just avoid overtyping `params`
export async function generateMetadata({ params }: any) {
  const { slug } = params;

  if (reservedSlugs.includes(slug)) {
    return { title: 'Projct' };
  }

  const card = await getCardBySlug(slug);
  if (!card) return { title: 'Card not found' };

  return {
    title: card.title,
    description: card.description,
    openGraph: {
      title: card.title,
      description: card.description,
      url: `https://projct.dev/${card.slug}`,
      siteName: 'Projct',
      type: 'website',
      images: [
        {
          url: `https://projct.dev/api/og/${card.slug}`,
          width: 1200,
          height: 630,
          alt: card.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.description,
      images: [`https://projct.dev/api/og/${card.slug}`],
    },
  };
}
