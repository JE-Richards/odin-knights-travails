class Queue {
  #queue;
  #minSize;
  #size;
  #head;
  #tail;
  #count;

  constructor(initialSize = 16) {
    // using fixed size array to implement circular logic for queue
    this.#queue = new Array(initialSize);
    this.#minSize = initialSize;
    this.#size = initialSize;
    this.#head = 0;
    this.#tail = 0;
    this.#count = 0;
  }

  get isFull() {
    return this.#count === this.#size;
  }

  get isEmpty() {
    return this.#count === 0;
  }

  get length() {
    return this.#count;
  }

  get peek() {
    if (this.isEmpty) {
      return 'Queue is currently empty';
    }

    return this.#queue[this.#head];
  }

  toString(joiningString) {
    if (this.isEmpty) {
      return 'Queue is currently empty';
    }

    const elements = [];
    let index = this.#head;

    for (let i = 0; i < this.#count; i += 1) {
      if (this.#queue[index] !== undefined) {
        elements.push(this.#queue[index]);
      }
      index = (index + 1) % this.#size;
    }

    return elements.join(joiningString);
  }

  // If the queue is full (or too empty) we need to resize the queue
  #resize(option) {
    let newSize;

    if (option === 'grow') {
      newSize = this.#size * 2;
    }
    if (option === 'shrink') {
      newSize = this.#size / 2;
    }

    const newQueue = new Array(newSize);

    // copy elements from old queue to new queue whilst maintaining position to maintain implementation of circular logic
    for (let i = 0; i < this.#count; i += 1) {
      newQueue[i] = this.#queue[(this.#head + i) % this.#size];
    }

    this.#queue = newQueue;
    this.#size = newSize;
    this.#head = 0;
    this.#tail = this.#count;
  }

  enqueue(element) {
    // if the queue is currently full, double queue size before adding more elements
    if (this.isFull) {
      this.#resize('grow');
    }

    // insert new element at tail, then shift the tail and increment count
    this.#queue[this.#tail] = element;
    this.#tail = (this.#tail + 1) % this.#size;
    this.#count += 1;
  }

  dequeue() {
    // dequeue the head, move the head up 1, and decriment count
    const element = this.#queue[this.#head];
    this.#queue[this.#head] = undefined; // clear the queue slot
    this.#head = (this.#head + 1) % this.#size;
    this.#count -= 1;

    // if less than a quarter of the queue is populated, halve the queue size
    if (this.#size > this.#minSize && this.#count <= this.#size / 4) {
      this.#resize('shrink');
    }

    return element;
  }
}

export { Queue };
