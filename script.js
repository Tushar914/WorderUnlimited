let tdColumnCount = 0;
let tdTotalCount = 0;
let tdMaxCount = 0;
let wordSubmitted = false;
let secretWord = "";
let gameOver = false;
let currentWord = "";

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
    let response = await fetch('./selectedWordList.txt');
    let words = await response.text();
    const array = words.split("\n");
    secretWord = array[Math.floor(Math.random() * array.length)].toUpperCase().trim();
    //console.log("Secret word: " + secretWord);
}

function insertLetterInColumn(key, func) {
    let letter = document.getElementsByClassName('letter');

    if (func == 'submit') {
        if (tdColumnCount == 5) {
            console.log("max count: " + tdMaxCount)
            verifyWord(letter, currentWord);
            tdMaxCount = tdTotalCount;
            tdColumnCount = 0
            currentWord = ""
        } else {
            alert("Current word is not 5 letters long");
        }
    }

    if (func == 'valid') {
        if (tdColumnCount < 5) {
            letter[tdTotalCount].innerHTML = key.toUpperCase();
            currentWord += key.toUpperCase();
            tdTotalCount += 1;
            tdColumnCount += 1;
        }
    }

    if (func == 'remove') {
        if (tdColumnCount > 0) tdColumnCount -= 1;
        if ((tdTotalCount > 0) && (tdTotalCount > tdMaxCount)) tdTotalCount -= 1;
        letter[tdTotalCount].innerHTML = "";
        currentWord = currentWord.substring(0, currentWord.length - 1);
    }
}

function verifyWord(letterArray, currentWord) {
    if (currentWord === secretWord) {
        alert("Congratulations! Thats the correct word");
        gameOver = true;
    }

    if (tdTotalCount == 30) {
        alert("You lost! Correct word was: " + secretWord);
        gameOver = true;
    }

    for (var i = tdMaxCount; i < tdMaxCount + currentWord.length; i++) {
        //console.log("secretWord[" + (i - tdMaxCount) + "]: " + secretWord[i - tdMaxCount] + " | currentWord[" + (i - tdMaxCount) + "]: " + currentWord[i - tdMaxCount]);
        if (secretWord[i - tdMaxCount] == currentWord[i - tdMaxCount]) {
            letterArray[i].classList.add("correct");
        } else if (secretWord.indexOf(currentWord[i - tdMaxCount]) != -1) {
            letterArray[i].classList.add("position");
        }
    }
}

fetchText();

window.addEventListener("keydown", function(e) {
    //tested in IE/Chrome/Firefox
    if (!gameOver) {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122))
            insertLetterInColumn(e.key, 'valid')

        if (e.keyCode == 13)
            insertLetterInColumn(e.key, 'submit')

        if (e.keyCode == 8)
            insertLetterInColumn(e.key, 'remove')
    }
})