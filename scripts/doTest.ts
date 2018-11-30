#!/usr/bin/env node

import { NetworkConfiguration } from "../src/NetworkConfiguration";
import { Connector } from "../src/Connector";
import { AccountManager } from "../src/AccountManager";
import { LogDataProvider } from "../src/LogDataProvider";
import { EthCallDataProvider } from "../src/EthCallDataProvider";
import { PouchDataCommiter } from "../src/PouchDataCommiter";
import { SQLiteDataCommiter } from "../src/SQLiteDataCommiter";

import * as Knex from "knex";
import * as sqlite3 from "sqlite3";

var PouchDB =  require('pouchdb');
var fs = require('fs-extra')

const NS_PER_SEC = 1e9;

async function timeIt(desc: string, func: Function): Promise<any> {
    let time = process.hrtime();
    var data = await func();
    let diff = process.hrtime(time);
    console.log(`${desc} took   ${diff[0] * NS_PER_SEC + diff[1]}     nanoseconds`);
    return data;
}

async function doWork(): Promise<void> {
    // Getting Data Tests

    const networkConfiguration = NetworkConfiguration.create();
    const connector = new Connector(networkConfiguration);
    const accountManager = new AccountManager(connector, networkConfiguration.privateKey);

    const ethCallDataProvider: EthCallDataProvider = new EthCallDataProvider(connector, accountManager);
    const logDataProvider: LogDataProvider = new LogDataProvider(connector);

    await timeIt("ETH CALL 10 DATA      ", async () => { await ethCallDataProvider.getAllData(10) });
    await timeIt("ETH CALL 100 DATA     ", async () => { await ethCallDataProvider.getAllData(100) });
    await timeIt("ETH CALL 1000 DATA    ", async () => { await ethCallDataProvider.getAllData(1000) });

    await timeIt("LOG 10 DATA           ", async () => { await logDataProvider.getAllData(10) });
    await timeIt("LOG 100 DATA          ", async () => { await logDataProvider.getAllData(100) });
    await timeIt("LOG 1000 DATA         ", async () => { await logDataProvider.getAllData(1000) });
    const data = await timeIt("LOG 10000 DATA        ", async () => { return await logDataProvider.getAllData(10000) });

    // Pouch DB Test

    fs.removeSync("pouch_serial_db");
    fs.removeSync("pouch_batch_db");

    const serialPouchDB = new PouchDB('pouch_serial_db');
    const batchPouchDB = new PouchDB('pouch_batch_db');

    const serialPouchDataCommiter = new PouchDataCommiter(serialPouchDB);
    const batchPouchDataCommiter = new PouchDataCommiter(batchPouchDB);

    await timeIt("POUCH SERIAL COMMIT   ", async () => { await serialPouchDataCommiter.commitDataSerially(data)});
    await timeIt("POUCH BATCH COMMIT    ", async () => { await batchPouchDataCommiter.commitDataBulk(data)});

    // SQLite Test

    fs.removeSync("sqlite_serial_db");
    fs.removeSync("sqlite_batch_db");

    sqlite3.verbose();

    const serialSQLiteDB: Knex = Knex({
        client: "sqlite3",
        connection: {
            filename: 'sqlite_serial_db',
        },
    });

    const batchSQLiteDB: Knex = Knex({
        client: "sqlite3",
        connection: {
            filename: 'sqlite_batch_db',
        },
    });

    const serialSQLiteDataCommiter = new SQLiteDataCommiter(serialSQLiteDB);
    const batchSQLiteDataCommiter = new SQLiteDataCommiter(batchSQLiteDB);

    await serialSQLiteDataCommiter.initialize();
    await batchSQLiteDataCommiter.initialize();

    // SQLITE Serial commit is ~100-1000x slower than other DB tests
    // await timeIt("SQLITE SERIAL COMMIT  ", async () => { await serialSQLiteDataCommiter.commitDataSerially(data)});
    await timeIt("SQLITE BULK COMMIT    ", async () => { await batchSQLiteDataCommiter.commitDataBulk(data)});
}

doWork().then(() => {
    process.exit();
}).catch(error => {
    console.log(error);
    process.exit(1);
});