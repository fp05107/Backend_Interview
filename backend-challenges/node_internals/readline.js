import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// rl.question("What is your name? ", (name) => {
//   console.log("Hello " + name);
//   rl.close();
// });

rl.on("line", (input) => {
  console.log("You typed:", input);
});