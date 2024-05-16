const renderBoard = (container, board, shipsVisible) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if (shipsVisible && board[i][j]) {
                // Make ship visible in DOM
                square.classList.add('ship');
            }
            container.appendChild(square);
        }
    }
};

export { renderBoard };
