import Confirmation from "@/components/Confirmation";

type ConfirmationPageProps = {
  params: Promise<{
    _id: string;
  }>;
};

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { _id } = await params;
  return <Confirmation id={_id} />;
}
