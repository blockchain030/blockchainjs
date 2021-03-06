// Thank you to @Savjee for writing the tutorial: 
// https://www.codementor.io/@savjee/how-to-build-a-blockchain-with-javascript-part-1-k7d373dtk

const SHA256 = require("crypto-js/sha256");

class Block{
    constructor(timestamp, data, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.data = data;

      // When creating a new Block, automatically calculate its hash.
    this.hash = this.calculateHash();
    }
  

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain{
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block("01/01/2017", "Genesis block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){

        // The new block needs to point to the hash of the latest block on the chain.
      newBlock.previousHash = this.getLatestBlock().hash;
        
        // Calculate the hash of the new block
      newBlock.hash = newBlock.calculateHash();
    
        // Now the block is ready and can be added to chain!
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
                
            // Recalculate the hash of the block and see if it matches up.
                // This allows us to detect changes to a single block
            if (currentBlock.hash !== currentBlock.calculateHash()) {
              return false;
            }
        
            // Check if this block actually points to the previous block (hash)
            if (currentBlock.previousHash !== previousBlock.hash) {
                    return false;
                }
            }  

            // Check the genesis block
            if(this.chain[0].hash !== this.createGenesisBlock().hash){
                return false;
            }
            
            // If we managed to get here, the chain is valid!
            return true;
    }
}

let savjeeCoin = new Blockchain();

savjeeCoin.addBlock(new Block("20/07/2017", { amount: 4 }));
savjeeCoin.addBlock(new Block("22/07/2017", { amount: 10 }));

console.log(JSON.stringify(savjeeCoin, null, 4));

console.log('Blockchain valid? ' + savjeeCoin.isChainValid());

// Tamper with the chain!
savjeeCoin.chain[1].data = { amount: 100 };
// Recalculate its hash, to make everything appear to be in order!
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

// Check if it's valid again
console.log('Blockchain valid? ' + savjeeCoin.isChainValid()); // will return false!