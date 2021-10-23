import { useState, useEffect } from "react";
import ScoreBoard from "./component/ScoreBoard";

const width = 8;
const candyColours = ["blue", "green", "orange", "purple", "red", "yellow"];

const App = () => {
  const [currentColourArrangement, setcurrentColourArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(null);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColour = currentColourArrangement[i];
      const isBlank = currentColourArrangement[i] === "";

      if (
        columnOfThree.every(
          (square) =>
            currentColourArrangement[square] === decidedColour && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach(
          (square) => (currentColourArrangement[square] = "")
        );
        return true;
      }
    }
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColour = currentColourArrangement[i];
      const isBlank = currentColourArrangement[i] === "";

      if (
        columnOfFour.every(
          (square) =>
            currentColourArrangement[square] === decidedColour && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach(
          (square) => (currentColourArrangement[square] = "")
        );
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColour = currentColourArrangement[i];
      const isBlank = currentColourArrangement[i] === "";
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];

      if (notValid.includes(i)) {
        continue;
      }

      if (
        rowOfThree.every(
          (square) =>
            currentColourArrangement[square] === decidedColour && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach((square) => (currentColourArrangement[square] = ""));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColour = currentColourArrangement[i];
      const isBlank = currentColourArrangement[i] === "";
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];

      if (notValid.includes(i)) {
        continue;
      }

      if (
        rowOfFour.every(
          (square) =>
            currentColourArrangement[square] === decidedColour && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((square) => (currentColourArrangement[square] = ""));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColourArrangement[i] === "") {
        let randomNumber = Math.floor(Math.random() * candyColours.length);
        currentColourArrangement[i] = candyColours[randomNumber];
      }

      if (currentColourArrangement[i + width] === "") {
        currentColourArrangement[i + width] = currentColourArrangement[i];
        currentColourArrangement[i] = "";
      }
    }
  };

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    currentColourArrangement[squareBeingReplacedId] =
      squareBeingDragged.style.backgroundColor;
    currentColourArrangement[squareBeingDraggedId] =
      squareBeingReplaced.style.backgroundColor;

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfFour || isARowOfThree || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColourArrangement[squareBeingReplacedId] =
        squareBeingReplaced.style.backgroundColor;
      currentColourArrangement[squareBeingDraggedId] =
        squareBeingDragged.style.backgroundColor;
      setcurrentColourArrangement([...currentColourArrangement]);
    }
  };

  const createBoard = () => {
    const randomColourArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomNumber0To5 = Math.floor(Math.random() * candyColours.length);
      const randomColour = candyColours[randomNumber0To5];
      randomColourArrangement.push(randomColour);
    }
    setcurrentColourArrangement(randomColourArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setcurrentColourArrangement([...currentColourArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForColumnOfThree,
    checkForColumnOfFour,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColourArrangement,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentColourArrangement.map((candyColour, index) => (
          <img
            key={index}
            style={{ backgroundColor: candyColour }}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
