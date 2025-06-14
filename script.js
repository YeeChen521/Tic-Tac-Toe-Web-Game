const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, placeMarker, reset };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  const container = document.createElement("div");
  const display = document.createElement("p");
  container.appendChild(display);
  document.body.prepend(container);
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let gameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const playRound = (index) => {
    if (gameOver) return;

    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      if (checkWinner()) {
        display.innerText = `${currentPlayer.name} wins!`;
        gameOver = true;
      } else if (isDraw()) {
        display.innerText = "It's a draw!";
        gameOver = true;
      } else {
        switchPlayer();
      }
    }
  };

  const checkWinner = () => {
    const b = Gameboard.getBoard();
    const winningCombos = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diagonals
    ];
    return winningCombos.some(combo => 
      b[combo[0]] && b[combo[0]] === b[combo[1]] && b[combo[1]] === b[combo[2]]
    );
  };

  const isDraw = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  const resetGame = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
    display.innerText = " "
  };

  return { playRound, getCurrentPlayer, resetGame };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const restartBtn = document.querySelector("#restart");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      GameController.playRound(index);
      render();
    });
  });

  restartBtn.addEventListener("click", () => {
    GameController.resetGame();
    render();
  });

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  render();
})();

