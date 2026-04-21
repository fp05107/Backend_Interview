import fs, { read } from 'fs';
import path from 'path';
import readline from 'readline';

const DB_FILE = path.join(__dirname, "db.txt");

async function findOne(predicate) {

    const readStream = fs.createReadStream(DB_FILE);
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    })

    for await (const line of rl) {
        if (!line.trim()) continue;
        const obj = JSON.parse(line);
        if (predicate(obj)) {
            rl.close();
            return obj;
        }
    }
    return null
}


export { findOne };