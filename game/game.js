// const {emojiMap} = require('./emojimap');
const emojis = require('./emojis.json');
const emojiMap = new Map(Object.entries(emojis));

function getResult(word, guess) {
  // evaluate the guess and return the emoji-formatted result
  const result = evaluateGuess(word, guess);

  return {correct: result === 'G'.repeat(word.length), result: result};
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
    }
  }

  return result.join('');
}

function getInitialBoard(word) {
  board = '';
  for (let i = 0; i < word.length; i++) {
    if (!word[i].match(/^[a-z]$/i)) {
      board += word[i];
    } else {
      board += '⬜️';
    }
  }
  return board + `  ${word.length} letter(s)`;
}


function printResult(guess, result) {
  resultBoard = "";
  for (let i = 0; i < guess.length; i++) {
    const ch = guess[i];
    resultBoard += getEmoji(ch, result[i]);
  }
  return resultBoard;
}

// build the string representation of the keyboard with used letters colored according to their status
function printBoard(usedLetters) {
  const KEYBOARD_LAYOUT = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  layout = "";
  for (row=0; row<KEYBOARD_LAYOUT.length; row++) {
    for (ch of KEYBOARD_LAYOUT[row]) {
      const status = usedLetters.get(ch);
      layout += getEmoji(ch, status);
    }
    layout += '\n' + " ".repeat(4*row+4);
  }
  return layout;
}

// given emoji and status, return the corresponding emoji from the map
// if given a non-alphabet character, return the letter plainly
function getEmoji(ch, status) {
  if (ch.match(/^[a-z]$/i) === null) return ch;

  if (status === 'G') return emojiMap.get(`${ch}_G`);
  else if (status === 'Y') return emojiMap.get(`${ch}_Y`);
  else if (status === 'X') return emojiMap.get(`${ch}_X`);
  else return emojiMap.get(`${ch}`);
}

module.exports = { getResult, getInitialBoard, printBoard, printResult };
