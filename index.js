import { Gameboard } from './knight-travails.js';

const board = new Gameboard();

console.log(board.knightMoves([0, 3], [6, 5]));

window.board = board;
