import { encodeMethod } from 'ethjs-abi';
import { AbiFunction } from 'ethereum';
import { CONTRACT_ADDRESS, CALL_ABI_FUNCTION_10, CALL_ABI_FUNCTION_100, CALL_ABI_FUNCTION_1000, NUM_TRANSACTIONS, Data } from '../src/constants'
import { AccountManager } from './AccountManager';
import { Connector } from './Connector';


export class EthCallDataProvider {
    private readonly contractAddress: string;
    protected readonly connector: Connector;
    protected readonly accountManager: AccountManager;

    protected idCounter: number;

    public constructor(connector: Connector, accountManager: AccountManager) {
        this.contractAddress = CONTRACT_ADDRESS;
        this.connector = connector;
        this.accountManager = accountManager;
        this.idCounter = 0;
    }

    public async getAllData(batchSize: 10 | 100 | 1000): Promise<Array<Data>> {
        let abi = CALL_ABI_FUNCTION_10;
        if (batchSize === 100) abi = CALL_ABI_FUNCTION_100;
        if (batchSize === 1000) abi = CALL_ABI_FUNCTION_1000;
        let data: Array<Data> = [];
        let startIndex = 0;
        while (data.length < NUM_TRANSACTIONS) {
            data = data.concat(await this.getData(startIndex, abi));
            startIndex += batchSize;
        }
        return data;
    }

    public async getData(startIndex: number, abi: AbiFunction): Promise<Array<Data>> {
        const from = this.accountManager.defaultAddress;
        const data = encodeMethod(abi, [startIndex]);
        const transaction = { from: from, to: this.contractAddress, data: data };
        const result = await this.connector.ethjsQuery.call(transaction);
        return result.substring(2).match(/.{1,128}/g).map(this.createData.bind(this));
    }

    public createData(rawData: string): Data {
        const hexA = rawData.substr(0,64);
        const hexB = rawData.substr(64,128);
        this.idCounter++;
        return {_id: this.idCounter.toString(10), a: parseInt(hexA, 16), b: parseInt(hexB, 16)}
    }
}