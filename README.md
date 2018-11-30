# Augur-Node-Experiment
Just a scratch project to play around with ways of collecting and ingesting data

# Setup

```
yarn
yarn tsc
```

# Populate the chain

This relies on a suitable contract being uploaded to whatever chain you are hitting locally. The contract originally used for this can be found in the contracts folder as "PerfTest.sol"

NOTE: You'll need to update the values in constants.ts to match your contract address

```
node build/scripts/initialize.js
```

This script will attempt to sparsely populate the chain (to simulate state changing slowly and spread out over time) with 10000 (by default) txs that alter state and emit logs.

# Run the test
```
node build/scripts/doTest.js
```

The test script will grab data from chain both via eth_calls and getLogs requests in varying batch sizes.

It will also perform insertions into a PouchDB and SQLite DB serially and in batch operations.

Every action like this that it takes it will output the total nanoseconds taken to perform.