const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const { stdin, stdout } = require('node:process');

stdin.on('data', (input) => {
  if (input.toString().trim() === 'exit') {
    console.log('Goodbye!');
    writeStream.end();
    process.exit();
  } else {
    writeStream.write(input);
  }
});

stdout.write('Enter the text to display it!\n');

process.on('SIGINT', () => {
  console.log('Goodbye!');
  writeStream.end();
  process.exit();
});
