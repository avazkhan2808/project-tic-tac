const form = document.querySelector('.form');
const wrapper = document.querySelector('.wrapper');
const formContainer = document.querySelector('.form-container');
const navBtn = document.querySelector('.nav-btn');
const formCloseBtn = document.querySelector('.form-close-btn');

function toggleForm() {
  if (wrapper.classList.contains('wrapperActive')) {
    toggleWrapper();
  }
  formContainer.classList.toggle('toggleClose');
}
function toggleWrapper() {
  wrapper.classList.toggle('wrapperActive');
}
navBtn.addEventListener('click', toggleForm);
formCloseBtn.addEventListener('click', toggleForm);

const Player = (name, marker) => {
  let turn = true;
  let positions = [];
  let wins = 0;
  const getName = () => name;
  const getMarker = () =>
    marker == 'X' ? 'fal fa-times x-marker' : 'fal fa-circle o-marker';
  const getIsTurn = () => turn;
  const setTurn = (newTurn) => (turn = newTurn);
  const getPositions = () => positions;
  const getWins = () => wins;
  const setWins = () => (wins += 1);
  return {
    getName,
    getMarker,
    getIsTurn,
    setTurn,
    getPositions,
    getWins,
    setWins,
  };
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input');

  const playerNames = ['playerOne', 'playerTwo'];

  inputs.forEach((input, index) => {
    playerNames[index] = Player(input.value, input.dataset.marker);
  });

  DisplayController.showBoard();
  DisplayController.render(playerNames);
});

const GameBoard = (() => {
  const gameBoardArray = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => gameBoardArray;

  const resetBoard = (board) => {
    console.log(board);
    const li = board.querySelectorAll('li');
    li.forEach((square) => {
      square.innerHTML = '';
    });
  };

  return { getBoard, resetBoard };
})();

const GameController = (() => {
  // Winning scenarios
  const winArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
  ];

  const checkWinner = (playerPositions) =>
    winArr.some((winVal) =>
      winVal.every((winPos) => playerPositions.includes(winPos)),
    );

  const restartGame = (playerNames) => {
    playerNames[0].getPositions().length = 0;
    playerNames[1].getPositions().length = 0;
  };

  return { checkWinner, restartGame };
})();

const DisplayController = (() => {
  const showBoard = () => {
    toggleForm();
    toggleWrapper();
  };

  const render = (playerNames) => {
    const allMoves = [];
    const board = document.querySelector('.board');
    board.innerHTML = '';

    const playerOnePlaceholder = document.querySelector(
      '.playerOnePlaceholder',
    );
    const playerTwoPlaceholder = document.querySelector(
      '.playerTwoPlaceholder',
    );

    playerOnePlaceholder.textContent = playerNames[0].getName();
    playerTwoPlaceholder.textContent = playerNames[1].getName();

    GameBoard.getBoard().forEach((row, index) => {
      const li = document.createElement('li');
      li.className = 'square';
      li.addEventListener('click', () => {
        const i = document.createElement('i');

        // If player's turn and is not filled
        if (playerNames[0].getIsTurn() && li.childNodes.length < 1) {
          i.className = playerNames[0].getMarker();
          li.append(i);
          playerNames[1].setTurn(true);
          playerNames[0].setTurn(false);
          playerNames[0].getPositions().push(index);
          allMoves.push(index);

          if (GameController.checkWinner(playerNames[0].getPositions())) {
            displayWinner(playerNames[0]);
            GameController.restartGame(playerNames);
            const playerOneScore = document.querySelector('.playerOne');
            playerOneScore.textContent = `${playerNames[0].getWins()}`;
            // Rerender after 1.5 seconds
            setTimeout(() => {
              reRenderBoard();
            }, 1000);
          }
        } else if (playerNames[1].getIsTurn() && li.childNodes.length < 1) {
          i.className = playerNames[1].getMarker();
          li.append(i);
          playerNames[0].setTurn(true);
          playerNames[1].setTurn(false);
          playerNames[1].getPositions().push(index);
          allMoves.push(index);

          if (GameController.checkWinner(playerNames[1].getPositions())) {
            displayWinner(playerNames[1]);
            GameController.restartGame(playerNames);
            const playerTwoScore = document.querySelector('.playerTwo');
            playerTwoScore.textContent = `${playerNames[1].getWins()}`;
            // Rerender after 1.5 seconds
            setTimeout(() => {
              reRenderBoard();
            }, 1000);
          }
        } else if (allMoves.length >= 8) {
          const gameInfo = document.querySelector('.game-info');
          gameInfo.textContent = "It's draw!";
          allMoves.length = 0;
          GameController.restartGame(playerNames);
          setTimeout(() => {
            gameInfo.textContent = '';
            reRenderBoard();
          }, 1000);
        }
      });
      board.append(li);
    });

    const displayWinner = (player) => {
      const gameInfo = document.querySelector('.game-info');
      gameInfo.textContent = `${player.getName()} wins!`;
      player.setWins();
      setTimeout(() => {
        gameInfo.textContent = '';
      }, 1000);
    };

    const reRenderBoard = () => {
      const lis = board.querySelectorAll('li');
      lis.forEach((li) => {
        li.innerHTML = '';
      });
    };
  };

  return { render, showBoard };
})();
