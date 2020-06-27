import Hand from './handsolver.js';
import {performance} from 'perf_hooks';
import os from 'os';
import threads from 'worker_threads';
import any from 'promise.any';


const cores = os.cpus().length;
const ranks = ['2','3','4','5','6','7','8','9','t','j','q','k','a'];
const suits = ['s','c','d','h'];
const deck = [];
suits.forEach(suit => {
    ranks.forEach(rank => deck.push(rank + suit));
});
console.log(deck);

class ChildThread {
    constructor(messageHandler) {
        this.worker = new threads.Worker('./rangeThread.js');
        this.isDone = true;
        this.worker.on('message', m => messageHandler(m, this));
    }
    sendMessage(message) {
        this.worker.postMessage(message);
        this.isDone = false;
    }
    sendMessageBuffer(message, [buffer]) {
        this.worker.postMessage(message, [buffer]);
        this.isDone = false;
    }
    free() {
        return new Promise(resolve => {
            this.worker.on('message', () => {
                availableWorkers.push(this);
                resolve();
                
            });
        })
    }
    dead() {
        return new Promise(resolve=> {
            this.worker.on('exit', () => resolve());
        })
    }
}

let threadResponses = 0;
function process(m, worker) {
    threadResponses++;
    hand1Wins += m[0];
    hand2Wins += m[1];
    ties += m[2];
    if(!done)
        availableWorkers.push(worker);
    else
        worker.sendMessage("done");
}
const startTime = performance.now();
let handArr = new Uint8Array(700);
let count = 0;
let arrCount = 0;
let hand1Wins = 0;
let hand2Wins = 0;
let ties = 0;
let workers = [];
for(let i = 0; i < cores; i++) {
    workers.push(new ChildThread(process));
}
let availableWorkers = workers.slice();

const h1 = 'jsts';
const h2= 'jhth';

function anyWorkerFree(threads) {
    let promises = [];
    threads.forEach(thread => promises.push(thread.free()));
    return any(promises);
}

function getEquity(hand1, hand2, board) {

    const hand1Cards = getCards(hand1);
    const hand2Cards = getCards(hand2);
    const boardCards = getCards(board);
    const hand1card1val = deck.indexOf(hand1Cards[0]);
    const hand1card2val = deck.indexOf(hand1Cards[1]);
    const hand2card1val = deck.indexOf(hand2Cards[0]);
    const hand2card2val = deck.indexOf(hand2Cards[1]);
    const boardCardVals = []
    for (let i = 0; i < boardCards.length; i ++) {
        boardCardVals.push(deck.indexOf(boardCards[i]));
    }
    const tempArr = [];
    tempArr[0] = deck.indexOf(hand1Cards[0]);
    tempArr[1] = deck.indexOf(hand1Cards[1]);
    tempArr[7] = deck.indexOf(hand2Cards[0]);
    tempArr[8] = deck.indexOf(hand2Cards[1]);
    const staticBoardLength = boardCards.length;
    for(let i = staticBoardLength; i < 5; i++) {
        tempArr[i] = boardCardVals[i-staticBoardLength];
        tempArr[i+7] = tempArr[i];
    }
    
    let subDeck = deck.slice();
    subDeck = removeCards(hand1Cards.concat(hand2Cards).concat(boardCards), subDeck);
    let done = false;
    const iterator = generateBoard(boardCardVals, subDeck, 5);
    let fBoard = iterator.next().value;
    function processBoard(finalBoard) {
        count++;
        for(let i = staticBoardLength; i < 5; i++) {
            tempArr[i+2] = finalBoard[i];
            tempArr[i+9] = finalBoard[i];
        }
        handArr.set(tempArr, arrCount*14);
        arrCount++;
        if(arrCount === 50){
            if(availableWorkers.length === 0) {
                anyWorkerFree(workers).then(() => {
                    const currWorker = availableWorkers.pop();
                    currWorker.sendMessageBuffer(handArr, [handArr.buffer]);
                    arrCount = 0;
                    handArr = new Uint8Array(700);
                    fBoard = iterator.next().value;
                    if(fBoard) processBoard(fBoard);
                });
            } else {
                const currWorker = availableWorkers.pop();
                currWorker.sendMessageBuffer(handArr, [handArr.buffer]);
                arrCount = 0;
                handArr = new Uint8Array(700);
                fBoard = iterator.next().value;
                if(fBoard) processBoard(fBoard);
            }
        } else {
            fBoard = iterator.next().value;
            if(fBoard) processBoard(fBoard);
        }
    }
    processBoard(fBoard);
    done=true;
    console.log("done");
    let endPromises = []
    workers.forEach(worker => endPromises.push(worker.dead()));
    Promise.all(endPromises).then(() => {
        const endTime = performance.now();
        console.log("Hand 1: " + (hand1Wins + ties/2)/count + " wins(" + hand1Wins + ") ties(" + ties + ")");
        console.log("Hand 2: " + (hand2Wins + ties/2)/count + " wins(" + hand2Wins + ") ties(" + ties + ")");
        console.log("Time taken: " + endTime + " - " + startTime);
        console.log("Count: " + count);
        console.log("Thread responses: " + threadResponses);
    })


}

function* generateBoard(startingBoard, subDeck, boardLength) {
    function* doGenerateBoard(offset, newBoard) {
        if(newBoard.length === boardLength) {
            yield newBoard;
        } else {
            for(let i = offset; i < subDeck.length; i++) {
                yield* doGenerateBoard(i+1, newBoard.concat(i));
            }
        }
    }
    yield* doGenerateBoard(0, startingBoard);
}

function removeCards(toRemove, subDeck) {
    toRemove.forEach(card => {
        const loc = subDeck.indexOf(card);
        if(loc === -1) {
            throw new RangeError("Card [" + card + "] doesn't exist or is already used");
        }
        subDeck.splice(loc, 1);
    });
    return subDeck;
}

function getCards(cardString) {
    let cards = [];
    for(let i = 0; i < cardString.length; i+=2) {
        cards.push(cardString.slice(i, i+2));
    }
    return cards;
}

getEquity(h1, h2, '');