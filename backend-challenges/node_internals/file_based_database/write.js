import fs from 'fs';
import path from 'path';
import readline from 'readline';

const DB_FILE = path.join(__dirname, 'db.txt');

function insert(record) {
    const json = JSON.stringify(record);
    fs.appendFileSync(DB_FILE, json + "\n");
}

async function update(predicate, updater) {

    const tempFile = DB_FILE + ".tmp";
    const readStream = fs.createReadStream(DB_FILE);
    const writeStream = fs.createWriteStream(tempFile);

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    })

    for await (const line of rl) {
        if (!line.trim()) continue;
        let obj = JSON.parse(line);
        if (predicate(obj)) {
            obj = updater(obj)
        }
        writeStream.write(JSON.stringify(obj) + "\n");
    }
    writeStream.end();
    await new Promise((resolve) => writeStream.on("finish", resolve));
    fs.renameSync(tempFile, DB_FILE);
}


export { insert, update }

