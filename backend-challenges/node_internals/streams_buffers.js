import fs from 'fs';

fs.readFile('subham.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// const stream = fs.createReadStream('subham.txt');

// stream.on('data', (chunk) => {
//     console.log("New chunk received: ", chunk.toString());
// })

// stream.on('end', () => {
//     console.log("Finished reading file..")
// })

// Create a writable stream
// const stream = fs.createWriteStream('output.txt');

// // Write some data to the file
// stream.write('Hello, ');
// stream.write('world!');

// // Mark the end of the writable stream
// stream.end();
