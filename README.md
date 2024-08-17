# Knights Travails: An Intermediate JavaScript Project

## Introduction

This is a mini project forming part of the [JavaScript course](https://www.theodinproject.com/lessons/javascript-knights-travails) hosted by [The Odin Project](https://www.theodinproject.com/). It provides an opportunity for students to practice implementing some recently covered data structures and algorithms in the context of a more practical example.

The project is to implement a smaller variation on the classic [Knight's Tour](https://en.wikipedia.org/wiki/Knight%27s_tour) problem. In the classical knight's tour, the goal is to get the knight to land on every tile of the chessboard exactly once. In this version, the aim is to find the shortest path the knight needs to take to move between any two given tiles.

## My Approach

To solve the problem, I've looked to construct a map to represent the standard 8x8 chess board. Each key-value pair in the map represents a tile on the board where the key is the tile location, and the value is a node representing the tile in a tree.

Rather than having the nodes connect to one another based on the adjascent tiles on the board, they are connected based on how the knight piece is able to move (an L patten). As each node is connected based on how the knight moves, finding the shortest path between two given tiles is a matter of performing a breadth-first (level-order) search. Starting from the initial tile, search each node in level-order until the target tile is encountered.

## Challenges During Implementation

### The Board Map

We can represent the gameboard as a collection of rows and columns that range between the values of 0 and 7 (inclusive). With this, any tile can be represented as [row, column]. My initial plan was to use this as the key for the tile in the board `Map`. But this proved challenging to implement.  
In JavaScript, when using a key to access a value in a `Map` the key needs to reference the same _instance_ of the key as is in the `Map`. So if you use an object (including arrays) as a key in a map, then you need to reference the same _instance of the object_ to access the corresponding value in the `Map`. Illustrated via an example:

```javascript
const map = new Map();
let x = [0];
map.set(x, 'value');

map.get([0]); // This returns undefined
map.get(x); // This returns 'value'

x === [0]; // false
```

What this means is that if I were to use arrays for the keys in the board map, I'd need to store those arrays somewhere to reference them later. All this does is lead to more memory usage than is needed.

To get around this, I pivoted from using arrays as the index to simply using a string in the form `'i,j'`. As strings are a primitive value, JavaScript will compare the string values directly. So

```javascript
const map = new Map();
let x = '0';
map.set(x, 'value');

map.get('0'); // This returns 'value'
map.get(x); // This also returns 'value'
```

And by using a string in this format, I can extract the `i` and `j` values when needed via

```javascript
let [i, j] = 'i,j',split(',');
```

### How Should Nodes Connect to Other Nodes?

A custom class is used to create each instance of a `Node` for the board. The class constructor creates an object that can store 2 values (`tile` and `adjacentNodes`).

Whereas I knew I wanted `tile` to store a copy of the tile key for that node, I wasn't sure whether `adjacentNodes` should store a list of node objects or a list of keys (from the board map) to the node objects. Both had their pro's and cons:

**Option 1: `adjacentNodes` as a list of `Node` objects**

_Pros:_

- Direct Access - From a given node, you're able to directly access a connected adjacent node without needing to perform an additional lookup.
- Simpler Code - When traversing the graph, there's no need to perform additional lookups to find the next node as it can be directly accessed from the current node.

_Cons:_

- Cyclical References - If I'm not careful, this approach could lead to ciclycal references in memory.
- Additional Memory Overhead - Storing a reference to another node directly could increase memory usage slightly. It's likely negligible for a problem of this size, but could be an issue if the problem was extended (e.g. a larger board than 8x8).

**Option 2: `adjacentNodes` as a list of `tile` keys**

_Pros:_

- Lower Memory Usage - Storing a key insted of a full reference to the node object saves some memory.
- Utilises the Map More - This approach would leverage the efficient lookup capabilities of the board `Map` and simplify each `Node`.

_Cons:_

- Additional Lookups and Increased Code Complexity - Whenever there's a need to traverse the graph, additional lookup steps will be required to search for the next node in a sequence. Whilst searching for a key in the `Map` is a $O(1)$ operation, it does add some overhead to the traversal process.  
  Furthermore, any traversal implementation would require additional code to perform the lookup operations which adds additional length and complexoty the traversal code.

Given the scope of this problem involves using an 8x8 board (so 64 tiles/`Nodes` in total), I opted for option 1 - storing a reference to each connected node in the `adjacentNodes` list in order to improve the traversal efficiency and simplify the code.

## Futue Improvements

This project could easily be expanded to accommodate different sized boards and even different chess pieces. The only elements that would need to be modified are the `constructor` and the `#constructBoard` method.  
The `constructor` should be modified to accept inputs that dictate the size of the bord and which chess piece will be used.  
`#constructBoard` would need a more detailed extension that

- Modifies the possible movies based on the chess piece selected
- Modifies the size of the board and what the bounds for the board should be

Additionally, `knightMoves` should be modified to remove reference to `knight` as it should function the same for any chosen chess piece.
