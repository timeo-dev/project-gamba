// ==========================================
// GAMBA
// Spielsimulation mit virtuellen Coins
// ==========================================


// ==========================================
// GRUNDEINSTELLUNGEN
// ==========================================

const START_COINS = 1000;

const DAILY_BONUS = 100;


// 24 Stunden in Millisekunden
const BONUS_TIME =
    24 * 60 * 60 * 1000;


// ==========================================
// SPIELVARIABLEN
// ==========================================

let username = "";

let wallet = START_COINS;

let bet = 10;

let rotation = 0;

let gameRunning = false;


// ==========================================
// SETTINGS
// ==========================================

let settings = {

    animation: true,

    darkMode: true

};


// ==========================================
// GLÜCKSRAD MULTIPLIKATOREN
//
// 3 POSITIV
// 3 NEGATIV
//
// = 50 / 50
// ==========================================

const wheelMultipliers = [

    2,

    -1,

    1,

    -2,

    0.5,

    -0.5

];


// ==========================================
// HTML ELEMENTE
// ==========================================

const walletText =
    document.getElementById("wallet");

const betText =
    document.getElementById("bet");

const profitText =
    document.getElementById("profit");

const lastWinText =
    document.getElementById("lastWin");


const wheel =
    document.getElementById("wheel");


const plusButton =
    document.getElementById("plusButton");

const minusButton =
    document.getElementById("minusButton");

const playButton =
    document.getElementById("playButton");


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

const dice =
    document.getElementById("dice");

const diceButton =
    document.getElementById("diceButton");


// ==========================================
// KONTO ELEMENTE
// ==========================================

const registerScreen =
    document.getElementById("registerScreen");

const usernameInput =
    document.getElementById("usernameInput");

const createAccountButton =
    document.getElementById("createAccountButton");

const registerError =
    document.getElementById("registerError");


const accountButton =
    document.getElementById("accountButton");

const accountScreen =
    document.getElementById("accountScreen");

const accountUsername =
    document.getElementById("accountUsername");

const accountWallet =
    document.getElementById("accountWallet");

const closeAccountButton =
    document.getElementById("closeAccountButton");


// ==========================================
// SETTINGS ELEMENTE
// ==========================================

const settingsButton =
    document.getElementById("settingsButton");

const settingsScreen =
    document.getElementById("settingsScreen");

const animationSetting =
    document.getElementById("animationSetting");

const darkSetting =
    document.getElementById("darkSetting");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");

const closeSettingsButton =
    document.getElementById("closeSettingsButton");


// ==========================================
// BONUS
// ==========================================

const bonusButton =
    document.getElementById("bonusButton");


// ==========================================
// WEBSEITE STARTEN
// ==========================================

function startWebsite() {

    loadAccount();

    loadSettings();

    updateDisplay();

    updateBonusButton();

}


// ==========================================
// KONTO LADEN
// ==========================================

function loadAccount() {

    const savedUsername =
        localStorage.getItem(
            "gambaUsername"
        );


    const savedWallet =
        localStorage.getItem(
            "gambaWallet"
        );


    // Noch kein Konto vorhanden

    if (savedUsername === null) {

        registerScreen.classList.remove(
            "hidden"
        );

        return;

    }


    username = savedUsername;


    if (savedWallet !== null) {

        wallet =
            Number(savedWallet);

    }

}


// ==========================================
// KONTO ERSTELLEN
// ==========================================

function createAccount() {

    const newUsername =
        usernameInput.value.trim();


    // Mindestens 3 Zeichen

    if (newUsername.length < 3) {

        registerError.textContent =
            "Der Benutzername muss mindestens 3 Zeichen haben.";

        return;

    }


    username =
        newUsername;


    wallet =
        START_COINS;


    // Benutzername speichern

    localStorage.setItem(
        "gambaUsername",
        username
    );


    // Wallet speichern

    saveWallet();


    // Fenster schliessen

    registerScreen.classList.add(
        "hidden"
    );


    registerError.textContent = "";


    updateDisplay();

}


// ==========================================
// KONTO ANZEIGEN
// ==========================================

function showAccount() {

    accountUsername.textContent =
        username;


    accountWallet.textContent =
        wallet;


    accountScreen.classList.remove(
        "hidden"
    );

}


// ==========================================
// KONTO SCHLIESSEN
// ==========================================

function closeAccount() {

    accountScreen.classList.add(
        "hidden"
    );

}


// ==========================================
// WALLET SPEICHERN
// ==========================================

function saveWallet() {

    localStorage.setItem(
        "gambaWallet",
        wallet
    );

}


// ==========================================
// ANZEIGE AKTUALISIEREN
// ==========================================

function updateDisplay() {

    walletText.textContent =
        wallet;


    betText.textContent =
        bet;


    accountWallet.textContent =
        wallet;

}


// ==========================================
// GEWINN / VERLUST ANZEIGEN
// ==========================================

function showProfit(value) {

    if (value > 0) {

        profitText.textContent =
            "+" + value;


        lastWinText.textContent =
            "+" + value;

    }

    else {

        profitText.textContent =
            value;


        lastWinText.textContent =
            value;

    }

}


// ==========================================
// EINSATZ ERHÖHEN
// ==========================================

function increaseBet() {

    if (gameRunning === true) {

        return;

    }


    if (bet + 10 <= wallet) {

        bet =
            bet + 10;


        updateDisplay();

    }

}


// ==========================================
// EINSATZ VERRINGERN
// ==========================================

function decreaseBet() {

    if (gameRunning === true) {

        return;

    }


    if (bet > 10) {

        bet =
            bet - 10;


        updateDisplay();

    }

}


// ==========================================
// GLÜCKSRAD STARTEN
// ==========================================

function playWheel() {

    // Rad läuft bereits

    if (gameRunning === true) {

        return;

    }


    // Genug Coins?

    if (wallet < bet) {

        alert(
            "Du hast nicht genügend Coins."
        );

        return;

    }


    gameRunning = true;

    playButton.disabled = true;


    // ======================================
    // ZUFÄLLIGES FELD
    // ======================================

    const randomField =
        Math.floor(
            Math.random() *
            wheelMultipliers.length
        );


    // Multiplikator holen

    const multiplier =
        wheelMultipliers[randomField];


    // ======================================
    // EINSATZ MULTIPLIZIEREN
    // ======================================

    const result =
        bet * multiplier;


    // Beispiel:
    //
    // Einsatz = 50
    //
    // +2x = +100
    // -1x = -50
    // +0.5x = +25


    // ======================================
    // RAD DREHEN
    // ======================================

    const fullSpins =
        1080;


    const fieldRotation =
        randomField * 60;


    rotation =
        rotation +
        fullSpins +
        fieldRotation;


    // ======================================
    // ANIMATION AN
    // ======================================

    if (settings.animation === true) {

        wheel.style.transition =
            "transform 3s cubic-bezier(0.15, 0.65, 0.15, 1)";


        wheel.style.transform =
            "rotate(" +
            rotation +
            "deg)";


        setTimeout(

            function () {

                finishWheel(
                    result
                );

            },

            3000

        );

    }


    // ======================================
    // ANIMATION AUS
    // ======================================

    else {

        wheel.style.transition =
            "none";


        wheel.style.transform =
            "rotate(" +
            rotation +
            "deg)";


        finishWheel(
            result
        );

    }

}


// ==========================================
// GLÜCKSRAD BEENDEN
// ==========================================

function finishWheel(result) {

    // Ergebnis zur Wallet rechnen

    wallet =
        wallet + result;


    // Wallet darf nicht unter 0

    if (wallet < 0) {

        wallet = 0;

    }


    // Ergebnis anzeigen

    showProfit(
        result
    );


    // Wallet speichern

    saveWallet();


    // Anzeige aktualisieren

    updateDisplay();


    // Rad wieder freigeben

    gameRunning = false;

    playButton.disabled = false;

}


// ==========================================
// GLÜCKSRAD ANZEIGEN
// ==========================================

function showWheelGame() {

    wheelGame.classList.remove(
        "hidden"
    );


    diceGame.classList.add(
        "hidden"
    );

}


// ==========================================
// WÜRFELSPIEL ANZEIGEN
// ==========================================

function showDiceGame() {

    wheelGame.classList.add(
        "hidden"
    );


    diceGame.classList.remove(
        "hidden"
    );

}


// ==========================================
// WÜRFELSPIEL
// ==========================================

function rollDice() {

    if (wallet < bet) {

        alert(
            "Du hast nicht genügend Coins."
        );

        return;

    }


    // Zahl 1 - 6

    const number =
        Math.floor(
            Math.random() * 6
        ) + 1;


    // Würfelsymbole

    const symbols = [

        "⚀",

        "⚁",

        "⚂",

        "⚃",

        "⚄",

        "⚅"

    ];


    dice.textContent =
        symbols[number - 1];


    let result;


    // 1 - 3 = verlieren

    if (number <= 3) {

        result =
            -bet;

    }


    // 4 - 6 = gewinnen

    else {

        result =
            bet;

    }


    wallet =
        wallet + result;


    // Nicht negativ

    if (wallet < 0) {

        wallet = 0;

    }


    showProfit(
        result
    );


    saveWallet();


    updateDisplay();

}


// ==========================================
// TAGESBONUS
// ==========================================

function claimDailyBonus() {

    const lastBonus =
        localStorage.getItem(
            "gambaLastBonus"
        );


    const now =
        Date.now();


    // Noch nie abgeholt

    if (lastBonus === null) {

        giveBonus(
            now
        );

        return;

    }


    const timePassed =
        now -
        Number(lastBonus);


    // 24 Stunden vergangen

    if (timePassed >= BONUS_TIME) {

        giveBonus(
            now
        );

    }


    // Noch nicht bereit

    else {

        const remaining =
            BONUS_TIME -
            timePassed;


        const hours =
            Math.floor(
                remaining /
                3600000
            );


        const minutes =
            Math.floor(
                (remaining % 3600000) /
                60000
            );


        alert(
            "Dein nächster Bonus ist in " +
            hours +
            "h " +
            minutes +
            "min verfügbar."
        );

    }

}


// ==========================================
// BONUS GEBEN
// ==========================================

function giveBonus(time) {

    wallet =
        wallet +
        DAILY_BONUS;


    // Zeitpunkt speichern

    localStorage.setItem(
        "gambaLastBonus",
        time
    );


    saveWallet();


    updateDisplay();


    updateBonusButton();


    alert(
        "Tagesbonus erhalten: +100 Coins!"
    );

}


// ==========================================
// BONUS BUTTON AKTUALISIEREN
// ==========================================

function updateBonusButton() {

    const lastBonus =
        localStorage.getItem(
            "gambaLastBonus"
        );


    // Noch nie abgeholt

    if (lastBonus === null) {

        bonusButton.textContent =
            "100 Coins abholen";

        return;

    }


    const timePassed =
        Date.now() -
        Number(lastBonus);


    // Bonus bereit

    if (timePassed >= BONUS_TIME) {

        bonusButton.textContent =
            "100 Coins abholen";

    }


    // Noch nicht bereit

    else {

        bonusButton.textContent =
            "Tagesbonus";

    }

}


// ==========================================
// SETTINGS LADEN
// ==========================================

function loadSettings() {

    const savedSettings =
        localStorage.getItem(
            "gambaSettings"
        );


    if (savedSettings !== null) {

        settings =
            JSON.parse(
                savedSettings
            );

    }


    applySettings();

}


// ==========================================
// SETTINGS ÖFFNEN
// ==========================================

function showSettings() {

    animationSetting.checked =
        settings.animation;


    darkSetting.checked =
        settings.darkMode;


    settingsScreen.classList.remove(
        "hidden"
    );

}


// ==========================================
// SETTINGS SPEICHERN
// ==========================================

function saveSettings() {

    settings.animation =
        animationSetting.checked;


    settings.darkMode =
        darkSetting.checked;


    localStorage.setItem(

        "gambaSettings",

        JSON.stringify(
            settings
        )

    );


    applySettings();


    settingsScreen.classList.add(
        "hidden"
    );

}


// ==========================================
// SETTINGS ANWENDEN
// ==========================================

function applySettings() {

    // DARK MODE

    if (settings.darkMode === true) {

        document.body.classList.remove(
            "light-mode"
        );

    }


    // LIGHT MODE

    else {

        document.body.classList.add(
            "light-mode"
        );

    }

}


// ==========================================
// SETTINGS SCHLIESSEN
// ==========================================

function closeSettings() {

    settingsScreen.classList.add(
        "hidden"
    );

}


// ==========================================
// BUTTONS MIT FUNKTIONEN VERBINDEN
// ==========================================


// KONTO ERSTELLEN

createAccountButton.addEventListener(
    "click",
    createAccount
);


// ENTER BEI BENUTZERNAME

usernameInput.addEventListener(

    "keydown",

    function (event) {

        if (event.key === "Enter") {

            createAccount();

        }

    }

);


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


// GLÜCKSRAD STARTEN

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


// KONTO ÖFFNEN

accountButton.addEventListener(
    "click",
    showAccount
);


// KONTO SCHLIESSEN

closeAccountButton.addEventListener(
    "click",
    closeAccount
);


// SETTINGS ÖFFNEN

settingsButton.addEventListener(
    "click",
    showSettings
);


// SETTINGS SPEICHERN

saveSettingsButton.addEventListener(
    "click",
    saveSettings
);


// SETTINGS ABBRECHEN

closeSettingsButton.addEventListener(
    "click",
    closeSettings
);


// TAGESBONUS

bonusButton.addEventListener(
    "click",
    claimDailyBonus
);


// ==========================================
// GAMBA STARTEN
// ==========================================

startWebsite();