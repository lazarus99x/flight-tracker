import Header from "@/components/Header";
import TrackResult from "@/components/TrackResult";

export default function TrackCodePage({ params }: { params: { code: string } }) {
  return (
    <>
      <Header />
      <TrackResult code={params.code} />
    </>
  );
}