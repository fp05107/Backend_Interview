// Create a DB that saves JSON to a .txt file. 
// Implement findOne and update using Node Streams to handle large files without crashing memory.
// Streams, Buffers & I/O


const fs = require('fs');

let text = await fs.readFile('./test.txt')
console.log("🚀 ~ text:", text)
