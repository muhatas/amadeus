import Confirmation from "@/components/Confirmation";

export default async function ConfirmationPage({ params }) {
  const { _id } = await params;
  return <Confirmation id={_id} />;
}
