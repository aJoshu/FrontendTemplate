import { getCardBySlug } from '@/api/card/getCardBySlug';
import DefaultCard from '../templates/card/default';
import { lightenHexColor } from '@/components/lightenHexColor';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
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

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const card = await getCardBySlug(params.slug);

  if (!card) return { title: 'Card not found' };

  return {
    title: card.title || 'Projct Card',
    description: card.description || 'Check out this project showcase',
    openGraph: {
      title: card.title,
      description: card.description,
      url: `https://projct.dev/${card.slug}`,
      siteName: 'Projct',
      images: [
        {
          url: `https://projct.dev/api/og/${card.slug}`, // Optional: dynamic OG image
          width: 1200,
          height: 630,
          alt: card.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.description,
      images: [`https://projct.dev/api/og/${card.slug}`], // Optional: Twitter OG image
    },
  };
}
