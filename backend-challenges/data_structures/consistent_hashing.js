// ------------------------------------------------------------
// Consistent Hashing Example
//
// Goal:
// 1. Distribute 1000 keys across 5 servers
// 2. Add a 6th server
// 3. Count how many keys move
//
// For simplicity:
// - Ring space = 0 to 9999
// - Keys = 0 to 999
// - Server positions are fixed manually
// ------------------------------------------------------------

// Total number of keys
const TOTAL_KEYS = 1000;

// ------------------------------------------------------------
// STEP 1: Initial 5 servers placed on the ring
// ------------------------------------------------------------
let servers = [
  { server: "s0", pos: 1000 },
  { server: "s1", pos: 2500 },
  { server: "s2", pos: 4000 },
  { server: "s3", pos: 6500 },
  { server: "s4", pos: 8500 }
];

// Make sure servers are sorted by ring position
servers.sort((a, b) => a.pos - b.pos);

// ------------------------------------------------------------
// STEP 2: Simple hash function
//
// Converts a key into a position on the ring.
//
// Example:
// key = 17 -> some number between 0 and 9999
// ------------------------------------------------------------
function hashKey(key) {
  return (key * 137) % 10000;
}

// ------------------------------------------------------------
// STEP 3: Find which server owns a key
//
// Rule:
// - Hash the key
// - Move clockwise on the ring
// - First server whose position is >= key position wins
// - If none found, wrap around to first server
// ------------------------------------------------------------
function findServer(key, ring) {
  const keyPos = hashKey(key);

  for (let i = 0; i < ring.length; i++) {
    if (ring[i].pos >= keyPos) {
      return ring[i].server;
    }
  }

  // Wrap-around case
  return ring[0].server;
}

// ------------------------------------------------------------
// STEP 4: Assign all keys
//
// Returns a Map:
// key -> server
// ------------------------------------------------------------
function assignKeys(totalKeys, ring) {
  const assignment = new Map();

  for (let key = 0; key < totalKeys; key++) {
    const owner = findServer(key, ring);
    assignment.set(key, owner);
  }

  return assignment;
}

// ------------------------------------------------------------
// STEP 5: Count how many keys moved
//
// Compare old assignment vs new assignment
// ------------------------------------------------------------
function countMovedKeys(before, after) {
  let moved = 0;

  for (let key = 0; key < TOTAL_KEYS; key++) {
    if (before.get(key) !== after.get(key)) {
      moved++;
    }
  }

  return moved;
}

// ------------------------------------------------------------
// STEP 6: Assign keys with initial 5 servers
// ------------------------------------------------------------
const before = assignKeys(TOTAL_KEYS, servers);

// ------------------------------------------------------------
// STEP 7: Add 6th server
//
// New server inserted into the ring
// ------------------------------------------------------------
servers.push({ server: "s5", pos: 5000 });

// Sort again because ring changed
servers.sort((a, b) => a.pos - b.pos);

// ------------------------------------------------------------
// STEP 8: Assign keys again
// ------------------------------------------------------------
const after = assignKeys(TOTAL_KEYS, servers);

// ------------------------------------------------------------
// STEP 9: Count moved keys
// ------------------------------------------------------------
const moved = countMovedKeys(before, after);

// ------------------------------------------------------------
// STEP 10: Print result
// ------------------------------------------------------------
console.log("Total keys:", TOTAL_KEYS);
console.log("Keys moved after adding 6th server:", moved);