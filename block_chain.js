const SHA256 = require('crypto-js/sha256');

// Creates a Block in a Block Chain
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined -> " + this.hash);
    }
}


// Creates the BlockChain
class BlockChain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1; // To increase time in miningblock increase difficulty.
    }
    
    createGenesisBlock(){
        return new Block(0, new Date().toISOString().slice(0, 10), "Genesis Block", "0" );
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]

            if( currentBlock.hash !== currentBlock.calculateHash() ){
                return false;
            }

            if( currentBlock.previousHash !== previousBlock.hash ){
                return false;
            }
        }
    return true;

    }

}

let coin = new BlockChain();

console.log("Mining Block 1....")
coin.addBlock(new Block(2, "2021-06-07", {amount: 1000}))

console.log("Mining Block 2....")
coin.addBlock(new Block(2, "2021-06-07", {amount: 5000}))

console.log(coin.isChainValid());

// To print the BlockChain
// console.log(JSON.stringify(coin, null, 4));