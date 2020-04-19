let recognizer;

const numberWordToNumber = new Map([
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

const numberWords = Array.from(numberWordToNumber.keys());

function handleNumberPredicted(numberWord) {
  console.log(numberWord, numberWordToNumber.get(numberWord));
}

function predictNumber() {
  // Array of words that the recognizer is trained to recognize.
  const words = recognizer.wordLabels();

  recognizer.listen(
    ({ scores }) => {
      // Turn scores into a list of (score,word) pairs.
      // But keep only numbers
      scores = Array.from(scores)
        .map((s, i) => ({ score: s, word: words[i] }))
        .filter((s, i) => numberWords.includes(words[i]));

      // Find the most probable word.
      let maxScoreIndex = 0;
      for (let i = 1; i < scores.length; i++) {
        if (scores[maxScoreIndex].score < scores[i].score) {
          maxScoreIndex = i;
        }
      }

      handleNumberPredicted(scores[maxScoreIndex].word);
    },
    { probabilityThreshold: 0.75, overlapFactor: 0.1 }
  );
}

async function app() {
  recognizer = speechCommands.create("BROWSER_FFT");
  await recognizer.ensureModelLoaded();
  predictNumber();
}

app();
