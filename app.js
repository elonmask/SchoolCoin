var SHA256 = require("crypto-js/sha256");
var express = require('express');
var fs = require('fs');

var app = express();

class Block {
    constructor(index, previousHash, timestamp, mark, hash, name, surname, curr) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.mark = mark;
        this.hash = hash.toString();
        this.name = name;
        this.surname = surname;
        this.curr = curr;
    }
}

function calculateHash(index, previousHash, timestamp, mark, name, surname) {
    return SHA256(index + previousHash + timestamp + mark + name + surname).toString();
}

function getLatestBlock() {

    return blockchain[blockchain.length-1];
}

function generateNextBlock(mark, name, surname) {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, mark, name, surname);

    var curr = null;
    if (mark >= 9) {
      curr = 1/(mark/3.14)
    }

    return new Block(nextIndex, previousBlock.hash, nextTimestamp, mark, nextHash, name, surname, curr);
}

function getGenesisBlock() {
    return new Block(0, "0", 1465154705, "101", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7", "name", "Name");
}

var blockchain = [getGenesisBlock()];

var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

function addBlock(mark, name, surname) {
    var newBlock = generateNextBlock(mark, name, surname);

        blockchain.push(newBlock);
        console.log('New block added...');
}

function showBlockchain() {

    console.log(JSON.stringify(blockchain));
}

addBlock('10', "Sergei", "Voronov");
addBlock('8', "Sergei", "Voronov");
addBlock('11', "Sergei", "Voronov");
addBlock('11', "Sergei", "Voronov");
addBlock('6', "Sergei", "Voronov");
addBlock("7", "Dmitry", "Mukovoz");
addBlock("9", "Nikita", "Kamin");
/**********************************************************************************************************************************************
 *
 */

app.get('/bc', function(req, res) {

    res.send(JSON.stringify(blockchain));
});

app.get('/sync', function(req, res) {

  fs.appendFile('cash.json', JSON.stringify(blockchain), function (err) {
  if (err) throw err;
});

res.sendfile('cash.json');
})

app.get('/add', function(req, res) {

  var mark = req.query.mark;
  var name = req.query.name;
  var surname = req.query.surname;

  addBlock(mark, name, surname);
  res.send('OK');
})

app.get('/', function(req, res) {

    res.render('auth.ejs');
});

app.get('/user', function(req, res) {

  res.send(req.query.name)
})

app.listen(3000, function(){

    console.log('Server is working...');
})
