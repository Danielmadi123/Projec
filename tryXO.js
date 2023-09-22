const statusDisplay = document.querySelector(".game--status");

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let scoreX = parseInt(localStorage.getItem("scoreX")) || 0;
let scoreO = parseInt(localStorage.getItem("scoreO")) || 0;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const resetScoreBtn = document.getElementById("resetScoreBtn");
resetScoreBtn.addEventListener("click", () => {
  resetScore();
});
scoreXElement.textContent = scoreX;
scoreOElement.textContent = scoreO;

function handleResultValidation() {
  let roundWon = false;
  let winningPlayer = ""; // Initialize a variable to keep track of the winning player
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningPlayer = a; // Set the winning player
      break;
    }
  }

  if (roundWon) {
    if (winningPlayer === "X") {
      updateScore("X");
    } else if (winningPlayer === "O") {
      updateScore("O");
    }

    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

// Rest of your code remains unchanged...

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", () =>
    handleRestartGame(isVsComputer, computerDifficulty)
  );
document
  .querySelector(".game--computer")
  .addEventListener("click", toggleVsComputer);

document.querySelector(".game--pvp").addEventListener("click", toggleVsPlayer);

let isVsComputer = false;
let computerDifficulty = "easy"; // Default difficulty level

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function toggleVsPlayer() {
  isVsComputer = false; // Set to false for player versus player mode
  closePopup(); // Close the difficulty level popup if open
  handleRestartGame(isVsComputer, computerDifficulty);
}

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();

  if (isVsComputer && currentPlayer === "O") {
    setTimeout(() => computerTurn(), 1000); // Delay for the computer's move
  }
}

function handleRestartGame(vsComputer, difficulty) {
  isVsComputer = vsComputer;
  computerDifficulty = difficulty;

  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  if (isVsComputer && currentPlayer === "O") {
    setTimeout(() => computerTurn(), 1000); // Delay for the computer's first move
  }
}

function toggleVsComputer() {
  openPopup();
}

function openPopup() {
  const popupBackground = document.getElementById("popupBackground");
  popupBackground.style.display = "flex";
}

function closePopup() {
  const popupBackground = document.getElementById("popupBackground");
  popupBackground.style.display = "none";
}

document
  .getElementById("easyBtn")
  .addEventListener("click", () => selectDifficulty("easy"));
document
  .getElementById("mediumBtn")
  .addEventListener("click", () => selectDifficulty("medium"));
document
  .getElementById("hardBtn")
  .addEventListener("click", () => selectDifficulty("hard"));

function selectDifficulty(difficulty) {
  computerDifficulty = difficulty;
  closePopup();
  handleRestartGame(true, computerDifficulty);
}

function getRandomEmptyCell() {
  const emptyCells = gameState.reduce((acc, cell, index) => {
    if (cell === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function computerTurn() {
  if (gameActive && currentPlayer === "O") {
    let cellIndex;

    if (computerDifficulty === "easy") {
      cellIndex = getRandomEmptyCell();
    } else if (computerDifficulty === "medium") {
      cellIndex = getMediumAIMove();
    } else if (computerDifficulty === "hard") {
      cellIndex = getHardAIMove();
    }

    const selectedCell = document.querySelector(
      `[data-cell-index="${cellIndex}"]`
    );
    handleCellPlayed(selectedCell, cellIndex);
    handleResultValidation();
  }
}
function getHardAIMove() {
  // Check for winning moves for the computer
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      if (checkWin("O")) {
        gameState[i] = ""; // Reset the move
        return i;
      }
      gameState[i] = ""; // Reset the move
    }
  }

  // Check for blocking player's winning moves
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "X";
      if (checkWin("X")) {
        gameState[i] = ""; // Reset the move
        return i;
      }
      gameState[i] = ""; // Reset the move
    }
  }

  // Choose an optimal move
  // For now, let's choose the center if available, or a corner, or a side
  const optimalMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (let move of optimalMoves) {
    if (gameState[move] === "") {
      return move;
    }
  }

  // If no optimal move is available, choose a random empty cell
  return getRandomEmptyCell();
}

function getMediumAIMove() {
  // Check for winning moves for the computer
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      if (checkWin("O")) {
        gameState[i] = ""; // Reset the move
        return i;
      }
      gameState[i] = ""; // Reset the move
    }
  }

  // Check for blocking player's winning moves
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "X";
      if (checkWin("X")) {
        gameState[i] = ""; // Reset the move
        return i;
      }
      gameState[i] = ""; // Reset the move
    }
  }

  // If no winning move or blocking move, choose a random empty cell
  return getRandomEmptyCell();
}
function checkWin(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] === player &&
      gameState[b] === player &&
      gameState[c] === player
    ) {
      return true;
      updateScore(player); // Pass the winning player to updateScore
    }
  }
  return false;
}

function handleResultValidation() {
  let roundWon = false;
  let winningPlayer = ""; // Initialize a variable to keep track of the winning player
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningPlayer = a; // Set the winning player
      break;
    }
  }
  if (roundWon) {
    if (winningPlayer === "X") {
      updateScore("X");
      updateScore("O", false); // Don't add points to the other player
    } else if (winningPlayer === "O") {
      updateScore("O");
      updateScore("X", false); // Don't add points to the other player
    }
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    updateScore("X", false); // Add 0 points to both players in case of a draw
    updateScore("O", false);
    gameActive = false;
    return;
  }

  handlePlayerChange();
}
function updateScore(player, addPoint = true) {
  if (addPoint) {
    if (player === "X") {
      scoreX++;
      scoreXElement.textContent = scoreX;
      localStorage.setItem("scoreX", scoreX); // Update X score in local storage
    } else if (player === "O") {
      scoreO++;
      scoreOElement.textContent = scoreO;
      localStorage.setItem("scoreO", scoreO); // Update O score in local storage
    }
  }
}
function newGame() {
  // Add code here to initialize or reset the game state as needed
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  if (isVsComputer && currentPlayer === "O") {
    setTimeout(() => computerTurn(), 1000); // Delay for the computer's first move
  }
}

function resetScore() {
  scoreX = 0;
  scoreO = 0;
  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
  localStorage.removeItem("scoreX"); // Remove X score from local storage
  localStorage.removeItem("scoreO"); // Remove O score from local storage
}

window.addEventListener("load", () => {
  newGame();
  document.getElementById("playAgainBtn").addEventListener("click", () => {
    newGame();
  });
});

/*add div instead of alert
add loading between 
add random
add the best way and choses 50/50 if its good or not
add the best way to play
score board
and add usename
to add to localstorage the score
center the div
add a better style*/
