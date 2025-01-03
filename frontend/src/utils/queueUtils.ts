export function enqueue<T>(key: string, item: T): void {
  const queue = getQueue<T>(key); // Retrieve the current queue with the correct type
  queue.push(item); // Add the item to the queue
  setQueue(key, queue); // Save the updated queue to sessionStorage
}

export function dequeue<T>(key: string): T | null {
  const queue = getQueue<T>(key); // Retrieve the current queue with the correct type
  if (queue.length === 0) {
    console.log("Queue is empty.");
    return null; // Return null if the queue is empty
  }
  const item = queue.shift() as T; // Remove the first item from the queue
  setQueue(key, queue); // Save the updated queue to sessionStorage
  return item; // Return the removed item
}

export function peek<T>(key: string): T | null {
  const queue = getQueue<T>(key); // Retrieve the current queue with the correct type
  return queue.length > 0 ? queue[0] : null; // Return the first item or null if the queue is empty
}


function getQueue<T>(key: string): T[] {
  const queue = sessionStorage.getItem(key);
  return queue ? JSON.parse(queue) : []; // If no queue exists, return an empty array
}

function setQueue<T>(key: string, queue: T[]): void {
  sessionStorage.setItem(key, JSON.stringify(queue));
}