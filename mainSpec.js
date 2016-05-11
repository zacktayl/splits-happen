describe('bowlingGame', function() {
	var bowling = {};
	beforeEach(function() {
		bowling = bowlingGame();
	});

	describe('play', function() {
		it('should process the game', function() {
			spyOn(bowling, 'processGame').and.returnValue([1, 2, 3]);
			spyOn(bowling, 'processFrames');
			var input = 'X81';

			bowling.play(input);

			expect(bowling.processGame).toHaveBeenCalledWith(input);
			expect(bowling.processFrames).toHaveBeenCalledWith([1, 2, 3]);
		});
	});

	describe('processGame', function() {
		it('should return strike frame', function() {
			var input = 'X';
			var strikeFrame = bowling.processGame(input)[0];

			expect(strikeFrame.getA()).toBe(10);
			expect(strikeFrame.getB()).toBe(-1);
			expect(strikeFrame.getLookahead()).toBe(2);
		});

		it('should return spare frame', function() {
			var input = '1/';

			var spareFrame = bowling.processGame(input)[0];

			expect(spareFrame.getA()).toBe(1);
			expect(spareFrame.getB()).toBe(9);
			expect(spareFrame.getLookahead()).toBe(1);
		});

		it('should return regular frame', function() {
			var input = '32';

			var regularFrame = bowling.processGame(input)[0];

			expect(regularFrame.getA()).toBe(3);
			expect(regularFrame.getB()).toBe(2);
			expect(regularFrame.getLookahead()).toBe(0);
		});

		it('should return 4 frames', function() {
			var input = 'X81-92/';

			expect(bowling.processGame(input).length).toBe(4);
		});
	});

	describe('processFrames', function() {
		it('should process strike lookahead', function() {
			var input = 'X12----------------';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(16);
		});

		it('should process spare lookahead', function() {
			var input = '1/12----------------';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(14);
		});

		it('should process multiple strikes', function() {
			var input = 'XXXXXXXXXXXX';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(300);
		});

		it('should process game with no strikes or spares', function() {
			var input = '9-9-9-9-9-9-9-9-9-9-';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(90);
		});

		it('should process game with only spares', function() {
			var input = '5/5/5/5/5/5/5/5/5/5/5';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(150);
		});

		it('should process game with a mix', function() {
			var input = 'X7/9-X-88/-6XXX81';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(167);
		});

		it('should process game of a horrible bowler', function() {
			var input = '--------------------';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(0);
		});

		it('should process horrible bowler who gets better at the end', function() {
			var input = '--------------XXXXX';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(90);
		});

		it('should process unlucky bowler who gets worse at the end', function() {
			var input = 'XXXXX--------------';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(120);
		});

		it('should process horrible bowler who gets better over time', function() {
			var input = '--12--3/22----XXXXX';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(109);
		});

		it('should process unlucky bowler who gets worse over time', function() {
			var input = 'XXXXX--5--7-91/9';
			var frames = bowling.processGame(input);

			expect(bowling.processFrames(frames)).toBe(160);
		});

	});
});

describe('frame', function() {
	var bowling = {};
	var testFrame = {};
	beforeEach(function() {
		bowling = bowlingGame();
	});

	describe('frameConstructor', function() {
		it('should use default values', function() {
			testFrame = bowling.createFrame(undefined, undefined);

			expect(testFrame.getA()).toBe(undefined);
			expect(testFrame.getB()).toBe(undefined);
			expect(testFrame.getLookahead()).toBe(0);
		});
	});

	describe('setA', function() {
		beforeEach(function() {
			testFrame = bowling.createFrame(undefined, undefined);
		})
		it('should parse X as 10 and set lookahead correctly', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setA('X');

			expect(testFrame.getA()).toBe(10);
			expect(testFrame.getLookahead()).toBe(2);
		});

		it('should parse - as 0 and leave lookahead untouched', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setA('-');

			expect(testFrame.getA()).toBe(0);
			expect(testFrame.getLookahead()).toBe(0);
		});

		it('should parse numeric strings as integers and leave lookahead untouched', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setA('3');

			expect(testFrame.getA()).toBe(3);
			expect(testFrame.getLookahead()).toBe(0);
		});
	});

	describe('setB', function() {
		beforeEach(function() {
			testFrame = bowling.createFrame(undefined, undefined);
		});

		it('should parse / as remainder and set lookahead correctly', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setA('4');
			testFrame.setB('/');

			expect(testFrame.getB()).toBe(6);
			expect(testFrame.getLookahead()).toBe(1);
		});

		it('should parse - as 0 and leave lookahead untouched', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setB('-');

			expect(testFrame.getB()).toBe(0);
			expect(testFrame.getLookahead()).toBe(0);
		})

		it('should parse numeric strings as integers and leave lookahead alone', function() {
			expect(testFrame.getLookahead()).toBe(0);

			testFrame.setB('5');

			expect(testFrame.getB()).toBe(5);
			expect(testFrame.getLookahead()).toBe(0);
		});
	});

	describe('getSubtotal', function() {
		it('should return subtotal excluding of a and b', function() {
			testFrame = bowling.createFrame(5, 3);

			expect(testFrame.getSubtotal()).toBe(8);
		});

		it('should return subtotal excluding negative values - a', function() {
			testFrame = bowling.createFrame(-1, 1);

			expect(testFrame.getSubtotal()).toBe(1);
		});

		it('should return subtotal excluding negative values - b', function() {
			testFrame = bowling.createFrame(1, -1);

			expect(testFrame.getSubtotal()).toBe(1);
		});
	});
});











