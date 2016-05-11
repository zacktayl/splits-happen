describe('bowlingGame', function() {
	var bowling = {};
	beforeEach(function() {
		bowling = bowlingGame();
	});

	describe('play', function() {
		it('should process the game', function() {
			spyOn(bowling, 'processGame');
			var input = 'X81';

			bowling.play(input);

			expect(bowling.processGame).toHaveBeenCalledWith(input);
		});
	});

	describe('processGame', function() {
		it('should return strike frame', function() {
			var input = 'X';
			var strikeFrame = bowling.processGame(input)[0];

			expect(strikeFrame.getA()).toBe(10);
			expect(strikeFrame.getB()).toBe(0);
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
});











