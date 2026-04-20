// Create a DB that saves JSON to a .txt file. 
// Implement findOne and update using Node Streams to handle large files without crashing memory.
// Streams, Buffers & I/O

import fs from 'fs';

let names = [
    { "id": 1, "name": "Subham" },
    { "id": 2, "name": "Rahul" },
    { "id": 1, "name": "Subham" },
    { "id": 2, "name": "Rahul" },
    { "id": 1, "name": "Subham" },
    { "id": 2, "name": "Rahul" }
]

// let text = await fs.readFile('./test.txt')
// console.log("🚀 ~ text:", text)

const stream = fs.createWriteStream('db.txt')
for (let i = 0; i < names.length; i++) {
    stream.write(`'{name:"${names[i].name}"}',`)
}
