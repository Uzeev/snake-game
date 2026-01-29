import SnakeGame from "../components/SnakeGame";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <SnakeGame />
    </main>
  );
}
