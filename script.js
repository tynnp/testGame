const images = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍇', '🍍', '🥭'];
let shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timerSeconds = 30;
let timerInterval;
let gameStarted = false;

function createCard(image, index) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.index = index;

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');
  cardInner.innerText = image;

  card.appendChild(cardInner);
  card.addEventListener('click', flipCard);
  return card;
}

function flipCard() {
  if (!gameStarted) return;

  const card = this;

  if (!card.classList.contains('flipped') && flippedCards.length < 2) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.querySelector('.card-inner').innerText === card2.querySelector('.card-inner').innerText;

  if (isMatch) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchedPairs++;

    score += 10;
    document.getElementById('score').innerText = `Điểm: ${score}`;

    if (matchedPairs === images.length) {
      endGame(true); // Người chơi chiến thắng
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    score = Math.max(0, score - 5);
    document.getElementById('score').innerText = `Điểm: ${score}`;
  }

  flippedCards = [];
}

function updateTimer() {
  if (timerSeconds > 0) {
    timerSeconds--;
    document.getElementById('timer').innerText = `Thời gian còn lại: ${timerSeconds}s`;
  } else {
    endGame(false); // Người chơi thua
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('start-btn').disabled = true;

    const cards = document.querySelectorAll('.card');

    // Lật tất cả các thẻ cùng một lúc
    cards.forEach((card) => {
      card.classList.add('flipped');
    });

    // Sau 0.75 giây, úp ngược lại tất cả các thẻ
    setTimeout(() => {
      cards.forEach((card) => {
        card.classList.remove('flipped');
      });

    }, 750); 
  }
}

function endGame(isWinner) {
  clearInterval(timerInterval);

  const overlay = document.getElementById('overlay');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('reset-btn');

  if (isWinner) {
      const discountPercentage = Math.min(100, score);
      message.innerText = `Chúc mừng bạn đã nhận được ưu đãi ${discountPercentage}% từ trò chơi!`;
  } else {
      message.innerText = 'Tiếc quá, bạn không nhận được ưu đãi từ trò chơi rồi!';
  }

  overlay.style.display = 'flex';

  resetBtn.addEventListener('click', function () {
      overlay.style.display = 'none';
      resetGame();
  });
}

function resetGame() {
  shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
  flippedCards = [];
  matchedPairs = 0;
  score = 0;
  timerSeconds = 30;
  gameStarted = false;

  document.getElementById('game-board').innerHTML = '';
  document.getElementById('score').innerText = `Điểm: ${score}`;
  document.getElementById('timer').innerText = `Thời gian còn lại: ${timerSeconds}s`;
  document.getElementById('start-btn').disabled = false;

  createGameBoard();
}

function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  for (let i = 0; i < shuffledImages.length; i++) {
    const card = createCard(shuffledImages[i], i);
    gameBoard.appendChild(card);
  }
}

// Tạo bảng trò chơi khi trang được tải lần đầu
createGameBoard();
