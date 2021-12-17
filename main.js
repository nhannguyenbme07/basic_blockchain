// Install thu vien crypto:
// npm install --save crypto-js

const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, "17/12/2021", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /* Replace by new function: minePendingTransaction()
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    //newBlock.hash = newBlock.calculateHash(); //replaced by mineBlock
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }*/

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }
    }
    return true;
  }
}

let bunguCoin = new BlockChain();

bunguCoin.createTransaction(new Transaction("addr1", "addr2", 100));
bunguCoin.createTransaction(new Transaction("addr2", "addr1", 30));

console.log("Start mining ...");
bunguCoin.minePendingTransactions("bungu-addr");

console.log("Start mining again ...");
bunguCoin.minePendingTransactions("bungu-addr");

console.log("Addr1 Balance: " + bunguCoin.getBalanceOfAddress("addr1"));
console.log("Addr2 Balance: " + bunguCoin.getBalanceOfAddress("addr2"));
console.log("Bung U Balance: " + bunguCoin.getBalanceOfAddress("bungu-addr"));
