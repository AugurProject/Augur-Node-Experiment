import BN = require('bn.js');
import { encodeMethod } from 'ethjs-abi';
import { NUM_TRANSACTIONS, CONTRACT_ADDRESS, TX_ABI_FUNCTION } from '../src/constants'
import { AccountManager } from './AccountManager';
import { Connector } from './Connector';

export class TransactionGenerator {
    private readonly contractAddress: string;
    private readonly numTransactions: number;
    protected readonly connector: Connector;
    protected readonly accountManager: AccountManager;

    public constructor(connector: Connector, accountManager: AccountManager) {
        this.contractAddress = CONTRACT_ADDRESS;
        this.numTransactions = NUM_TRANSACTIONS;
        this.connector = connector;
        this.accountManager = accountManager;
    }

    public async generateTransactions(): Promise<void> {
        let data1 = 0;
        let data2 = this.numTransactions;
        for (let i = 0; i < this.numTransactions; i++) {
            console.log(`transaction ${data1}`);
            await this.sendTransaction(data1, data2);
            data1 += 1;
            data2 += 1;
        }
    }

    public async sendTransaction(data1: number, data2: number): Promise<void> {
        const from = this.accountManager.defaultAddress;
        const data = encodeMethod(TX_ABI_FUNCTION, [data1, data2]);
        let gas = new BN(200000);
        let gasPrice = 1;
        const transaction = { from, to: this.contractAddress, data: data, gasPrice: gasPrice, gas: gas };
        const signedTransaction = await this.accountManager.signTransaction(transaction);
        const transactionHash = await this.connector.ethjsQuery.sendRawTransaction(signedTransaction);
        const txReceipt = await this.connector.waitForTransactionReceipt(transactionHash, `Waiting on receipt for tx: ${data1}`);
        if (txReceipt.status != 1) {
            throw new Error(`Tx failed: ${txReceipt}`);
        }
    }
}