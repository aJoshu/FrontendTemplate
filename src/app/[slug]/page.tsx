import { getCardBySlug } from '@/api/card/getCardBySlug';
import DefaultCard from '../templates/card/default';
import { lightenHexColor } from '@/components/lightenHexColor';
import { notFound } from 'next/navigation';

export default async function CardPage({ params }: { params: { slug: string } }) {
  const card = await getCardBySlug(params.slug); // new function

  if (!card) return notFound();

  return (
    <div className="overflow-hidden">
      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          background: `linear-gradient(145deg, ${lightenHexColor(card.bgColor, 10)}, ${lightenHexColor(card.bgColor, 30)})`
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

