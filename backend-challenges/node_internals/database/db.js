import fs from 'fs';
import path from 'path'
import readline from 'readline';

class FileDB {

    constructor(fileName) {
        this.dbFile = path.join(___dirname, fileName);
        this.indexFile = path.join(___dirname, 'index.json');

        if (!fs.existsSync(this.dbFile)) fs.writeFileSync(this.dbFile, "");
        if (!fs.existsSync(this.indexFile)) fs.writeFileSync(this.indexFile, "{}");

        this.index = JSON.parse(fs.readFileSync(this.indexFile, "utf-8"));
    }

    saveIndex() {
        fs.writeFileSync(this.indexFile, JSON.stringify(this.index, null, 2))
    }

    insert(record) {
        const json = JSON.stringify(record);
        fs.appendFileSync(this.dbFile, json + "\n");
        if (record.id !== undefined) {
            this.index[record.id] = true;
            this.saveIndex();
        }
    }

    async findOne(predicate, key = null) {
        if (key && !this.index[key]) {
            return null;
        }
        const readStream = fs.createReadStream(this.dbFile);
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
        return null;
    }

    async update(predicate, updater) {
        const tempFile = this.dbFile + ".tmp";
        const readStream = fs.createReadStream(this.dbFile);
        const writeStream = fs.createWriteStream(tempFile);

        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        })
        for await (const line of rl) {
            if (!line.trim()) continue;

            let obj = JSON.parse(line);

            if (predicate(obj)) {
                obj = updater(obj);
            }

            writeStream.write(JSON.stringify(obj) + "\n");
        }

        writeStream.end();
        await new Promise((res) => writeStream.on("finish", res));

        fs.renameSync(tempFile, this.dbFile);
    }

    async delete(predicate) {
        const tempFile = this.dbFile + ".tmp";

        const readStream = fs.createReadStream(this.dbFile);
        const writeStream = fs.createWriteStream(tempFile);

        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });

        const newIndex = {};

        for await (const line of rl) {
            if (!line.trim()) continue;

            const obj = JSON.parse(line);

            if (!predicate(obj)) {
                writeStream.write(JSON.stringify(obj) + "\n");

                if (obj.id !== undefined) {
                    newIndex[obj.id] = true;
                }
            }
        }

        writeStream.end();
        await new Promise((res) => writeStream.on("finish", res));

        fs.renameSync(tempFile, this.dbFile);

        // rebuild index
        this.index = newIndex;
        this.saveIndex();
    }

}

export default FileDB