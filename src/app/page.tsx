import Header from "@/components/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="h-screen bg-gray-100 flex items-center justify-center pt-20">
        <p className="text-2xl text-gray-600">여기에 콘텐츠가 들어갑니다</p>
      </div>
    </main>
  );
}
