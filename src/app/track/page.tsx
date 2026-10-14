import Header from "@/components/Header";
import TrackResult from "@/components/TrackResult";

export default function TrackPage({ searchParams }: { searchParams: { code?: string } }) {
  return (
    <>
      <Header />
      <TrackResult code={searchParams.code ?? ""} />
    </>
  );
}