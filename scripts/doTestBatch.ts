import * as request from "request-promise-native";

const HOW_MANY = process.env["HOW_MANY"] || 350;
const ETHEREUM_URI = process.env["ETHEREUM_URI"] || "http://127.0.0.1:8545";

function randomBlockRpc(id: number) {
    return {
        id,
        "jsonrpc": "2.0",
        "method": "eth_getBlockByNumber",
        "params": ["0x" + Math.floor(Math.random() * 600000).toString(16), false]
    }
}

function randomBalanceRpc(id: number) {
    const fakeAddress = ("0000000000" + Math.random().toString(16)).slice(-10);
    const call = {
        data: "0x70a08231000000000000000000000000000000000000000000000000000000" + fakeAddress,
        to: "0xf53ad2c6851052a81b42133467480961b2321c09",
    }
    return {
        id,
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [call],
    }
}

function makeRequest(jsonRpc: {}) {
    return request.post("http://127.0.0.1:8545", {
        body: JSON.stringify(jsonRpc),
        headers: {
            'content-type': "application/json",
        }
    });
}

async function timePromise<T>(targetPromise: PromiseLike<T>): Promise<{result: T, timing: number}> {
    const before = Date.now();
    const result = await targetPromise;
    return {
        result,
        timing: Date.now() - before,
    }
}

// I'm only timing the promise by the time we get to the line. We shouldn't have yielded the event loop,
// so the timing difference should be trivial
(async () => {
    const individualRequests = [...Array(HOW_MANY).keys()].map((id) => {
        return makeRequest(id % 2 ? randomBalanceRpc(id) : randomBlockRpc(id));
    });
    const timedConcurrentResult = await timePromise(Promise.all(individualRequests));
    const timedConcurrentResponseSize = JSON.stringify(timedConcurrentResult.result).length;
    console.log(`Concurrent Request of ${HOW_MANY}:\t${timedConcurrentResult.timing}ms (${Math.floor(timedConcurrentResponseSize / 1024)}KB)`);


    const batchJson = [...Array(HOW_MANY).keys()].map((id) => {
        return id % 2 ? randomBalanceRpc(id) : randomBlockRpc(id);
    });
    const batchResponse = request.post(ETHEREUM_URI, {
        body: JSON.stringify(batchJson),
        headers: {
            'content-type': "application/json",
        }
    });
    const timedBatchResult = await timePromise<string>(batchResponse)
    console.log(`Batch Request of ${HOW_MANY}:\t\t${timedBatchResult.timing}ms (${Math.floor(timedBatchResult.result.length / 1024)}KB`);
})()
