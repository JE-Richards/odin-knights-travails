import { Queue } from './queue.js';

class Node {
  constructor(data) {
    this.tile = data;
    this.adjacentNodes = [];
  }
}

class Gameboard {
  #board;

  constructor() {
    this.#board = this.#constructBoard();
  }

  // method to create consistent a key for use in the gameboard map
  #createKey(i, j) {
    return `${i},${j}`;
  }

  // construct a map to represent an 8x8 chessboard where each tile of the board is only connected to tiles a knight could move to
  #constructBoard() {
    // create an empty board via Map
    const board = new Map();
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        let key = this.#createKey(i, j);
        board.set(key, new Node(key));
      }
    }

    // Adding the possible moves as adjacentNodes to each node
    const keys = board.keys();

    for (let key of keys) {
      // get the i, j values from the key string in Map
      const [i, j] = key.split(',').map(Number);

      // all possible moves based on how a knight functions in chess
      let moves = [
        [i + 2, j + 1],
        [i + 2, j - 1],
        [i - 2, j + 1],
        [i - 2, j - 1],
        [i + 1, j + 2],
        [i + 1, j - 2],
        [i - 1, j + 2],
        [i - 1, j - 2],
      ];

      // for every new i, j combination, check the move would result in the knight remaining in the board, if yes add to adjacent nodes
      for (let [newI, newJ] of moves) {
        if (newI >= 0 && newJ >= 0 && newI <= 7 && newJ <= 7) {
          let currentNode = board.get(key);
          let targetNode = board.get(this.#createKey(newI, newJ));

          if (currentNode && targetNode) {
            currentNode.adjacentNodes.push(targetNode);
          }
        }
      }
    }
    return board;
  }

  // Use breadth-first search to find the shortest path
  knightMoves(startPosition, endPosition) {
    // Functions to validate the input arrays (must be valid tiles on the board)
    function isValidArray(arr) {
      return (
        Array.isArray(arr) &&
        arr.length === 2 &&
        arr.every((num) => Number.isInteger && num >= 0 && num <= 7)
      );
    }

    // if either input is invalid, throw error
    if (!isValidArray(startPosition) || !isValidArray(endPosition)) {
      throw new Error(
        'Both inputs must be an array of the form [i, j] where i and j are integers ranging from 0 to 7 (inclusive)'
      );
    }

    const startKey = this.#createKey(startPosition[0], startPosition[1]);
    const endKey = this.#createKey(endPosition[0], endPosition[1]);
    const startingNode = this.#board.get(startKey);

    // If start = end, no moves to be made
    if (startKey === endKey) {
      return console.log(
        `No moves needed! The knight is already at ${JSON.stringify(
          startPosition
        )}`
      );
    }

    // Use BFS (level-order) to find shortest path if moves needed
    // Queue size of 64 because the board is 64 tiles meaning the maximum number of moves will be < 64 since we only visit a tile once
    const queue = new Queue(64);
    let parentMap = new Map();
    let visitedTiles = new Set();

    // set the starting node to be the first instance in the parent-child chain
    parentMap.set(startKey, null);
    visitedTiles.add(startKey);

    // Start the bfs queue by appending nodes adjacent to starting nodes
    startingNode.adjacentNodes.forEach((node) => {
      queue.enqueue(node);
      visitedTiles.add(node.tile);
      parentMap.set(node.tile, startKey);
    });

    while (!queue.isEmpty) {
      let currentNode = queue.dequeue();

      // break as soon as we reach the target node
      if (currentNode.tile === endKey) {
        break;
      }

      currentNode.adjacentNodes.forEach((node) => {
        // avoid revisiting nodes
        if (visitedTiles.has(node.tile)) {
          return;
        }
        queue.enqueue(node);
        visitedTiles.add(node.tile);
        parentMap.set(node.tile, currentNode.tile);
      });
    }

    // Once the search is over, follow the parentMap in reverse to construct the shortest path
    let shortestPath = [];
    let currentKey = endKey;
    while (currentKey !== null) {
      // convert the currentKey string to an array
      // Note we could leave it as a string, but converting it to an array would allow us to use it elsewhere easier (if needed)
      shortestPath.unshift(currentKey.split(',').map(Number));
      currentKey = parentMap.get(currentKey);
    }

    console.log(
      `The knight made it in ${shortestPath.length - 1} moves! Here's its path:`
    );
    shortestPath.forEach((element) => console.log(JSON.stringify(element)));
  }
}

export { Gameboard };
