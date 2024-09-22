document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.querySelector('#landing-page');
    const scrollButton = document.querySelector('#scroll-button');
    const modeSelection = document.querySelector('#mode-selection');
    const singlePlayerButton = document.querySelector('#single-player');
    const twoPlayerButton = document.querySelector('#two-player');
    const gameSection = document.querySelector('#game-section');
    const playAgainButton = document.querySelector('#playAgainButton');
    const winningMessageElement = document.querySelector('#winningMessage');
    const winningMessageText = document.querySelector('#winningMessageText');
    const cells = document.querySelectorAll('[data-cell]');
    const turnIndicator = document.querySelector('#turn-indicator');
    let oTurn;
    let isSinglePlayer = false;

    scrollButton.addEventListener('click', () => {
        landingPage.style.display = 'none';
        modeSelection.style.display = 'block';
    });

    singlePlayerButton.addEventListener('click', () => {
        isSinglePlayer = true;
        startGame();
    });
    
    twoPlayerButton.addEventListener('click', () => {
        isSinglePlayer = false;
        startGame();
    });

    function startGame() {
        modeSelection.style.display = 'none';
        gameSection.style.display = 'block';
        oTurn = false; // Player 1 starts
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.innerHTML = ''; // Clear cell content
            cell.addEventListener('click', handleClick, { once: true });
        });
        updateTurnIndicator();
    }

    function handleClick(e) {
        const cell = e.target;
        const currentClass = oTurn ? 'o' : 'x';
        cell.classList.add(currentClass);
        cell.innerHTML = currentClass === 'x' ? '❌' : '❤️'; // Use heart for O

        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            oTurn = !oTurn;
            updateTurnIndicator();
            if (isSinglePlayer && oTurn) {
                // AI Turn (basic random choice)
                setTimeout(() => {
                    const availableCells = Array.from(cells).filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
                    if (availableCells.length > 0) {
                        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
                        randomCell.click(); // Trigger click event programmatically
                    }
                }, 500);
            }
        }
    }

    function endGame(draw) {
        if (draw) {
            winningMessageText.textContent = "It's a Draw!";
        } else {
            winningMessageText.textContent = `${oTurn ? "Player 2 (❤️)" : "Player 1 (❌)"} Wins!`;
        }
        winningMessageElement.style.display = 'flex';
        showConfetti(); // Show confetti when the game ends
    }

    function showConfetti() {
        const confettiElement = document.querySelector('.confetti');
        confettiElement.style.display = 'block';
        setTimeout(() => {
            confettiElement.style.display = 'none'; // Hide confetti after a few seconds
        }, 3000);
    }

    function isDraw() {
        return [...cells].every(cell => cell.classList.contains('x') || cell.classList.contains('o'));
    }

    playAgainButton.addEventListener('click', () => {
        winningMessageElement.style.display = 'none';
        startGame();
    });

    function updateTurnIndicator() {
        turnIndicator.textContent = oTurn ? "Player 2's Turn (❤️)" : "Player 1's Turn (❌)";
    }

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

    function checkWin(currentClass) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].classList.contains(currentClass);
            });
        });
    }
});
