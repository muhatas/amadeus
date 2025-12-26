import Confirmation from "@/components/Confirmation";

type ConfirmationPageProps = {
  params: {
    _id: string;
  };
};

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { _id } = params;
  return <Confirmation id={_id} />;
}
