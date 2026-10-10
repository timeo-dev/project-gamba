
/* ==========================================
   GAMBA - JAVASCRIPT
   Spielsimulation mit virtuellen Coins
========================================== */

// GRUNDEINSTELLUNGEN

const START_COINS = 1000;
const DAILY_BONUS = 100;
const BONUS_TIME = 24 * 60 * 60 * 1000;

// SPIELVARIABLEN

let username = "";
let wallet = START_COINS;
let bet = 10;
let rotation = 0;
let gameRunning = false;

// NEU: Gesamter Gewinn/Verlust der Sitzung
let totalProfit = 0;

// SETTINGS

let settings = {
    animation: true,
    darkMode: true
};

// GLÜCKSRAD MULTIPLIKATOREN
// 3 positive und 3 negative Felder = 50/50

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

const walletText = document.getElementById("wallet");
const betText = document.getElementById("bet");
const profitText = document.getElementById("profit");
const lastWinText = document.getElementById("lastWin");

const wheel = document.getElementById("wheel");

const plusButton = document.getElementById("plusButton");
const minusButton = document.getElementById("minusButton");
const playButton = document.getElementById("playButton");

const wheelGameButton = document.getElementById("wheelGameButton");
const diceGameButton = document.getElementById("diceGameButton");

const wheelGame = document.getElementById("wheelGame");
const diceGame = document.getElementById("diceGame");

const dice = document.getElementById("dice");
const diceButton = document.getElementById("diceButton");

// KONTO

const registerScreen = document.getElementById("registerScreen");
const usernameInput = document.getElementById("usernameInput");
const createAccountButton = document.getElementById("createAccountButton");
const registerError = document.getElementById("registerError");

const accountButton = document.getElementById("accountButton");
const accountScreen = document.getElementById("accountScreen");
const accountUsername = document.getElementById("accountUsername");
const accountWallet = document.getElementById("accountWallet");
const closeAccountButton = document.getElementById("closeAccountButton");

// SETTINGS

const settingsButton = document.getElementById("settingsButton");
const settingsScreen = document.getElementById("settingsScreen");
const animationSetting = document.getElementById("animationSetting");
const darkSetting = document.getElementById("darkSetting");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const closeSettingsButton = document.getElementById("closeSettingsButton");

// TAGESBONUS

const bonusButton = document.getElementById("bonusButton");

// ==========================================
// WEBSEITE STARTEN
// ==========================================

function startWebsite() {
    loadAccount();
    loadSettings();
    updateDisplay();
    updateBonusButton();

    // Gesamtergebnis beginnt bei 0
    totalProfit = 0;
    profitText.textContent = "0";
}

// ==========================================
// KONTO LADEN
// ==========================================

function loadAccount() {
    const savedUsername = localStorage.getItem("gambaUsername");
    const savedWallet = localStorage.getItem("gambaWallet");

    if (savedUsername === null) {
        registerScreen.classList.remove("hidden");
        return;
    }

    username = savedUsername;

    if (savedWallet !== null) {
        const amount = Number(savedWallet);

        if (Number.isFinite(amount) && amount >= 0) {
            wallet = amount;
        }
    }
}

// ==========================================
// KONTO ERSTELLEN
// ==========================================

function createAccount() {
    const newUsername = usernameInput.value.trim();

    if (newUsername.length < 3) {
        registerError.textContent =
            "Der Benutzername muss mindestens 3 Zeichen haben.";
        return;
    }

    username = newUsername;
    wallet = START_COINS;

    localStorage.setItem("gambaUsername", username);
    saveWallet();

    registerScreen.classList.add("hidden");
    registerError.textContent = "";

    updateDisplay();
}

// ==========================================
// KONTO ANZEIGEN
// ==========================================

function showAccount() {
    accountUsername.textContent = username;
    accountWallet.textContent = wallet;

    accountScreen.classList.remove("hidden");
}

function closeAccount() {
    accountScreen.classList.add("hidden");
}

// ==========================================
// WALLET SPEICHERN
// ==========================================

function saveWallet() {
    localStorage.setItem("gambaWallet", wallet);
}

// ==========================================
// ANZEIGE AKTUALISIEREN
// ==========================================

function updateDisplay() {
    walletText.textContent = wallet;
    betText.textContent = bet;
    accountWallet.textContent = wallet;
}

// ==========================================
// GEWINN / VERLUST ANZEIGEN
// ==========================================

function showProfit(value) {

    // NEU: Alle Gewinne und Verluste zusammenrechnen
    totalProfit += value;

    // Gesamter Gewinn/Verlust
    if (totalProfit > 0) {
        profitText.textContent = "+" + totalProfit;
    } else {
        profitText.textContent = totalProfit;
    }

    // Nur das Ergebnis der letzten Runde
    if (value > 0) {
        lastWinText.textContent = "+" + value;
    } else {
        lastWinText.textContent = value;
    }
}

// ==========================================
// EINSATZ ERHÖHEN
// ==========================================

function increaseBet() {
    if (gameRunning) {
        return;
    }

    if (bet + 10 <= wallet) {
        bet += 10;
        updateDisplay();
    }
}

// ==========================================
// EINSATZ VERRINGERN
// ==========================================

function decreaseBet() {
    if (gameRunning) {
        return;
    }

    if (bet > 10) {
        bet -= 10;
        updateDisplay();
    }
}

// ==========================================
// GLÜCKSRAD STARTEN
// ==========================================

function playWheel() {

    if (gameRunning) {
        return;
    }

    if (wallet < bet) {
        alert("Du hast nicht genügend Coins.");
        return;
    }

    gameRunning = true;
    playButton.disabled = true;
    diceButton.disabled = true;

    // Zufälliges Feld von 0 bis 5
    const randomField = Math.floor(
        Math.random() * wheelMultipliers.length
    );

    // Multiplikator bestimmen
    const multiplier = wheelMultipliers[randomField];

    // Ergebnis berechnen
    const result = bet * multiplier;

    // ======================================
    // KORRIGIERTE GLÜCKSRAD-DREHUNG
    // ======================================

    const fieldAngle = 360 / wheelMultipliers.length;

    // Mitte des ausgewählten Feldes
    const targetAngle =
        (360 - (randomField + 0.5) * fieldAngle + 360) % 360;

    // Aktuelle Position
    const currentAngle = ((rotation % 360) + 360) % 360;

    // Korrektur zur Zielposition
    const correction =
        (targetAngle - currentAngle + 360) % 360;

    // Drei volle Umdrehungen
    const fullSpins = 1080;

    rotation += fullSpins + correction;

    // ======================================
    // MIT ANIMATION
    // ======================================

    if (settings.animation) {

        wheel.style.transition =
            "transform 3s cubic-bezier(0.15, 0.65, 0.15, 1)";

        wheel.style.transform =
            "rotate(" + rotation + "deg)";

        setTimeout(function () {
            finishWheel(result);
        }, 3000);

    } else {

        wheel.style.transition = "none";

        wheel.style.transform =
            "rotate(" + rotation + "deg)";

        finishWheel(result);
    }
}

// ==========================================
// GLÜCKSRAD BEENDEN
// ==========================================

function finishWheel(result) {

    // Ergebnis zur Wallet addieren
    const oldWallet = wallet;

    wallet += result;

    // Wallet darf nicht negativ werden
    if (wallet < 0) {
        wallet = 0;
    }

    // Tatsächliche Veränderung berücksichtigen
    const actualResult = wallet - oldWallet;

    // NEU: Gesamtergebnis aktualisieren
    showProfit(actualResult);

    saveWallet();
    updateDisplay();

    gameRunning = false;
    playButton.disabled = false;
    diceButton.disabled = false;
}

// ==========================================
// SPIELAUSWAHL
// ==========================================

function showWheelGame() {
    wheelGame.classList.remove("hidden");
    diceGame.classList.add("hidden");
}

function showDiceGame() {
    diceGame.classList.remove("hidden");
    wheelGame.classList.add("hidden");
}

// ==========================================
// WÜRFELSPIEL
// ==========================================

function rollDice() {

    if (gameRunning) {
        return;
    }

    if (wallet < bet) {
        alert("Du hast nicht genügend Coins.");
        return;
    }

    const number = Math.floor(Math.random() * 6) + 1;

    const symbols = [
        "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"
    ];

    dice.textContent = symbols[number - 1];

    // 1 bis 3 = Verlust
    // 4 bis 6 = Gewinn
    const result = number <= 3 ? -bet : bet;

    wallet += result;

    if (wallet < 0) {
        wallet = 0;
    }

    // NEU: Würfel-Ergebnis zur Gesamtsumme rechnen
    showProfit(result);

    saveWallet();
    updateDisplay();
}

// ==========================================
// TAGESBONUS
// ==========================================

function claimDailyBonus() {

    if (!username) {
        return;
    }

    const lastBonus = localStorage.getItem("gambaLastBonus");
    const now = Date.now();

    if (lastBonus === null) {
        giveBonus(now);
        return;
    }

    const timePassed = now - Number(lastBonus);

    if (timePassed >= BONUS_TIME) {
        giveBonus(now);
    } else {

        const remaining = BONUS_TIME - timePassed;

        const hours = Math.floor(remaining / 3600000);

        const minutes = Math.ceil(
            (remaining % 3600000) / 60000
        );

        alert(
            "Dein nächster Bonus ist in " +
            hours + "h " + minutes + "min verfügbar."
        );
    }
}

// ==========================================
// BONUS GEBEN
// ==========================================

function giveBonus(time) {

    wallet += DAILY_BONUS;

    localStorage.setItem("gambaLastBonus", time);

    saveWallet();
    updateDisplay();
    updateBonusButton();

    alert("Tagesbonus erhalten: +100 Coins!");
}

// ==========================================
// BONUS BUTTON AKTUALISIEREN
// ==========================================

function updateBonusButton() {

    const lastBonus = localStorage.getItem("gambaLastBonus");

    if (lastBonus === null) {
        bonusButton.textContent = "100 Coins abholen";
        return;
    }

    const timePassed = Date.now() - Number(lastBonus);

    if (timePassed >= BONUS_TIME) {
        bonusButton.textContent = "100 Coins abholen";
    } else {
        bonusButton.textContent = "Tagesbonus";
    }
}

// ==========================================
// SETTINGS LADEN
// ==========================================

function loadSettings() {

    const savedSettings = localStorage.getItem("gambaSettings");

    if (savedSettings !== null) {
        try {
            const parsed = JSON.parse(savedSettings);

            settings = {
                animation: parsed.animation !== false,
                darkMode: parsed.darkMode !== false
            };
        } catch (error) {
            console.warn("Settings konnten nicht geladen werden.");
        }
    }

    applySettings();
}

// ==========================================
// SETTINGS ÖFFNEN
// ==========================================

function showSettings() {

    animationSetting.checked = settings.animation;
    darkSetting.checked = settings.darkMode;

    settingsScreen.classList.remove("hidden");
}

// ==========================================
// SETTINGS SPEICHERN
// ==========================================

function saveSettings() {

    settings.animation = animationSetting.checked;
    settings.darkMode = darkSetting.checked;

    localStorage.setItem(
        "gambaSettings",
        JSON.stringify(settings)
    );

    applySettings();

    settingsScreen.classList.add("hidden");
}

// ==========================================
// SETTINGS ANWENDEN
// ==========================================

function applySettings() {

    if (settings.darkMode) {
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
    }
}

// ==========================================
// SETTINGS SCHLIESSEN
// ==========================================

function closeSettings() {
    settingsScreen.classList.add("hidden");
}

// ==========================================
// BUTTONS VERBINDEN
// ==========================================

createAccountButton.addEventListener("click", createAccount);

usernameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        createAccount();
    }
});

plusButton.addEventListener("click", increaseBet);
minusButton.addEventListener("click", decreaseBet);

playButton.addEventListener("click", playWheel);

wheelGameButton.addEventListener("click", showWheelGame);
diceGameButton.addEventListener("click", showDiceGame);

diceButton.addEventListener("click", rollDice);

accountButton.addEventListener("click", showAccount);
closeAccountButton.addEventListener("click", closeAccount);

settingsButton.addEventListener("click", showSettings);
saveSettingsButton.addEventListener("click", saveSettings);
closeSettingsButton.addEventListener("click", closeSettings);

bonusButton.addEventListener("click", claimDailyBonus);

// ==========================================
// WEBSEITE STARTEN
// ==========================================

startWebsite();
