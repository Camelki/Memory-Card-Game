document.addEventListener('DOMContentLoaded', function() {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; 
    const shapes = ['circle', 'square', 'triangle', 'stars']; 
    const gridSize = 4; 

    let gameMode = null; 
    let cards = []; 
    let flippedCards = []; 
    let matchesFound = 0; 
    let lives = 5; 
    let timerInterval; 
    let timeElapsed = 0; 
    let gameStarted = false; 
    let timerRunning = false;
    let foundPairs = []; 

    const gridContainer = document.getElementById('gridContainer');
    const timeDisplay = document.getElementById('time');
    const livesContainer = document.getElementById('livesContainer');
    const restartBtn = document.getElementById('restartBtn');
    const lettersBtn = document.getElementById('lettersBtn');
    const shapesBtn = document.getElementById('shapesBtn');
    const cardTypeSelection = document.getElementById('cardTypeSelection');

    function initGame(mode) {
        gameMode = mode;
        generateCards();
        shuffleCards();
        renderCards();
        startTimer();
        updateLivesDisplay();
    }

    function generateCards() {
        cards = [];
        const basePath = 'img/'; 
        const cardValues = gameMode === 'letters' ? letters.map(letter => basePath + letter.toLowerCase() + '.png') : shapes.map(shape => basePath + shape + '.png');
        let id=0;
        const pairsCount = gameMode === 'letters' ? gridSize * gridSize / 2 : gridSize * gridSize / 4; 
    
        for (let i = 0; i < pairsCount; i++) {
           const value = cardValues[i % cardValues.length]; 
        cards.push({ id: id++, value: value, flipped: false });
        cards.push({ id: id++, value: value, flipped: false });
    }
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function renderCards() {
        gridContainer.innerHTML = '';

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = card.id;
            if (!card.flipped) {
                const cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = '?'; 
                cardElement.appendChild(cardBack);
            } else {
                const cardImage = document.createElement('img');
                cardImage.src = card.value;
                cardImage.alt = "shapes";
                cardElement.appendChild(cardImage);
            }

            cardElement.addEventListener('click', flipCard);
            gridContainer.appendChild(cardElement);
        });
    }

    function flipCard(event) {
        const cardElement = event.target.closest('.card');
        const cardId = cardElement.dataset.index;
        const card = cards.find(c => c.id.toString() === cardId);
    
        if (!card.flipped && flippedCards.length < 2) {
            card.flipped = true; 
            flippedCards.push(card); 
    
            updateCardDisplay(cardElement, card);
    
            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 500); 
            }
        }
    }
    
    function updateCardDisplay(cardElement, card) {
        cardElement.innerHTML = ''; 
        if (card.flipped) {
            if (gameMode === 'shapes') {
            const cardImage = document.createElement('img');
            cardImage.src = card.value; 
            cardImage.alt = "shapes"; 
            cardImage.classList.add('card-image'); 
            cardElement.appendChild(cardImage);
             } else if (gameMode === 'letters') {
                cardElement.textContent = card.value.split('/').pop().split('.')[0]; 
                cardElement.classList.add('letter'); 
            }
        } else {
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = '?'; 
            cardElement.appendChild(cardBack);
        }
    }

    function checkForMatch() {
        if (flippedCards.length === 2) {
            const [card1, card2] = flippedCards;
            const cardElements = [gridContainer.querySelector(`[data-index='${card1.id}']`), gridContainer.querySelector(`[data-index='${card2.id}']`)];
    
            if (card1.value === card2.value) {
                foundPairs.push(card1.id, card2.id);
                matchesFound++;
                cardElements.forEach(el => el.classList.add('matched')); 
                flippedCards = []; 
                const totalPairs = gameMode === 'letters' ? gridSize * gridSize / 2 : gridSize * gridSize / 4;
                if (matchesFound === totalPairs) {
                    endGame(true); 
                }
            } else {
                lives--;
                updateLivesDisplay();
                if (lives === 0) {
                    endGame(false); 
                } else {
                    setTimeout(() => {
                        cardElements.forEach(el => {
                            const cardId = el.dataset.index;
                            const card = cards.find(c => c.id.toString() === cardId);
                            card.flipped = false;
                            updateCardDisplay(el, card); 
                        });
                        flippedCards = []; 
                    }, 500);
                }
            }
        }
    }

    function resetFlippedCards() {
        flippedCards.forEach(card => {
            card.flipped = false;
        });
        flippedCards = [];
        renderCards();
        rebindCardListeners(); 
    }
    function rebindCardListeners() {
        gridContainer.querySelectorAll('.card').forEach(cardElement => {
            const cardIndex = cardElement.dataset.index;
            if (!cards[cardIndex].flipped) {
                cardElement.addEventListener('click', flipCard);
            }
        });
    }
    

function startTimer() {
    if (gameStarted && !timerRunning) {  
        timerRunning = true;
        timerInterval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

    function stopTimer() {
        clearInterval(timerInterval);
        timerRunning = false; 

    }

    function updateLivesDisplay() {
        livesContainer.textContent = '❤️'.repeat(lives);
    }


function endGame(win) {
    stopTimer(); 

    let message = win
        ? `Congratulations! You completed the game in ${timeElapsed} seconds with ${lives} lives left.`
        : 'Sorry, you lost. Try again!';

    alert(message);
}
    

function resetGame() {
    startTimer(); 
    timeElapsed = 0;
    matchesFound = 0;
    lives = 5;
    updateLivesDisplay();
    flippedCards = [];
    generateCards();
    shuffleCards();
    renderCards();
    timeDisplay.textContent = '0:00';
}

lettersBtn.addEventListener('click', function() {
    gameMode = 'letters'; 
    gameStarted = true; 
    initGame('letters'); 
    cardTypeSelection.style.display = 'none'; 
    startTimer(); 
});

shapesBtn.addEventListener('click', function() {
    gameMode = 'shapes'; 
    gameStarted = true; 
    initGame('shapes'); 
    cardTypeSelection.style.display = 'none'; 
    startTimer(); 

});

restartBtn.addEventListener('click', resetGame);

initGame('letters');
});