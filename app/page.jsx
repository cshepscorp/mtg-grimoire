import CardExplorer from "@/components/CardExplorer";

export default function Home({ searchParams }) {
  return (
    <CardExplorer
      initialCardId={searchParams?.openCard}
      initialArtist={searchParams?.openArtist}
    />
  );
}
