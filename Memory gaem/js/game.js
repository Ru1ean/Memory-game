class Game {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.setDifficultySettings();
        this.symbols = [
            '🍎','🍌','🍒','🍇','🍉','🍋','🍓','🍑','🥝','🍍','🥥','🥭','🍈','🍏','🍐','🍊','🍋','🍌','🍉','🍇',
            '🍓','🍒','🍑','🥝','🍍','🥥','🥭','🍈','🍏','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🥝','🍍',
            '🥥','🥭','🍈','🍏','🍐','🍊','🍋','🍌','🍉','🍇'
        ];
        this.symbols = this.symbols.slice(0, Math.floor(this.totalCards/2));
        this.cards = [...this.symbols, ...this.symbols];
        if (this.cards.length < this.totalCards) this.cards.push('⭐');
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        this.gameBoard = document.getElementById('gameBoard');
        this.flipped = [];
        this.matched = [];
        this.timerDiv = document.getElementById('timer');
        this.timerInterval = null;
        this.popup = document.getElementById('popup');
        this.popupMessage = document.getElementById('popup-message');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.mainMenuBtn = document.getElementById('mainMenuBtn');

        this.initGame();
    }

    setDifficultySettings() {
        switch(this.difficulty) {
            case 'easy':
                this.boardSize = 4;
                this.timeLeft = 300; // 2 minutes
                break;
            case 'medium':
                this.boardSize = 6;
                this.timeLeft = 600; // 3 minutes
                break;
            case 'hard':
                this.boardSize = 10;
                this.timeLeft = 1000; // 15 minutes
                break;
        }
        this.totalCards = this.boardSize * this.boardSize;
    }

    initGame() {
        this.startTimer();
        for (let i = 0; i < this.totalCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            card.innerText = '';
            card.onclick = () => this.flipCard(card, i);
            this.gameBoard.appendChild(card);
        }
        this.tryAgainBtn.onclick = () => this.resetGame();
        this.playAgainBtn.onclick = () => this.resetGame();
        this.mainMenuBtn.onclick = () => window.location.href = 'index.html';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            let min = String(Math.floor(this.timeLeft/60)).padStart(2,'0');
            let sec = String(this.timeLeft%60).padStart(2,'0');
            this.timerDiv.textContent = `Time Left: ${min}:${sec}`;
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.timerDiv.textContent = 'Time Up!';
                this.disableCards();
                this.showPopup('Time is up! Try again.');
            }
        }, 1000);
    }

    flipCard(card, i) {
        if (this.flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched') && this.timeLeft > 0) {
            card.classList.add('flipped');
            card.innerText = this.cards[i];
            this.flipped.push({idx: i, el: card});

            if (this.flipped.length === 2) {
                setTimeout(() => {
                    if (this.cards[this.flipped[0].idx] === this.cards[this.flipped[1].idx]) {
                        this.flipped[0].el.classList.add('matched');
                        this.flipped[1].el.classList.add('matched');
                        this.matched.push(this.flipped[0].idx, this.flipped[1].idx);
                        if (this.matched.length === this.totalCards) {
                            clearInterval(this.timerInterval);
                            this.showPopup('You win!');
                        }
                    } else {
                        this.flipped[0].el.classList.remove('flipped');
                        this.flipped[1].el.classList.remove('flipped');
                        this.flipped[0].el.innerText = '';
                        this.flipped[1].el.innerText = '';
                    }
                    this.flipped = [];
                }, 800);
            }
        }
    }

    disableCards() {
        Array.from(document.getElementsByClassName('card')).forEach(card => card.onclick = null);
    }

    showPopup(message) {
        if (message === 'You win!') {
            this.popupMessage.innerText = 'Congratulations! 🎉';
        } else if (message === 'Time is up! Try again.') {
            this.popupMessage.innerText = 'Try Again! ⏰';
        }
        this.popup.style.display = 'flex';
    }

    hidePopup() {
        this.popup.style.display = 'none';
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.hidePopup();
        this.flipped = [];
        this.matched = [];
        this.setDifficultySettings();
        this.timerDiv.textContent = `Time Left: ${String(Math.floor(this.timeLeft/60)).padStart(2,'0')}:${String(this.timeLeft%60).padStart(2,'0')}`;
        this.gameBoard.innerHTML = '';
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        this.initGame();
    }
}

// Initialize game based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    let difficulty;
    
    if (path.includes('easy')) {
        difficulty = 'easy';
    } else if (path.includes('medium')) {
        difficulty = 'medium';
    } else if (path.includes('hard')) {
        difficulty = 'hard';
    }
    
    if (difficulty) {
        new Game(difficulty);
    }
}); 