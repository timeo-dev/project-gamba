// ==========================================
// GAMBA JAVASCRIPT
// ==========================================


// ==========================================
// STARTWERTE
// ==========================================

let wallet = 1000;

let bet = 10;

let rotation = 0;

let gameRunning = false;


// ==========================================
// HTML ELEMENTE HOLEN
// ==========================================

const walletText =
    document.getElementById("wallet");

const betText =
    document.getElementById("bet");

const profitText =
    document.getElementById("profit");

const lastWinText =
    document.getElementById("lastWin");


const plusButton =
    document.getElementById("plusButton");

const minusButton =
    document.getElementById("minusButton");

const playButton =
    document.getElementById("playButton");


const wheel =
    document.getElementById("wheel");


// SPIELAUSWAHL

const wheelGameButton =
    document.getElementById("wheelGameButton");

const diceGameButton =
    document.getElementById("diceGameButton");


// SPIELE

const wheelGame =
    document.getElementById("wheelGame");

const diceGame =
    document.getElementById("diceGame");


// WÜRFEL

const diceButton =
    document.getElementById("diceButton");

const dice =
    document.getElementById("dice");


// KONTO / SETTINGS

const accountButton =
    document.getElementById("accountButton");

const settingsButton =
    document.getElementById("settingsButton");



// ==========================================
// FUNKTION
// ANZEIGE AKTUALISIEREN
// ==========================================

function updateDisplay() {

    walletText.textContent = wallet;

    betText.textContent = bet;

}



// ==========================================
// FUNKTION
// GEWINN / VERLUST ANZEIGEN
// ==========================================

function showProfit(profit) {

    if (profit > 0) {

        profitText.textContent =
            "+" + profit;

    }

    else {

        profitText.textContent =
            profit;

    }

}



// ==========================================
// FUNKTION
// EINSATZ ERHÖHEN
// ==========================================

function increaseBet() {

    if (gameRunning === true) {
        return;
    }


    if (bet + 10 <= wallet) {

        bet = bet + 10;

        updateDisplay();

    }

}



// ==========================================
// FUNKTION
// EINSATZ VERRINGERN
// ==========================================

function decreaseBet() {

    if (gameRunning === true) {
        return;
    }


    if (bet > 10) {

        bet = bet - 10;

        updateDisplay();

    }

}



// ==========================================
// FUNKTION
// GLÜCKSRAD SPIELEN
// ==========================================

function playWheel() {

    // Spiel läuft bereits

    if (gameRunning === true) {
        return;
    }


    // Nicht genügend Coins

    if (wallet < bet) {

        alert("Du hast nicht genügend Coins!");

        return;

    }


    gameRunning = true;

    playButton.disabled = true;


    // Einsatz abziehen

    wallet = wallet - bet;

    updateDisplay();


    // Zufälliges Feld 0 - 5

    let randomField =
        Math.floor(Math.random() * 6);


    // Multiplikatoren

    let multipliers =
        [0, 1, 2, 0, 1, 3];


    let multiplier =
        multipliers[randomField];


    // Gewinn berechnen

    let win =
        bet * multiplier;


    // Rad drehen

    rotation =
        rotation + 720 + randomField * 60;


    wheel.style.transform =
        "rotate(" + rotation + "deg)";


    // 2 Sekunden warten
    // bis das Rad fertig gedreht hat

    setTimeout(function () {

        // Gewinn zur Wallet hinzufügen

        wallet = wallet + win;


        // Gewinn / Verlust berechnen

        let profit =
            win - bet;


        // Letzten Gewinn anzeigen

        lastWinText.textContent =
            win;


        // Gewinn / Verlust anzeigen

        showProfit(profit);


        // Anzeigen aktualisieren

        updateDisplay();


        // Spiel wieder freigeben

        gameRunning = false;

        playButton.disabled = false;


    }, 2000);

}



// ==========================================
// FUNKTION
// GLÜCKSRAD ANZEIGEN
// ==========================================

function showWheelGame() {

    wheelGame.classList.remove("hidden");

    diceGame.classList.add("hidden");

}



// ==========================================
// FUNKTION
// WÜRFELSPIEL ANZEIGEN
// ==========================================

function showDiceGame() {

    wheelGame.classList.add("hidden");

    diceGame.classList.remove("hidden");

}



// ==========================================
// FUNKTION
// WÜRFELN
// ==========================================

function rollDice() {

    // Prüfen ob genug Coins vorhanden sind

    if (wallet < bet) {

        alert("Du hast nicht genügend Coins!");

        return;

    }


    // Zufallszahl 1 - 6

    let number =
        Math.floor(Math.random() * 6) + 1;


    // Würfelsymbole

    let diceSymbols = [
        "⚀",
        "⚁",
        "⚂",
        "⚃",
        "⚄",
        "⚅"
    ];


    // Würfel anzeigen

    dice.textContent =
        diceSymbols[number - 1];


    // Einsatz abziehen

    wallet = wallet - bet;


    let win = 0;


    // 4, 5 oder 6 = Gewinn

    if (number >= 4) {

        win = bet * 2;

    }


    // Gewinn hinzufügen

    wallet = wallet + win;


    // Gewinn / Verlust

    let profit =
        win - bet;


    // Letzten Gewinn anzeigen

    lastWinText.textContent =
        win;


    showProfit(profit);


    updateDisplay();

}



// ==========================================
// FUNKTION
// KONTO
// ==========================================

function showAccount() {

    alert(
        "GAMBA Konto\n\n" +
        "Aktuelles Guthaben: " +
        wallet +
        " Coins"
    );

}



// ==========================================
// FUNKTION
// SETTINGS
// ==========================================

function showSettings() {

    alert(
        "Die Einstellungen werden später hinzugefügt."
    );

}



// ==========================================
// BUTTONS MIT FUNKTIONEN VERBINDEN
// ==========================================


// PLUS

plusButton.addEventListener(
    "click",
    increaseBet
);


// MINUS

minusButton.addEventListener(
    "click",
    decreaseBet
);


// PLAY

playButton.addEventListener(
    "click",
    playWheel
);


// GLÜCKSRAD AUSWÄHLEN

wheelGameButton.addEventListener(
    "click",
    showWheelGame
);


// WÜRFELSPIEL AUSWÄHLEN

diceGameButton.addEventListener(
    "click",
    showDiceGame
);


// WÜRFELN

diceButton.addEventListener(
    "click",
    rollDice
);


// KONTO

accountButton.addEventListener(
    "click",
    showAccount
);


// SETTINGS

settingsButton.addEventListener(
    "click",
    showSettings
);



// ==========================================
// WEBSEITE STARTEN
// ==========================================

updateDisplay();