"use client";
import { useEffect, useRef, useState } from "react";

const GRID = 20;
const WIDTH = 200;
const HEIGHT = 300;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 15 }]);
  const [dir, setDir] = useState("RIGHT");
  const [coin, setCoin] = useState({ x: 5, y: 5 });
  const [bomb, setBomb] = useState({ x: 12, y: 10 });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  // Refs untuk gambar
  const bgImg = useRef<HTMLImageElement | null>(null);
  const snakeImg = useRef<HTMLImageElement | null>(null);
  const coinImg = useRef<HTMLImageElement | null>(null);
  const bombImg = useRef<HTMLImageElement | null>(null);

  // Load gambar hanya di client
  useEffect(() => {
    if (typeof window !== "undefined") {
      bgImg.current = new Image();
      bgImg.current.src = "/background.png";

      snakeImg.current = new Image();
      snakeImg.current.src = "/snake.png";

      coinImg.current = new Image();
      coinImg.current.src = "/coin.png";

      bombImg.current = new Image();
      bombImg.current.src = "/bomb.png";
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setDir("UP");
      if (e.key === "ArrowDown") setDir("DOWN");
      if (e.key === "ArrowLeft") setDir("LEFT");
      if (e.key === "ArrowRight") setDir("RIGHT");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (dead) return;
    const loop = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // wrap-around
        head.x = (head.x + WIDTH / GRID) % (WIDTH / GRID);
        head.y = (head.y + HEIGHT / GRID) % (HEIGHT / GRID);

        const newSnake = [head, ...prev];

        // coin
        if (head.x === coin.x && head.y === coin.y) {
          setScore((s) => s + 1);
          setCoin({
            x: Math.floor(Math.random() * (WIDTH / GRID)),
            y: Math.floor(Math.random() * (HEIGHT / GRID)),
          });
        } else {
          newSnake.pop();
        }

        // bomb
        if (head.x === bomb.x && head.y === bomb.y) {
          setDead(true);
        }

        // self-hit
        if (newSnake.slice(1).some((s) => s.x === head.x && s.y === head.y)) {
          setDead(true);
        }

        return newSnake;
      });
    }, 200);
    return () => clearInterval(loop);
  }, [dir, coin, bomb, dead]);

  // Draw canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Background
    if (bgImg.current) {
      ctx.drawImage(bgImg.current, 0, 0, WIDTH, HEIGHT);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // Snake
    if (snakeImg.current) {
      snake.forEach((seg) => {
        ctx.drawImage(snakeImg.current!, seg.x * GRID, seg.y * GRID, GRID, GRID);
      });
    }

    // Coin
    if (coinImg.current) {
      ctx.drawImage(coinImg.current, coin.x * GRID, coin.y * GRID, GRID, GRID);
    }

    // Bomb
    if (bombImg.current) {
      ctx.drawImage(bombImg.current, bomb.x * GRID, bomb.y * GRID, GRID, GRID);
    }
  }, [snake, coin, bomb]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold text-sky-400">Snake Pixel 🐍</h1>
      <p>Score: {score}</p>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      {dead && (
        <div className="mt-4 flex gap-4">
          <button
            className="bg-green-500 px-4 py-2 rounded"
            onClick={() => {
              setSnake([{ x: 10, y: 15 }]);
              setScore(0);
              setDead(false);
            }}
          >
            Play Again
          </button>
          <button className="bg-red-500 px-4 py-2 rounded">Quit</button>
        </div>
      )}
    </div>
  );
}
