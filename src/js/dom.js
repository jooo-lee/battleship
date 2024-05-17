const renderBoard = (container, board, isEnemy, sqClickCb = null) => {
    if (isEnemy && !sqClickCb) {
        throw new Error('Callback not provided for enemy board!');
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.column = j;
            if (!isEnemy && board[i][j]) {
                // Make ship visible in DOM
                square.classList.add('ship');
            }
            if (isEnemy) {
                square.addEventListener('click', sqClickCb);
            }
            container.appendChild(square);
        }
    }
};

const markMiss = (square) => {
    square.classList.add('miss');
};

const markHit = (square) => {
    square.classList.add('hit');
};

export { renderBoard, markMiss, markHit };
