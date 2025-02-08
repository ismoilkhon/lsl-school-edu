document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { question: 'Capital of Japan', answer: 'tokyo' },
        { question: 'Capital of Canada', answer: 'ottawa' },
        { question: 'Smallest country in the world', answer: 'vatican' },
        { question: 'Tallest mountain in the world', answer: 'everest' },
        { question: 'Capital of Brazil', answer: 'brasilia' },
        { question: 'Fastest land animal', answer: 'cheetah' },
        { question: 'Capital of Italy', answer: 'rome' },
        { question: 'Deepest ocean in the world', answer: 'pacific' },
        { question: 'One of the largest trees', answer: 'baobab' },
        { question: 'Largest ocean in the world', answer: 'pacific' }  
    ];

    let currentQuestion = {};
    let incorrectGuesses = 0;
    const maxIncorrectGuesses = 6;
    const guessedLetters = new Set();

    const questionElement = document.getElementById('question');
    const imageElement = document.getElementById('hangman-img');
    const wordDisplayElement = document.getElementById('word-display');
    const guessCountElement = document.getElementById('guess-count');
    const virtualKeyboardElement = document.getElementById('virtual-keyboard');
    const modalElement = document.getElementById('modal');
    const modalMessageElement = document.getElementById('modal-message');
    const secretWordElement = document.getElementById('secret-word');
    const playAgainButton = document.getElementById('play-again');

    const myNums = [1, 2, 3];
    const doubled = myNums.find(num => num % 2 === 0);
    console.log(doubled)
    console.log(myNums)

    function initializeGame() {
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        incorrectGuesses = 0;
        guessedLetters.clear();
        questionElement.textContent = currentQuestion.question;
        guessCountElement.textContent = incorrectGuesses;
        wordDisplayElement.innerHTML = '_ '.repeat(currentQuestion.answer.length);
        virtualKeyboardElement.innerHTML = '';
        imageElement.src = `assets/Gallows_${incorrectGuesses}.png`
        createVirtualKeyboard();
        modalElement.classList.add('hidden');
    }

    function createVirtualKeyboard() {
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i).toLowerCase();
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => handleGuess(letter));
            virtualKeyboardElement.appendChild(button);
        }
    }

    function handleGuess(letter) {
        if (guessedLetters.has(letter) || incorrectGuesses >= maxIncorrectGuesses) return;
        guessedLetters.add(letter);
        const buttons = virtualKeyboardElement.getElementsByTagName('button');
        for (let button of buttons) {
            if (button.textContent === letter) {
                button.classList.add('disabled');
                button.disabled = true;
            }
        }
        if (currentQuestion.answer.includes(letter)) {
            updateWordDisplay();
            if (isWordGuessed()) {
                endGame(true);
            }
        } else {
            incorrectGuesses++;
            imageElement.src = `assets/Gallows_${incorrectGuesses}.png`
            guessCountElement.textContent = incorrectGuesses;
            if (incorrectGuesses >= maxIncorrectGuesses) {
                endGame(false);
            }
        }
    }

    function updateWordDisplay() {
        let display = '';
        for (const letter of currentQuestion.answer) {
            display += guessedLetters.has(letter) ? letter + ' ' : '_ ';
        }
        wordDisplayElement.textContent = display.trim();
    }

    function isWordGuessed() {
        return currentQuestion.answer.split('').every(letter => guessedLetters.has(letter));
    }

    function endGame(won) {
        modalElement.classList.remove('hidden');
        modalMessageElement.textContent = won ? 'Congratulations! You guessed the word!' : 'Sorry, you lost!';
        secretWordElement.textContent = currentQuestion.answer;

        const buttons = virtualKeyboardElement.getElementsByTagName('button');
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    playAgainButton.addEventListener('click', initializeGame );

    document.addEventListener('keydown', (event) => {
        const letter = event.key.toLowerCase();
        if (/^[a-z]$/.test(letter) && incorrectGuesses < maxIncorrectGuesses) {
            handleGuess(letter);
        }
    });

    initializeGame();
});
