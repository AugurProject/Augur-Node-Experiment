#!/usr/bin/env node

import { NetworkConfiguration } from "../src/NetworkConfiguration";
import { Connector } from "../src/Connector";
import { AccountManager } from "../src/AccountManager";
import { TransactionGenerator } from "../src/TransactionGenerator";

async function doWork(): Promise<void> {
    const networkConfiguration = NetworkConfiguration.create();
    const connector = new Connector(networkConfiguration);
    const accountManager = new AccountManager(connector, networkConfiguration.privateKey);

    const transactionGenerator: TransactionGenerator = new TransactionGenerator(connector, accountManager);
    await transactionGenerator.generateTransactions();
}

doWork().then(() => {
    process.exit();
}).catch(error => {
    console.log(error);
    process.exit(1);
});