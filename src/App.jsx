import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Confetti from "react-confetti";

const allGameIcons = [
  "🎉",
  "🌹",
  "🤳",
  "🎁",
  "🐱",
  "🙌",
  "👀",
  "✨",
  "🤷‍♂️",
  "👑",
  "🎈",
];

const levelClearedMsg = [
  "🌟 Great start",
  "⭐️ Nice progress!",
  "🎉 Well done! Move on..",
  "🏆 Impressive skills!",
  "🌟 Halfway mark!",
  "🌟 Excellent work!",
  "⚡️ Remarkable progress!",
  "🎯 Outstanding performance!",
  "🔥 Incredible perseverance!",
  "🎉 Congratulations, you've conquered!",
];

function App() {
  const [pieces, setPices] = useState([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(null);

  let timeout = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    }
    return false;
  }, [pieces]);

  const startGame = () => {
    const gameIcons = [];
    for (let i = 0; i <= level; i++) {
      gameIcons.push(allGameIcons[i]);
    }
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    setLives(level * (duplicateGameIcons.length + 10));
    const newGameIcons = [];

    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }
    setPices(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleActive = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return;
    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        if (!piece.flipped) setLives(lives - 1);
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPices(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPices(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true;
                setLives(lives + 3);
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();
    return () => {
      clearTimeout(timeout.current);
    };
  }, [pieces]);

  const restartGame = () => {
    setLevel(1);
    startGame();
  };

  return (
    <main>
      <h1 className="animate-charcter"> Memory Game in React </h1>
      <div className="title">
        <h1> Level - {level} </h1>
        <h2> Tries left - {lives} </h2>
      </div>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${
              data.flipped || data.solved ? "active" : ""
            } `}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1> {levelClearedMsg[level - 1]} </h1>
          {level === 10 ? (
            <button onClick={restartGame}> Play Again </button>
          ) : (
            <button
              onClick={() => {
                setLevel(level + 1);
              }}
            >
              Next Level
            </button>
          )}
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      {lives === 0 && !isGameCompleted && (
        <div className="game-completed">
          <h1> Game Over </h1>
          <button onClick={restartGame}> Play Again </button>
        </div>
      )}
    </main>
  );
}

export default App;
