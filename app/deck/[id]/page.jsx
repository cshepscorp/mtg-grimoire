import DeckEditorPage from "../../../components/deck-editor/DeckEditorPage";

export default async function EditDeckPage({ params }) {
  const { id } = await params;
  return <DeckEditorPage deckId={id} />;
}
