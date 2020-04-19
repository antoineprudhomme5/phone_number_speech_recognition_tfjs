let recognizer;

const digitWordToDigit = new Map([
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);
const digitWords = Array.from(digitWordToDigit.keys());

const phoneNumberLength = 10;
const phoneNumberEl = document.getElementById("phoneNumber");
let digits = [0];

const startBtnEl = document.getElementById("start");
const stopBtnEl = document.getElementById("stop");
const clearBtnEl = document.getElementById("clear");
stopBtnEl.disabled = true;

function clearPhoneNumber() {
  digits = [0];
  refreshPhoneNumber();
}

function refreshPhoneNumber() {
  phoneNumberEl.innerHTML = '';
  for (let i = 0; i < phoneNumberLength; i++) {
    const digitEl = document.createElement('div');
    digitEl.className = "digit";
    digitEl.textContent = digits[i] === undefined ? '\xa0' : digits[i];
    phoneNumberEl.appendChild(digitEl);
  }
}

function handleDigitPredicted(digitWords) {
  if (digits.length < phoneNumberLength) {
    digits.push(digitWordToDigit.get(digitWords));
    refreshPhoneNumber();
  }
}

function stopListening() {
  stopBtnEl.disabled = true;
  startBtnEl.disabled = false;
  recognizer.stopListening();
}

function startListening() {
  stopBtnEl.disabled = false;
  startBtnEl.disabled = true;

  // Array of words that the recognizer is trained to recognize.
  const words = recognizer.wordLabels();

  recognizer.listen(
    ({ scores }) => {
      // Turn scores into a list of (score,word) pairs.
      // But keep only digits
      scores = Array.from(scores)
        .map((s, i) => ({ score: s, word: words[i] }))
        .filter((s, i) => digitWords.includes(words[i]));

      // Find the most probable word.
      let maxScoreIndex = 0;
      for (let i = 1; i < scores.length; i++) {
        if (scores[maxScoreIndex].score < scores[i].score) {
          maxScoreIndex = i;
        }
      }

      handleDigitPredicted(scores[maxScoreIndex].word);
    },
    { probabilityThreshold: 0.75, overlapFactor: 0.1 }
  );
}

async function app() {
  recognizer = speechCommands.create("BROWSER_FFT");
  await recognizer.ensureModelLoaded();
  refreshPhoneNumber();
  startBtnEl.addEventListener('click', startListening);
  stopBtnEl.addEventListener('click', stopListening);
  clearBtnEl.addEventListener('click', clearPhoneNumber);
}

app();
