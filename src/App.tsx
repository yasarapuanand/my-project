import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Trophy, RotateCcw } from 'lucide-react';

// --- MUSIC PLAYER COMPONENT ---
const TRACKS = [
  {
    id: 1,
    title: "AI Track 1: Neon Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "AI Track 2: Cyberpunk City",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "AI Track 3: Retro Glitch",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <aside id="music-player-aside" className="bg-surface border border-border-color rounded-xl p-5 flex flex-col h-full min-w-[260px]">
      <div id="playlist-header" className="text-[11px] uppercase tracking-[2px] text-text-dim mb-5 border-l-[3px] border-neon-pink pl-2.5 font-bold">
        Playlist
      </div>
      
      <div id="track-list" className="flex flex-col gap-3">
        {TRACKS.map((track, i) => (
          <div 
            id={`track-item-${track.id}`}
            key={track.id}
            onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${currentTrack === i ? 'border-neon-blue bg-[rgba(0,243,255,0.05)]' : 'border-transparent bg-[rgba(255,255,255,0.03)] hover:border-border-color'}`}
          >
            <div id={`track-title-${track.id}`} className="text-[14px] font-semibold mb-1">{track.title}</div>
            <div id={`track-meta-${track.id}`} className="text-[11px] text-text-dim font-mono">AI GEN // {track.duration} // 128 BPM</div>
          </div>
        ))}
      </div>

      <div id="now-playing-section" className="mt-auto pt-6">
        <div id="now-playing-label" className="text-[11px] text-text-dim font-mono mb-[5px] uppercase">Now Playing</div>
        <div id="now-playing-title" className="text-[14px] font-semibold">{TRACKS[currentTrack].title}</div>
        
        <div id="progress-bar-container" className="h-1 bg-border-color w-full rounded-sm overflow-hidden mt-[15px]">
          <div id="progress-bar-fill" className="h-full bg-neon-blue shadow-[0_0_10px_var(--color-neon-blue)] w-[45%]" />
        </div>
        
        <div id="playback-controls" className="flex justify-center gap-[20px] mt-6">
          <button id="btn-prev-track" onClick={prevTrack} className="w-[50px] h-[50px] rounded-full border border-border-color flex items-center justify-center text-text-main bg-transparent hover:bg-border-color transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button id="btn-toggle-play" onClick={togglePlay} className="w-[60px] h-[60px] rounded-full bg-neon-blue text-bg border-none flex items-center justify-center hover:opacity-90 transition-opacity">
            {isPlaying ? <Pause className="w-6 h-6 fill-black text-black" /> : <Play className="w-6 h-6 ml-1 fill-black text-black" />}
          </button>
          <button id="btn-next-track" onClick={nextTrack} className="w-[50px] h-[50px] rounded-full border border-border-color flex items-center justify-center text-text-main bg-transparent hover:bg-border-color transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        id="hidden-audio-element"
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={handleEnded}
      />
    </aside>
  );
}

// --- SNAKE GAME COMPONENT ---
const GRID_SIZE = 20;

type Point = { x: number; y: number };

function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 }); // UP
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use a ref for the direction to avoid closure stale state in the interval
  const dirRef = useRef(direction);
  dirRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food is not on snake
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dirRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (dirRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (dirRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (dirRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause
          if (!gameOver) setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y
        };

        // Collision Check: Walls
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Collision Check: Self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - Math.floor(score / 50) * 8); // Speed up as score increases somewhat gently
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, food, generateFood, score]);

  return (
    <>
      <main id="snake-game-board" className="bg-black border-2 border-neon-green shadow-[inset_0_0_30px_rgba(57,255,20,0.1),_0_0_20px_rgba(57,255,20,0.1)] rounded relative grid aspect-square shrink-0 font-mono overflow-hidden w-full h-[340px] sm:h-[420px] lg:h-[600px] xl:h-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
        {/* Render Food */}
        <div 
          id="game-food"
          className="bg-neon-pink shadow-[0_0_12px_var(--color-neon-pink)] rounded-full m-1"
          style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
        />

        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div 
            id={`snake-segment-${i}`}
            key={`${segment.x}-${segment.y}-${i}`}
            className="bg-neon-green shadow-[0_0_8px_var(--color-neon-green)] rounded-sm m-[1px]"
            style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
          />
        ))}

        {/* Overlays */}
        {gameOver && (
          <div id="game-over-overlay" className="col-span-full row-span-full bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 aspect-square">
            <h2 id="game-over-title" className="text-3xl font-bold font-mono text-neon-pink mb-2">SYSTEM FAILURE</h2>
            <p id="final-score-text" className="text-xl text-text-dim font-mono mb-6">Final Score: {score}</p>
            <button 
              id="btn-reboot"
              onClick={resetGame}
              className="px-6 py-3 bg-[rgba(255,0,255,0.1)] border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all font-mono font-bold flex items-center gap-2 rounded-md"
            >
              <RotateCcw className="w-5 h-5" /> REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div id="game-paused-overlay" className="col-span-full row-span-full bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 aspect-square">
            <h2 id="game-paused-title" className="text-3xl font-bold font-mono text-neon-blue mb-2">PAUSED</h2>
            <p id="game-paused-text" className="text-sm text-text-dim font-mono mb-6">Press [SPACE] to resume</p>
            <button 
              id="btn-resume"
              onClick={() => setIsPaused(false)}
              className="px-6 py-3 bg-[rgba(0,243,255,0.1)] border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all font-mono font-bold rounded-md"
            >
              RESUME
            </button>
          </div>
        )}
      </main>

      <aside id="performance-aside" className="bg-surface border border-border-color rounded-xl p-5 flex flex-col min-w-[260px]">
        <div id="performance-title" className="text-[11px] uppercase tracking-[2px] text-text-dim mb-5 border-l-[3px] border-neon-pink pl-2.5 font-bold">
          Performance
        </div>
        
        <div id="score-container" className="flex flex-col gap-5">
            <div id="current-score-box" className="text-center p-5 border border-dashed border-text-dim rounded-lg">
                <div id="current-score-value" className="font-mono text-5xl text-neon-pink leading-none">{score.toString().padStart(4, '0')}</div>
                <div id="current-score-label" className="text-[10px] uppercase tracking-[2px] text-text-dim mt-2">Current Score</div>
            </div>
            
            <div id="high-score-box" className="text-center p-5 border border-solid border-[rgba(255,255,255,0.05)] rounded-lg">
                <div id="high-score-value" className="font-mono text-2xl text-text-dim leading-none">12,500</div>
                <div id="high-score-label" className="text-[10px] uppercase tracking-[2px] text-text-dim mt-2">High Score</div>
            </div>
        </div>

        <div id="controls-instructions" className="mt-5 text-[10px] text-text-dim leading-[1.4] uppercase">
            CONTROLS:<br/>
            [WASD] MOVE SNAKE<br/>
            [SPACE] PAUSE GAME
        </div>

        {/* Mobile Controls */}
        <div id="mobile-controls-grid" className="grid grid-cols-3 gap-2 mt-auto w-full lg:hidden pt-8">
          <div />
          <button id="btn-mobile-up" onClick={() => { if(dirRef.current.y !== 1) setDirection({x:0, y:-1}) }} className="w-[50px] h-[50px] mx-auto rounded-full border border-border-color flex items-center justify-center text-text-main hover:bg-border-color">↑</button>
          <div />
          <button id="btn-mobile-left" onClick={() => { if(dirRef.current.x !== 1) setDirection({x:-1, y:0}) }} className="w-[50px] h-[50px] mx-auto rounded-full border border-border-color flex items-center justify-center text-text-main hover:bg-border-color">←</button>
          <button id="btn-mobile-down" onClick={() => { if(dirRef.current.y !== -1) setDirection({x:0, y:1}) }} className="w-[50px] h-[50px] mx-auto rounded-full border border-border-color flex items-center justify-center text-text-main hover:bg-border-color">↓</button>
          <button id="btn-mobile-right" onClick={() => { if(dirRef.current.x !== -1) setDirection({x:1, y:0}) }} className="w-[50px] h-[50px] mx-auto rounded-full border border-border-color flex items-center justify-center text-text-main hover:bg-border-color">→</button>
        </div>
      </aside>
    </>
  );
}

// --- MAIN APP ---
export default function App() {
  return (
    <div id="app-container" className="w-full max-w-[980px] mx-auto p-4 flex flex-col lg:grid lg:grid-cols-[260px_1fr_260px] lg:grid-rows-[auto_1fr] gap-5 min-h-[100dvh] pb-10">
      
      <header id="app-header" className="col-span-1 lg:col-span-3 flex flex-col md:flex-row justify-between items-baseline py-2.5 border-b border-border-color mb-2">
          <div id="app-logo" className="text-2xl font-black tracking-[2px] uppercase text-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">
              SynthSnake v1.0
          </div>
          <div id="app-status" className="font-mono text-[12px] text-neon-green mt-2 md:mt-0 shadow-neon-green/40">
              SYSTEM READY // AUDIO LINKED
          </div>
      </header>

      <MusicPlayer />
      <SnakeGame />
      
    </div>
  );
}
