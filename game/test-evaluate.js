const game = require('./game');
const getResult = game.getResult;

const tests = [
  ['apple', 'apply', '🟩🟩🟩🟩⬛️'],
  ['abcde', 'eabcd', '🟨🟨🟨🟨🟨'],
  ['apple', 'ppppp', '⬛️🟩🟩⬛️⬛️'],
  ['rockstar', 'roftware', '🟩🟩⬛️🟨⬛️🟨🟨⬛️'],
  ['gigi', 'iiii', '⬛️🟩⬛️🟩'],
  ['faker', 'apple', '🟨⬛️⬛️⬛️🟨'],
  ['rockstar', 'rockbart', '🟩🟩🟩🟩⬛️🟨🟨🟨'],
];

let failed = false;
for (const [word, guess, expected] of tests) {
  const {correct, result} = getResult(word, guess);
  const ok = result === expected ? 'PASS' : 'FAIL';
  console.log(`${ok}: ${word} vs ${guess} -> ${result} (expected ${expected})`);
  if (result !== expected) failed = true;
}

if (failed) process.exit(1);
