const SHA256=require('sha256'); //npm install sha256

class Blockchain{
    constructor(){
        this.chain=[];
        this.pendingTransactions=[];
        this.difficulty=2;
        this.myurl=process.argv[3];
        this.allNodes=[];

        this.createNewBlock(0,'0','0');//create our genesis block
    }

    createNewBlock(nonce,previousBlockHash,hash){
        //create a new block object
        //here is where mining actually take place
        const newBlock={
            index:this.chain.length+1,
            timestamp:Date.now(),
            transactions:this.pendingTransactions, //add all the new transactions here
            nonce:nonce,//a number that comes from the proof of work
            hash:hash,//hash value of all the data part in the block
            previousBlockHash:previousBlockHash, //hash of the data in the previous block
        };

        this.pendingTransactions=[];//clear the values in the pendingTransactions list so that we can start new and clear for next mining
        this.chain.push(newBlock); //add it to the chain

        return newBlock;
    }

    getLastBlock(){
        //returns the last block in the chain
        return this.chain[this.chain.length-1];
    }

    createNewTransaction(amount,sender,recipient){
        const transaction={
            amount:amount,
            sender:sender,
            recipient:recipient
        };

        this.pendingTransactions.push(transaction);
        return (this.getLastBlock().index)+1;
    }

    hashBlock(previousBlockHash,currentBlockData,nonce){
        //gives the hash value of the details in a block and returns the hash
        //we will be using SHA256 hash
        const data=previousBlockHash+nonce.toString()+JSON.stringify(currentBlockData);
        const hash=SHA256(data);
        return hash;
    }

    proofOfWork(previousBlockHash,currentBlockData){
        //repeatedly hash the values until it finds a hash with a particular fomat, here, say 00 at the beginning
        //difficulty matters here
        //returns the nonce
        //this nonce is given to hashBlock() function to hash it
        let nonce=0;
        let hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);
        while(hash.substring(0,this.difficulty)!==Array(this.difficulty+1).join("0")){
            nonce+=1;
            hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);
        }

        return nonce;
    }
}

module.exports=Blockchain;