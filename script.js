let tdColumnCount = 0;
let tdTotalCount = 0;
let tdMaxCount = 0;
let secretWord = "";
let gameOver = false;
let currentWord = "";
let allWords;

const myHeaders = new Headers();
myHeaders.append('Acces-Control-Allow-Origin', '*');
myHeaders.append('Acces-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
myHeaders.append('Acces-Contorl-Allow-Methods', 'Content-Type', 'Authorization');

async function fetchJSON() {
    // let response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    let response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    let word = await response
    if (word[0].length != 5) {
        putTextInHtml("Fetching...")
        fetchText();
    } else {
        putTextInHtml(word);
    }
}

async function fetchText() {
    let response = await fetch('./selectedWordList2.txt');
    let words = await response.text();
    const array = words.split("\n");
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    allWords = new Set(array);
    secretWord = array[Math.floor(Math.random() * array.length)].trim();
}

function insertLetterInColumn(key, func) {
    let letter = document.getElementsByClassName('letter');

    if (func == 'submit') {
        if (tdColumnCount != 5) {
            showSnackbar('Not a 5 letter word', 'show-danger');
            return;
        }

        if (!allWords.has(currentWord)) {
            showSnackbar('Not a valid word', 'show-danger');
            return;
        }
        if (tdColumnCount == 5) {
            verifyWord(letter, currentWord);
            tdMaxCount = tdTotalCount;
            tdColumnCount = 0
            currentWord = ""
        }
    }

    if (func == 'insert') {
        if (tdColumnCount < 5) {
            letter[tdTotalCount].innerHTML = key.toUpperCase();
            currentWord += key.toLowerCase();
            tdTotalCount += 1;
            tdColumnCount += 1;
        }
    }

    if (func == 'remove') {
        if (tdColumnCount > 0)
            tdColumnCount -= 1;

        if ((tdTotalCount > 0) && (tdTotalCount > tdMaxCount))
            tdTotalCount -= 1;
        letter[tdTotalCount].innerHTML = "";
        currentWord = currentWord.substring(0, currentWord.length - 1);
    }
}

function verifyWord(letterArray, currentWord) {
    if (currentWord === secretWord) {
        showSnackbar('Congrats! You guessed it.', 'show-success');
        gameOver = true;
    } else if (tdTotalCount == 30) {
        showSnackbar('You lost! The secret word is <strong>' + secretWord.toUpperCase() + '<strong>', 'show-danger', 15000);
        gameOver = true;
    }

    for (var i = tdMaxCount; i < tdMaxCount + currentWord.length; i++) {
        if (secretWord[i - tdMaxCount] == currentWord[i - tdMaxCount]) {
            letterArray[i].classList.add("correct");
        } else if (secretWord.indexOf(currentWord[i - tdMaxCount]) != -1) {
            //check for repeating letters
            if (!new Set(currentWord.substring(0, i - tdMaxCount)).has(currentWord[i - tdMaxCount])) {
                letterArray[i].classList.add("position");
            }
        } else {
            letterArray[i].classList.add("wrong");
        }
    }
}

function showSnackbar(err, sbClass, duration = 3000) {
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = err;
    snackbar.className = sbClass;
    setTimeout(function() { snackbar.className = snackbar.className.replace(sbClass, ""); }, duration);
}

window.onclick = e => {
    if (!gameOver) {
        if (e.target.classList.contains('keyboard-btn-letter')) {
            insertLetterInColumn(e.target.innerHTML, 'insert');
        }

        if (e.target.classList.contains('keyboard-btn-enter')) {
            insertLetterInColumn(e.target.innerHTML, 'submit');
        }

        if (e.target.classList.contains('keyboard-btn-remove')) {
            insertLetterInColumn(e.target.innerHTML, 'remove');
        }
    }
}

fetchText();

window.addEventListener("keydown", function(e) {
    //tested in IE/Chrome/Firefox
    if (!gameOver) {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122))
            insertLetterInColumn(e.key, 'insert')

        if (e.keyCode == 13)
            insertLetterInColumn(e.key, 'submit')

        if (e.keyCode == 8)
            insertLetterInColumn(e.key, 'remove')
    }
})