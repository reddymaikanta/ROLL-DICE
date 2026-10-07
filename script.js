
/* -----------------------------
   HTML ELEMENTS
----------------------------- */

const dice = document.getElementById("dice");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

const scoreElement = document.getElementById("score");
const rollsElement = document.getElementById("rolls");
const bestElement = document.getElementById("best");

const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");

const themeBtn = document.getElementById("themeBtn");


/* -----------------------------
   GAME VARIABLES
----------------------------- */

let score = 0;
let rolls = 0;
let best = Number(localStorage.getItem("bestScore")) || 0;

let history = [];

let rolling = false;

bestElement.textContent = best;


/* -----------------------------
   DICE FACES
----------------------------- */

const diceFaces = {

    1: `<div class="pip"></div>`,

    2: `
        <div class="pip"></div>
        <div class="pip"></div>
    `,

    3: `
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
    `,

    4: `
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
    `,

    5: `
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
    `,

    6: `
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
    `
};


/* -----------------------------
   SOUND
----------------------------- */

function playSound() {

    const audioContext =
        new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 250;

    gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.15
    );
}


/* -----------------------------
   ROLL DICE
----------------------------- */

function rollDice() {

    if (rolling) return;

    rolling = true;

    result.textContent = "Rolling...";

    dice.classList.remove("rolling");

    /* Force browser to restart animation */
    void dice.offsetWidth;

    dice.classList.add("rolling");

    playSound();

    setTimeout(() => {

        const randomNumber =
            Math.floor(Math.random() * 6) + 1;

        /* Update dice */
        dice.className =
            "dice face-" + randomNumber;

        dice.innerHTML =
            diceFaces[randomNumber];

        /* Update score */
        score += randomNumber;

        rolls++;

        scoreElement.textContent = score;
        rollsElement.textContent = rolls;

        /* Best score */
        if (score > best) {

            best = score;

            bestElement.textContent = best;

            localStorage.setItem(
                "bestScore",
                best
            );
        }

        /* Result */
        result.innerHTML =
            `You rolled: <span>${randomNumber}</span>`;

        /* History */
        history.unshift(randomNumber);

        updateHistory();

        rolling = false;

    }, 800);
}


/* -----------------------------
   HISTORY
----------------------------- */

function updateHistory() {

    historyList.innerHTML = "";

    history.slice(0, 15).forEach(number => {

        const item =
            document.createElement("div");

        item.className = "history-item";

        item.textContent = number;

        historyList.appendChild(item);
    });
}


/* -----------------------------
   CLEAR HISTORY
----------------------------- */

clearBtn.addEventListener("click", () => {

    history = [];

    updateHistory();

});


/* -----------------------------
   RESET GAME
----------------------------- */

resetBtn.addEventListener("click", () => {

    score = 0;

    rolls = 0;

    history = [];

    scoreElement.textContent = "0";

    rollsElement.textContent = "0";

    result.textContent =
        "Click Roll Dice to start!";

    dice.className = "dice face-1";

    dice.innerHTML =
        '<div class="pip"></div>';

    updateHistory();

});


/* -----------------------------
   BUTTON EVENTS
----------------------------- */

rollBtn.addEventListener(
    "click",
    rollDice
);

dice.addEventListener(
    "click",
    rollDice
);


/* -----------------------------
   SPACEBAR
----------------------------- */

window.addEventListener("keydown", event => {

    if (event.code === "Space") {

        event.preventDefault();

        rollDice();
    }

});


/* -----------------------------
   DARK / LIGHT MODE
----------------------------- */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }

});
