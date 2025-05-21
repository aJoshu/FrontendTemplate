import { getCardBySlug } from '@/api/card/getCardBySlug';
import DefaultCard from '../templates/card/default';
import { lightenHexColor } from '@/components/lightenHexColor';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { slug: string };
};

export default async function CardPage({ params }: PageProps) {
  const { slug } = params;

  const reservedSlugs = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'og.png'];
  if (reservedSlugs.includes(slug)) return notFound();

  const card = await getCardBySlug(slug);
  if (!card) return notFound();

  return (
    <div className="overflow-hidden">
      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          background: `linear-gradient(145deg, ${lightenHexColor(card.bgColor, 10)}, ${lightenHexColor(card.bgColor, 30)})`,
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

export const dynamic = 'force-dynamic';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const reservedSlugs = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'og.png'];
  if (reservedSlugs.includes(slug)) {
    return {
      title: 'Reserved File',
      description: 'This is a reserved path.',
    };
  }

  const card = await getCardBySlug(slug);
  if (!card) {
    return {
      title: 'Card not found',
    };
  }

  return {
    title: card.title || 'Projct Card',
    description: card.description || 'Check out this project showcase',
    openGraph: {
      title: card.title,
      description: card.description,
      url: `https://projct.dev/${card.slug}`,
      siteName: 'Projct',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.description,
    },
  };
}
