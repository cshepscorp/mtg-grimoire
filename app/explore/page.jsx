import CardExplorer from "@/components/CardExplorer";

export default async function ExplorePage({ searchParams }) {
  const params = await searchParams;
  return (
    <CardExplorer
      initialCardId={params?.openCard}
      initialArtist={params?.openArtist}
    />
  );
}
