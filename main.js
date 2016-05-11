function bowlingGame() {
  var bowling = {};

  function frame(a, b) {
    var _a, _b, _lookahead;
    var frameObj = {};

    function frameConstructor() {
      _lookahead = 0;
      frameObj.setA(a);
      frameObj.setB(b);
    }

    frameObj.getA = function() { return _a; };
    
    frameObj.setA = function(a) { 
      if(a == 'X') {
        _lookahead = 2;
        _a = 10;
      } else if(a == '-') {
        _a = 0;
      } else if(a == undefined) {
        _a = a;
      } else {
        _a = parseInt(a, 10);
      }
    };

    frameObj.getB = function() { return _b; };

    frameObj.setB = function(b) {
      if(b == '/') {
        _lookahead = 1;
        _b = 10 - frameObj.getA();
      } else if (b == '-') {
        _b = 0;
      } else if(b == undefined) {
        _b = b;
      } else {
        _b = parseInt(b, 10);
      }
    };

    frameObj.getSubtotal = function() {
      return (_a > -1 ? _a : 0) + (_b > -1 ? _b : 0);
    };

    frameObj.getLookahead = function() {
      return _lookahead;
    };

    frameObj.canLookahead = function() {
      return _lookahead > 0;
    }

    frameObj.decrementLookahead = function() {
      _lookahead -= 1;
    };

    frameConstructor();

    return frameObj;
  };

  // For testing purposes
  bowling.createFrame = function(a, b) {
    return frame(a, b);
  }

  bowling.play = function(input) {
    var frames = bowling.processGame(input);

    var gameTotal = bowling.processFrames(frames);

    console.log(gameTotal);
  };

  bowling.processGame = function(rawGame) {
    return rawGame.split('').reduce(function(gameArray, current, index) {
      var lastIndex = gameArray.length -1;

      if(current == 'X') {
        gameArray.push(frame(current, -1)); // Add Strike frame
      } else if (current == '/') {
        gameArray[lastIndex].setB(current); // Add Spare frame
      } else if (gameArray.length == 0 || gameArray[lastIndex].getB() != undefined) {
        gameArray.push(frame(current, undefined)); // Add regular frame
      } else {
        gameArray[lastIndex].setB(current); // This can only be 2nd bowl
      }
      return gameArray;
    }, []);
  };

  bowling.processFrames = function(frames) {
    return frames.reduce(function(total, current, index, array) {
      var lookaheadTotal = 0;
      if(index < 10 && current.canLookahead()) {
        array.slice(index + 1).every(function(currentLook) {
          if(current.canLookahead() && currentLook.getA() >= 0) {
            lookaheadTotal += currentLook.getA();
            current.decrementLookahead();
          }

          if(current.canLookahead() && currentLook.getB() >= 0) {
            lookaheadTotal += currentLook.getB();
            current.decrementLookahead();
          }
          return current.canLookahead();
        });
      }
      total += lookaheadTotal + (index < 10 ? current.getSubtotal() : 0);
      return total;
    }, 0);
  };

  return bowling;
}

function main() {
  var _input = "";
  var game = bowlingGame();

  function processData(input) {
    game.play(input);
  }

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", function (input) {
      _input += input;
  });

  process.stdin.on("end", function () {
     processData(_input);
  });
}
main();