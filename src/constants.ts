import { AbiFunction } from 'ethereum';

// This must be updated to the address of your PerfTest contract 
export const CONTRACT_ADDRESS = "0xb8930fef59f476f67723ebf95921a19df9d3f7b6";
// This must be updated to the block which you uploaded your PerfTest contract
export const START_BLOCK = 44715;
// If you wish to run the test with a smaller dataset you may change this value
export const NUM_TRANSACTIONS = 10000;

export const CONTRACT_EVENT_HASH = "7e589e15fd761cfb4252f64654ba58ca316e4acbfcce9ed6fd29beb2ef3871ae";

export interface Data {
    _id: string,
    a: number,
    b: number
}

export const TX_ABI_FUNCTION: AbiFunction = {
    "constant": false,
    "inputs": [
        {
            "name": "_data1",
            "type": "uint256"
        },
        {
            "name": "_data2",
            "type": "uint256"
        }
    ],
    "name": "modifyState",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}

export const CALL_ABI_FUNCTION_10: AbiFunction = {
    "constant": true,
    "inputs": [
        {
            "name": "_startIndex",
            "type": "uint256"
        }
    ],
    "name": "getState10",
    "outputs": [
        {
            "components": [
                {
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "_items",
            "type": "tuple[10]"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}

export const CALL_ABI_FUNCTION_100: AbiFunction = {
    "constant": true,
    "inputs": [
        {
            "name": "_startIndex",
            "type": "uint256"
        }
    ],
    "name": "getState100",
    "outputs": [
        {
            "components": [
                {
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "_items",
            "type": "tuple[100]"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}

export const CALL_ABI_FUNCTION_1000: AbiFunction = {
    "constant": true,
    "inputs": [
        {
            "name": "_startIndex",
            "type": "uint256"
        }
    ],
    "name": "getState1000",
    "outputs": [
        {
            "components": [
                {
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "_items",
            "type": "tuple[1000]"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}