class Card {

    constructor(str) {
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        const suitValues = ['c', 'd', 'h', 's'];
        this.value = str.substr(0,1).toUpperCase();
        this.suit = str.substr(1,1).toLowerCase();
        this.suitRank = suitValues.indexOf(this.suit);
        this.rank = values.indexOf(this.value);
    }

    toString() {
        return this.value + this.suit;
    }

    static sort(a, b) {
        if(a.rank > b.rank) {
            return -1;
        } else if (a.rank < b.rank) {
            return 1;
        } else if (a.suitRank > b.suitRank) {
            return -1;
        } else if (a.suitRank < b.suitRank) {
            return 1;
        } else {
            return 0;
        }
    }
};

class Hand {
    constructor(cards) {
        this.cards = cards.map((c) => {
            return new Card(c);
        });
        this.cards = this.cards.sort(Card.sort);
        if(this.cards.length > 0)
            this.makeHand();
    }

    makeHand() {
        const hands = [
            straightFlush, 
            quads, 
            fullHouse, 
            flush, 
            straight, 
            trips,
            twoPair, 
            pair, 
            highCard,
        ];

        for(let i = 0; i < hands.length; i++) {
            let result = hands[i](this.cards);
            if(result.isPossible) {
                this.best = result.bestFive;
                this.description = result.description;
                this.name = result.name;
                this.value = result.value;
                break;
            }
        }

    }

    static compare(a, b) {
        if(a.value > b.value) {
            return 1;
        } else if(b.value > a.value) {
            return -1;
        } else {
            for(let i = 0; i < 5; i++) {
                if(a.best[i].rank > b.best[i].rank)
                    return 1;
                else if(b.best[i].rank > a.best[i].rank)
                    return -1;
            }
        }
        return 0;
    }
};

function straightFlush(cards) {
    let spades = [],
        hearts = [],
        diamonds = [],
        clubs = [];
    cards.forEach(c => {
        switch(c.suit) {
            case 's':
                spades.push(c);
                break;
            case 'd': 
                diamonds.push(c);
                break;
            case 'h':
                hearts.push(c);
                break;
            case 'c':
                clubs.push(c);
                break;
        }
    });
    let spadesResults = spades.length ? straight(spades) : null,
        heartsResults = hearts.length ? straight(hearts) : null,
        diamondsResults = diamonds.length ? straight(diamonds) : null,
        clubsResults = clubs.length ? straight(clubs) : null,
        returnResults = null;
    if(spadesResults && spadesResults.isPossible) {
        returnResults = spadesResults;
    } else if(heartsResults && heartsResults.isPossible) {
        returnResults = heartsResults;
    } else if(diamondsResults && diamondsResults.isPossible) {
        returnResults = diamondsResults;
    } else if(clubsResults && clubsResults.isPossible) {
        returnResults = clubsResults
    }

    if(returnResults) {
        returnResults.name = "Straight Flush";
        returnResults.description += " Flush";
        returnResults.value = 8;
        return returnResults;
    }
    return { isPossible: false };

}

function quads(cards) {
    let bestFive = [];
    for(let i = 0; i < cards.length; i++) {
        if(numCardsOfRank(cards[i].rank, cards) === 4) {
            bestFive.push(cards[i]);
        }
    }
    if(bestFive.length === 4) {
        cards = cards.slice(0);
        bestFive.forEach(c => {
            cards.splice(cards.indexOf(c), 1);
        });
        bestFive.push(cards[0]);
        return {
            isPossible: true,
            name: 'Four of a Kind',
            description: 'Four of a Kind - ' + bestFive[0].value + 's',
            bestFive: bestFive,
            value: 7
        }
    }
    return { isPossible: false };
}

function fullHouse(cards) {
    let bestFive = [];

    for(let i = 0; i < cards.length; i++) {
        if(numCardsOfRank(cards[i].rank, cards) === 3) {
            bestFive.push(cards[i]);
        }
    }

    if(bestFive.length >= 3) {
        for(let i = 0; i < cards.length; i++) {
            if(numCardsOfRank(cards[i].rank, cards) === 2) {
                bestFive.push(cards[i]);
            }
        }
    }

    if(bestFive.length >= 5) {
        return {
            isPossible: true,
            name: "Full House",
            description: bestFive[0].value + 's Full of ' + bestFive[3].value + 's',
            bestFive: bestFive.slice(0, 5),
            value: 6
        }
    }


    return { isPossible: false };
}

function flush(cards) {
    let suitsInCards = [];

    for(let i = 0 ; i < cards.length; i++) {
        if(suitsInCards.indexOf(cards[i].suit) == -1)
            suitsInCards.push(cards[i].suit);
    }

    let flushSuit;
    for(let i = 0; i < suitsInCards.length; i++) {
        let count = 0;
        for(let k = 0; k < cards.length; k++) {
            if(cards[k].suit == suitsInCards[i])
                count++;
        }
        if(count >= 5) {
            flushSuit = suitsInCards[i];
            break;
        }
    }

    if(flushSuit) {
        cards = cards.slice(0);
        for(let i = 0; i < cards.length; i++) {
            if(cards[i].suit !== flushSuit) {
                cards.splice(i, 1);
                i--;
            }
        }
        return {
            isPossible: true,
            name: "Flush",
            description: cards[0].value + " High Flush",
            bestFive: cards.slice(0, 5),
            value: 5
        }
    }

    return { isPossible: false };
}

function straight(cards) {
    let hasAce = (cards[0].value === "A");
    let gaps = [];
    let bestFive;
    cards = cards.slice(0);
    for(let i = 1; i < cards.length; i++) {
        if(cards[i].rank === cards[i-1].rank) {
            cards.splice(i, 1);
            i--;
        }
    }
    for(let i = 1; i < cards.length; i++) {
        gaps.push(cards[i-1].rank - cards[i].rank);
    }

    if(hasAce && cards[cards.length -1].rank == 0) {
        gaps.push(1);
    }

    let straightCount = 0;
    let i;
    for(i = 0; i < gaps.length; i++) {
        if(gaps[i] == 1)
            straightCount++;
        if(gaps[i] > 1) 
            straightCount = 0;
        if(straightCount >= 4)
            break;
    }
    if(straightCount >= 4) {
        bestFive = cards.slice(i - 3, i+2);
        if(bestFive.length === 4) {
            bestFive.push(cards[0]);
        }
        return {
            isPossible: true,
            name: "Straight",
            description: bestFive[0].value + " High Straight",
            bestFive: bestFive,
            value: 4
        }
    }

    return { isPossible: false };
}

function trips(cards) {
    let bestFive = [];
    for(let i = 0; i < cards.length; i++) {
        if(numCardsOfRank(cards[i].rank, cards) === 3) {
            bestFive.push(cards[i]);
        }
    }
    if(bestFive.length === 3) {
        let newCards = cards.slice(0);
        bestFive.forEach(c => {
            newCards.splice(newCards.indexOf(c), 1);
        })
        bestFive.push(newCards[0]);
        bestFive.push(newCards[1]);
        return {
            isPossible: true,
            description: "Three of a Kind - " + bestFive[0].value + "s",
            name: "Three of a Kind",
            bestFive: bestFive,
            value: 3
        }
    }
    return { isPossible: false };
}

function twoPair(cards) {
    let bestFive = [];
    for(let i = 0; i < cards.length; i++) {
        if(numCardsOfRank(cards[i].rank, cards) === 2) {
            bestFive.push(cards[i]);
        }
    }
    if(bestFive.length >= 4) {
        bestFive = bestFive.slice(0,4);
        let newCards = cards.slice(0);
        bestFive.forEach( c => {
            newCards.splice(newCards.indexOf(c), 1);
        })
        bestFive.push(newCards[0]);
        return {
            isPossible: true, 
            description: "Two Pair - " + bestFive[0].value + 's and ' + bestFive[2].value + 's',
            name: "Two Pair",
            bestFive: bestFive, 
            value: 2
        }
    }
    return { isPossible: false };
}

function pair(cards) {
    let bestFive = [];
    for(let i = 1; i < cards.length; i++) {
        if(cards[i].rank === cards[i-1].rank) {
            bestFive.push(cards[i-1]);
            bestFive.push(cards[i]);
            break;
        }
    }
    if(bestFive[0]) {
        let newCards = cards.slice(0);
        newCards.splice(newCards.indexOf(bestFive[0]), 1);
        newCards.splice(newCards.indexOf(bestFive[1]), 1);
        for(let k = 0; k < 3; k++) {
            bestFive.push(newCards[k]);
        }
        return {
            isPossible: true, 
            description: 'One Pair - ' + bestFive[0].value + 's',
            name: 'One Pair',
            bestFive: bestFive, 
            value: 1
        }
    }
    return { isPossible: false };
}

function highCard(cards) {
    return {
        isPossible: true,
        description: cards[0].value + ' High',
        name: 'High Card',
        bestFive: cards.slice(0, 5),
        value: 0
    }
}

function numCardsOfRank(rank, cards) {
    let num = 0;
    for(let i = 0; i < cards.length; i++) {
        if(cards[i].rank === rank) {
            num++;
        }
    }
    return num;
}

export default Hand;