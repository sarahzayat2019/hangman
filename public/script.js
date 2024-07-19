(function() {
    const API_KEY = '3J4aXa0KwaeAMHdPNuSdhw==4Dss5sfJoz80vRei';
    const startGameButton = document.getElementById('start_game_button');
    const buttonSubmitLetterButton = document.getElementById('button_submit_letter');
    const inputLetterElement = document.getElementById('input_letter');

    const gameElements = {
        startGameSection: document.getElementById('start_game'),
        gameProcessSection: document.getElementById('game'),
        wrongLettersContainer: document.getElementById('wrong_letters'),
        base: document.getElementById('base'),
        errorMessage: document.getElementById('error_message'),
    };


    let gameData = {
        selectedWord: '',
        wrongLetters: [],
        wrongAttempts: 6,
    };
    startGameButton.addEventListener('click', startGame);
    buttonSubmitLetterButton.addEventListener('click', validateLetter);

    async function startGame() {
        gameElements.startGameSection.style.display = 'none';
        gameElements.gameProcessSection.style.display = 'block';
        gameData.selectedWord = await fetchWord();
        prepareGame();

    }

    function restartGame() {
        gameElements.startGameSection.style.display = 'flex';
        gameElements.gameProcessSection.style.display = 'none';
        gameData.selectedWord = '';
        gameData.wrongLetters = [];
        gameElements.wrongLettersContainer.innerHTML = '';
        gameElements.base.innerHTML = '';
        gameElements.errorMessage.style.display = 'none';
        const wordContainer = document.getElementById('word_bars');
        wordContainer.innerHTML = '';
    }


    async function fetchWord() {
        try {
            const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': API_KEY,
                }
            });
            const data = await response.json();
            return data.word[0];
        } catch (error) {
            console.error('Error fetching word:', error);
        }
    }

    function prepareGame() {
        const wordLength = gameData.selectedWord.length;
        const wordContainer = document.getElementById('word_bars');
        for (let i = 0; i < wordLength; i++) {
            const letterContainer = document.createElement('div');
            letterContainer.classList.add('letter-bar');
            wordContainer.appendChild(letterContainer);
        }
    }

    function validateLetter() {
        gameElements.errorMessage.style.display = 'none';
        const inputLetter = inputLetterElement.value;
        const letters = document.querySelectorAll('.letter-bar');
        const lettersArray = Array.from(letters);
        if (gameData.wrongLetters.includes(inputLetter)) {
            gameElements.errorMessage.style.display = 'block';
            return;
        }
        if (gameData.selectedWord.includes(inputLetter)) {
            lettersArray.forEach((letter, index) => {
                if (gameData.selectedWord[index] === inputLetter) {
                    letter.textContent = inputLetter;
                }
            });
            if (lettersArray.every(letter => letter.textContent)) {
                alert('You won!');
                restartGame();
            }
        } else {
            if (gameData.wrongLetters.length < gameData.wrongAttempts) {
                addWrongLetter(inputLetter);

            } else {
                alert('Game Over');
                restartGame();
            }
        }

        inputLetterElement.value = '';
    }

    function addWrongLetter(letter) {
        gameData.wrongLetters.push(letter);
        const span = document.createElement('span');
        span.textContent = letter;
        gameElements.wrongLettersContainer.appendChild(span);
        updateHangMan();
    }

    function updateHangMan() {
        const index = gameData.wrongLetters.length - 1;
        const img = document.createElement('img');
        img.src = `./images/${index}.svg`;
        img.classList.add('hangman-' + index);
        gameElements.base.append(img)

    }
})();
