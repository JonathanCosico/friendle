const game = require('./game');
const getResult = game.getResult;

const tests = [
  ['apple', 'apply', 'GGGGX'],
  ['abcde', 'eabcd', 'YYYYY'],
  ['apple', 'ppppp', 'XGGXX'],
  ['rockstar', 'roftware', 'GGXYXYYX'],
  ['gigi', 'iiii', 'XGXG'],
  ['faker', 'apple', 'YXXXY'],
  ['rockstar', 'rockbart', 'GGGGXYYY'],
];

let failed = false;
for (const [word, guess, expected] of tests) {
  const {correct, result} = getResult(word, guess);
  const ok = result === expected ? 'PASS' : 'FAIL';
  console.log(`${ok}: ${word} vs ${guess} -> ${result} (expected ${expected})`);
  if (result !== expected) failed = true;
}

if (failed) process.exit(1);
