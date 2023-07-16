import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fs from 'fs'

const defaultDB = fs.readFileSync('./db-defaults.json');

async function loadDB(client) {
    const adapter = new JSONFile("./db.json");
    const db = new Low(adapter, JSON.parse(defaultDB));

    client.db = db;

    await db.read();

    console.log("Database is loaded");
}

export default function (client) {
    fs.open('./db.json', 'wx', async (err, fd) => {
        if (err) {
            if (err.code === 'EEXIST') {
                await loadDB(client);
                return;
            }
            throw err;
        }
        
        console.warn('Файл с базой данных не найден, создаю...');

        fs.writeFile('./db.json', defaultDB, async (err) => {
            if (err) {
                throw err;
            }
            await loadDB(client);
        });
    });
}
