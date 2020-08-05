import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('Enter text to get its reversed copy. Press CTRL + C to terminate the program.');
rl.on('line', line => console.log([...line].reverse().join('').concat('\n')));
rl.on('error', error => console.error(`Error occurred during execution of the program. ${error}`));
