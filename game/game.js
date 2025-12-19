function getResult(word, guess) {
  // evaluate the guess and return the emoji-formatted result
  const { result, wrongLetters } = evaluateGuess(word, guess);

  return {correct: result === 'G'.repeat(word.length), result: formatResult(result), wrongLetters: wrongLetters};
}

function getInitialBoard(word) {
  // Return an array of strings representing the initial state of the board
  // for the given word, with each letter represented by a blank square.
  const initialBoard = Array(word.length).fill('⬜️');
  return `${initialBoard.join('')}  ${word.length} letter(s)`;
}
// Evaluate a guess against the target word and return a string of the same
// length containing letters: 'G' (correct position), 'Y' (wrong position but
// present elsewhere), or 'X' (not present).
function evaluateGuess(word, guess) {
  if (typeof word !== 'string' || typeof guess !== 'string') return '';
  const w = word.toLowerCase();
  const g = guess.toLowerCase();
  if (w.length !== g.length) throw new Error('word and guess must be same length');

  const result = Array(w.length).fill('X');
  const remaining = {};
  const wrongLetters = Array();

  // First pass: mark greens and count remaining letters in target
  for (let i = 0; i < w.length; i++) {
    if (g[i] === w[i]) {
      result[i] = 'G';
    } else {
      remaining[w[i]] = (remaining[w[i]] || 0) + 1;
    }
  }

  // Second pass: mark yellows where applicable
  for (let i = 0; i < w.length; i++) {
    if (result[i] === 'G') continue;
    const ch = g[i];
    if (remaining[ch] > 0) {
      result[i] = 'Y';
      remaining[ch]--;
    } else {
      result[i] = 'X';
      wrongLetters.push(ch);
    }
  }

  return { result: result.join(''), wrongLetters: wrongLetters.join('') };
}

// Example usages (uncomment to run as a quick check):
// console.log(evaluateGuess('apple', 'apply')); // G G G G X -> 'GGGGX'
// console.log(evaluateGuess('crate', 'trace')); // Y G G G G -> 'YGGGG'

function formatResult(result) {
  // If result is a Wordle-style string like 'GYXXY', map to emoji squares.
  if (typeof result === 'string') {
    const map = { X: '⬛️', G: '🟩', Y: '🟨' };
    return result.split('').map((ch) => map[ch] || ch).join('');
  }
}

module.exports = { getResult, getInitialBoard };

