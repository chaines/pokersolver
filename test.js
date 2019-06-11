import Hand from './handsolver.js';


describe('A 5 card high card hand', () => {
    const hand = new Hand(['As', '2c', '3c', '5s', '9h']);
    const cards = hand.cards.map((c) => {
        return c.toString();
    })

    it('is properly sorted', () => {
        expect(cards).toEqual(['As', '9h', '5s', '3c', '2c']);
    });

    it('is properly ranked', () => {
        expect(hand.name).toBe("High Card");
        expect(hand.description).toBe("A High");
    });
});

describe('A 7 card high card hand', () => {
    const hand = new Hand(['9h', '3c', '7h', '2s', 'js', 'kd', 'As']);
    const cards = hand.cards.map((c) => {
        return c.toString();
    });

    it('is properly sorted', () => {
        expect(cards).toEqual(['As', 'Kd', 'Js', '9h', '7h', '3c', '2s']);
    });

    it('is properly ranked', () => {
        expect(hand.name).toBe("High Card");
        expect(hand.description).toBe("A High");
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map((c) => {
            return c.toString();
        });

        expect(best).toEqual(['As', 'Kd', 'Js', '9h', '7h']);
    });
});

describe("An 8 card hand with one pair", () => {
    const hand = new Hand(['Ah', 'As', '2c', '3c', '6d', '8h', 'Ks', 'Jd']);
    const cards = hand.cards.map((c) => {
        return c.toString();
    });

    it("is properly sorted", () => {
        expect(cards).toEqual(['As', 'Ah', 'Ks', 'Jd', '8h', '6d', '3c', '2c']);
    });

    it("is properly ranked", () => {
        expect(hand.name).toBe("One Pair");
        expect(hand.description).toBe("One Pair - As");
    });

    it("has the correct best 5 cards", () => {
        const best = hand.best.map(c => {
            return c.toString();
        })

        expect(best).toEqual(['As', 'Ah', 'Ks', 'Jd', '8h']);
    });
});

describe("An 8 card hand with a low-ranked pair", () => {
    const hand = new Hand(['2c', '2d', '3s', '5h', '9h', 'js', 'kh', 'Td']);
    const cards = hand.cards.map((c) => {
        return c.toString();
    });

    it("is properly sorted", () => {
        expect(cards).toEqual(['Kh', 'Js', 'Td', '9h', '5h', '3s', '2d', '2c']);
    });

    it("is properly ranked", () => {
        expect(hand.name).toBe("One Pair");
        expect(hand.description).toBe("One Pair - 2s");
    });

    it("has the correct best 5 cards", () => {
        const best = hand.best.map(c => {
            return c.toString();
        })

        expect(best).toEqual(['2d', '2c', 'Kh', 'Js', 'Td']);
    });
})

describe('A 7 card 3 pair hand', () => {
    const hand = new Hand(['As', '2c', 'Ah', '2d', '7h', '8d', '8s'])
    it('is properly ranked as 2 pair', () => {
        expect(hand.name).toBe("Two Pair");
        expect(hand.description).toBe("Two Pair - As and 8s");
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['As', 'Ah', '8s', '8d', '7h']);
    });
});

describe('A hand with trips', () => {
    const hand = new Hand(['As', '3s', '6c', 'Kd', '6d', 'Jh', '6s']);

    it('is properly ranked as Three of a Kind', () => {
        expect(hand.name).toBe("Three of a Kind");
        expect(hand.description).toBe("Three of a Kind - 6s");
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['6s', '6d', '6c', 'As', 'Kd']);
    })
})

describe('A hand with a straight', () => {
    const hand = new Hand(['Qs', '8h', '9d', 'Tc', 'As', '4c', 'Js']);

    it('is properly ranked as a Straight', () => {
        expect(hand.name).toBe("Straight");
        expect(hand.description).toBe("Q High Straight");
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['Qs', 'Js', 'Tc', '9d', '8h']);
    });
});

describe("A hand with a wheel", () => {
    const hand = new Hand(['As', '2c', '3c', '4d', '5h', '9s', 'Ks']);

    it('is properly ranked as a Straight', () => {
        expect(hand.name).toBe("Straight");
        expect(hand.description).toBe('5 High Straight');
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['5h', '4d', '3c', '2c', 'As']);
    });
});

describe("A flush", () => {
    const hand = new Hand(['3s', '9s', '4s', '3d', 'ks', 'js', 'ts']);

    it('is properly ranked as a flush', () => {
        expect(hand.name).toBe('Flush');
        expect(hand.description).toBe('K High Flush');
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['Ks', 'Js', 'Ts', '9s', '4s']);
    });
});

describe("A full house", () => {
    const hand = new Hand(['3s', '3c', '3d', 'as', 'ac', 'ad', '5s']);

    it('is properly ranked as a full house', () => {
        expect(hand.name).toBe('Full House');
        expect(hand.description).toBe('As Full of 3s');
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['As', 'Ad', 'Ac', '3s', '3d' ]);
    });
})

describe('A hand with 4 of a kind', () => {
    const hand = new Hand(['ts', 'tc', 'td', 'th', 'as', 'js', 'qs', 'kd']);

    it('is properly ranked as four of a kind', () => {
        expect(hand.name).toBe('Four of a Kind');
        expect(hand.description).toBe('Four of a Kind - Ts');
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['Ts', 'Th', 'Td', 'Tc', 'As']);

    })
});

describe("A straight flush", () => {
    const hand = new Hand(['9s', 'ts', 'js', '4s', '3c', '2c', '8s', 'qs']);

    it('is properly ranked as straight flush', () => {
        expect(hand.name).toBe("Straight Flush");
        expect(hand.description).toBe('Q High Straight Flush');
    })

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['Qs', 'Js', 'Ts', '9s', '8s']);
    })
});

describe("The Steel Wheel", () => {
    const hand = new Hand(['5c', '3c', 'Ac', '9s', 'ts', 'td', '4c', '2c']);

    it('is properly ranked as straight flush', () => {
        expect(hand.name).toBe("Straight Flush");
        expect(hand.description).toBe('5 High Straight Flush');
    });

    it('has the correct best 5 cards', () => {
        const best = hand.best.map(c => {
            return c.toString();
        });

        expect(best).toEqual(['5c', '4c', '3c', '2c', 'Ac']);
    });
});

test('Compare a straight flush vs a full house', () => {
    const a = new Hand(['6c', '5c', '4c', '3c', '2c']);
    const b = new Hand(['as', 'ad', 'ac', '5h', '5d']);
    expect(Hand.compare(a, b)).toBe(1);
});

test('Compare a 6 high straight flush vs the steel wheel', () => {
    const a = new Hand(['6c', '5c', '4c', '3c', '2c']);
    const b = new Hand(['5c', '4c', '3c', '2c', 'ac']);
    expect(Hand.compare(a, b)).toBe(1);
});

test('Compare two same rank boats', () => {
    const a = new Hand(['ac', 'ad', 'as', 'ks', 'kd']);
    const b = new Hand(['ac', 'ad', 'ah', 'ks', 'kd']);
    expect(Hand.compare(a, b)).toBe(0);
});

