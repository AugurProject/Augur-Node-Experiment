import BN = require('bn.js');
import { CONTRACT_ADDRESS, CONTRACT_EVENT_HASH, START_BLOCK, NUM_TRANSACTIONS, Data } from '../src/constants'
import { Connector } from './Connector';
import { Log } from 'ethjs-shared';

export class LogDataProvider {
    private readonly contractAddress: string;
    protected readonly connector: Connector;
    protected readonly startBlock: BN;

    protected idCounter: number;

    public constructor(connector: Connector) {
        this.contractAddress = CONTRACT_ADDRESS;
        this.connector = connector;
        this.startBlock = new BN(START_BLOCK);
        this.idCounter = 0;
    }

    public async getAllData(batchSize: 10 | 100 | 1000 | 10000): Promise<Array<Data>> {
        let data: Array<Data> = [];
        let startIndex = 0;
        while (data.length < NUM_TRANSACTIONS) {
            data = data.concat(await this.getData(startIndex, batchSize));
            startIndex += batchSize;
        }
        return data;
    }

    public async getData(startIndex: number, numBlocks: number): Promise<Array<Data>> {
        const fromBlock = this.startBlock.add(new BN(startIndex));
        const toBlock = fromBlock.add(new BN(numBlocks));
        const logFilter = { fromBlock, toBlock, address: this.contractAddress, topics: [CONTRACT_EVENT_HASH]};
        const logs = await this.connector.ethjsQuery.getLogs(logFilter);
        return logs.map(this.createData.bind(this));
    }

    public createData(log: Log) {
        const hexA = log.data.substr(2,64);
        const hexB = log.data.substr(66,130);
        this.idCounter++;
        return {_id: this.idCounter.toString(10), a: parseInt(hexA, 16), b: parseInt(hexB, 16)}
    }
}