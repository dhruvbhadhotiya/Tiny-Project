document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;

    // Clear the initial text content of each cell
    cells.forEach(cell => cell.textContent = '');

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.id);

        if (board[cellIndex] || !gameActive) {
            return;
        }

        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
            gameActive = false;
            alert(`${currentPlayer} wins!`);
        } else if (board.every(cell => cell)) {
            gameActive = false;
            alert('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                const bestMove = minimax(board, 'O').index;
                board[bestMove] = 'O';
                cells[bestMove].textContent = 'O';
                if (checkWin('O')) {
                    gameActive = false;
                    alert('O wins!');
                } else if (board.every(cell => cell)) {
                    gameActive = false;
                    alert('Draw!');
                }
                currentPlayer = 'X';
            }
        }
    }

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.reduce((acc, cell, index) => {
            if (!cell) acc.push(index);
            return acc;
        }, []);

        if (checkWin('X')) {
            return { score: -10 };
        } else if (checkWin('O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function resetGame() {
        board.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    startButton.addEventListener('click', resetGame);
    resetButton.addEventListener('click', resetGame);
});