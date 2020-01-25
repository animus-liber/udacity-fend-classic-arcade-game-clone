//  TODO:
//    Create variable for row and column number,
//    Create variable for image and fiel sizes
//    Probably Global in engine.js

// *** Game *** //

// Declare Enemy Class
// Parameters:
//  x for the starting x-Position
//  y for the starting y-Position
class Enemy {
  constructor(x, y) {
    // Statring position of enemy (don't modify)
    this.startX = x;
    this.startY = y - 83 / 2;

    // Create propertie for x Position and Y Position
    // of enemy
    this.xPosition = this.startX;
    this.yPosition = this.startY;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Speed of the enemy
    this.speed = this.generateRandomSpeed();
  }

  // Speed
  // Create Array with all possible speeds
  generateRandomSpeed() {
    const speeds = [
      200,
      250,
      300,
      350,
      400,
      450
    ];

    // Choose random item from array
    return speeds[Math.floor(Math.random()*speeds.length)];
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  updatePosition(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Ensure Enemy restarts from starting position
    // when out of bounds
    if (this.xPosition < 101 * 6) {
      this.xPosition += this.speed * dt;
    } else {
      this.xPosition = this.startX;
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition);
  }

  // Reset enemy to starting position
  reset() {
    this.xPosition = this.startX;
    this.yPosition = this.startY;
  }
}

// Declare PlayerClass
// Parameters:
//  x for the starting x-Position
//  y for the starting y-Position
class Player {
  constructor(x, y) {
    // Statring position of Player (don't modify)
    this.startX = x + 101 * 2;
    this.startY = y + 83 * 6 - 83 / 2;

    // Create properties for x Position and Y Position
    // of Player
    this.xPosition = this.startX;
    this.yPosition = this.startY;

    // Create Properties for x direction movement
    // and for y direction movement
    // Review the field sizes for movement sizes
    this.xMoveSize = 101;
    this.yMoveSize = 83;

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    // Set standard sprite
    this.sprite = 'images/char-boy.png';
  }

  // Update sprite depending on user input
  updateSprite(sprite) {
    this.sprite = sprite;
  }

  // Method to update player position depending
  // on which key is pressed
  // Ensure player cannot move off field
  updatePosition(pressedKey, dt) {
    // Check which key has been pressed an react
    // accordingly
    // if smaller than -83 / 2 ignore user input
    if (this.yPosition > -83 / 2) {
      switch(pressedKey) {
        case 'left':
          if (this.xPosition > 0) {
            this.xPosition -= this.xMoveSize;
          }
          break

        case 'right':
          if (this.xPosition < (6-1) * this.xMoveSize) {
            this.xPosition += this.xMoveSize;
          }
          break

        case 'up':
          if (this.yPosition > 0) {
            this.yPosition -= this.yMoveSize;
          }
          break;

        case 'down':
          if (this.yPosition < (6-1) * this.yMoveSize) {
            this.yPosition += this.yMoveSize;
          }
          break;
        }
      }
    }

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition);
  }

  // Reset Player
  reset() {
    // Set x postion and y position of player to starting position
    this.xPosition = this.startX;
    this.yPosition = this.startY;
  }
}

// Declare StarLists class
// Starlists includes all uls with class .stars
// StarLists has all needed Methods to update it's
// count of stars
// putting both into one object ensures
// up to date information on all uls
class StarLists {
  constructor() {
    // Create NodeList with all stars uls
    this.ulNodeList = document.querySelectorAll('.stars');

    // Create Star HTML
    this.starHTML = '<li><i class="fa fa-star"></i></li>';

    // Declare how many lives the player has
    this.starsStartAmount = 3;

    // Set starting lives
    this.starsCount = this.starsStartAmount;
  }

  // Declares a method that removes the last star of the
  // star list
  removeStar() {
    for (let currentulNodeList of this.ulNodeList) {
      currentulNodeList.children[currentulNodeList.children.length - 1].remove();
    }
    this.starsCount -= 1;
  }

  // Method that returns the current star count
  getStarCount() {
    return this.starsCount;
  }

  // Methodsetting the current star count depending on
  // parameter
  setStarCount(count) {
    this.starsCount = count;
  }

  // Edit HTML and update stars list depending on
  // current stars count
  render() {
    for (let currentulNodeList of this.ulNodeList) {
      currentulNodeList.innerHTML = '<p>Stars:</p>';
      for (let count = 0; count < this.starsCount; count++) {
        currentulNodeList.innerHTML += this.starHTML;
      }
    }
  }

  // Resets the stars list to start amount
  // and updates html by calling render
  reset() {
    this.starsCount = this.starsStartAmount;
    this.render();
  }
}

// Declare Modal Class //
// - Modal is shown when game is lost or Won
// - Message of Modal is handled dynamically by parameter
// - Modal displays gamestats and reset button
// - If Modal is show, user cannot move character
class Modal {
  constructor() {
    this.modalHTML = document.querySelectorAll('.modal')[0];
    this.modalHeading = this.modalHTML.children[0].children[0];
    this.modalHide = true;
  }

  // gets and returns the current modal status of hidden
  // used to decide when toggle is called
  getModalHide() {
    return this.modalHide;
  }

  // Sets the Modals heading depending on parameter (win / loose)
  setModalHeading(gameStatus) {
    if (gameStatus == 'win') {
      this.modalHeading.innerHTML = 'Yay!You made it!';
    } else if (gameStatus == 'loose') {
      // Use double qotation marks because of don't
      this.modalHeading.innerHTML = "Ohh nooo... Try again :-)";
    } else {
      this.modalHeading.innerHTML = 'Somethings wrong with the game status...';
    }
  }

  // Toggle the modal depending on hidden status
  toggleModal() {
    if (this.modalHTML.classList.contains('hide')) {
      this.modalHTML.classList.remove('hide');
      this.modalHide = false;
    } else {
      this.modalHTML.classList.add('hide');
      this.modalHide = true;
    }
  }
}

// Declare PlayerList Class
// - Includes all possible playerSprites
// - is used to show Player list and update
//  current player depending on user input
// Is only called once for game creation
class PlayerList {
  constructor() {
    // Define paths to player images
    this.playerSprites = [
      'images/char-boy.png',
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png'
    ];

    this.playerListHTML = document.querySelectorAll('.player-list')[0];
  }

  // Edit all players with needed classes and eventlisterns
  // and append to html
  render() {
    for (let image of this.playerSprites) {
      // Create Image Element
      const currentElement = new Image();
      currentElement.classList.add('player-list-item');

      // Add eventListener so when player is clicked
      // the current player's sprite is updated
      currentElement.addEventListener('click', function() {
        player.updateSprite(image);
      });
      currentElement.src = image;
      this.playerListHTML.appendChild(currentElement);
    }
  }
}

// Instantiate Modal Object
const modal = new Modal();

// Instantiate StarLists Object and add to html
const starLists = new StarLists();
starLists.render();

// Instantiate PlayerList Object and add to html
const playerList = new PlayerList();
playerList.render();

// Create Enemy Objects and store in array
const enemy1 = new Enemy(-404, 83 * 1);
const enemy2 = new Enemy(-606, 83 * 1);
const enemy3 = new Enemy(-303, 83 * 2);
const enemy4 = new Enemy(-505, 83 * 3);
const enemy5 = new Enemy(-203, 83 * 3);
const enemy6 = new Enemy(-404, 83 * 4);
// const enemy7 = new Enemy(-303, 83 * 4);
const enemy8 = new Enemy(-707, 83 * 5);
const enemy9 = new Enemy(-504, 83 * 5);

// Place all enemy objects in an array
const allEnemies = [
  enemy1,
  enemy2,
  enemy3,
  enemy4,
  enemy5,
  enemy6,
  // enemy7,
  enemy8,
  enemy9
];

// Place the player object in a variable called player
const player = new Player(0, 0);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // Ensures player can't move if modal is shown
    if (modal.modalHTML.classList.contains('hide')) {
      player.updatePosition(allowedKeys[e.keyCode]);
    }
  });


// Create reset Button array with all HTML elements with class
// 'restart-game'
const resetButton = document.querySelectorAll('.restart-game');

// Foreach reset button add an eventlistener for clicks
// Reset Game if clickedS
resetButton.forEach(function(resetButton) {
  resetButton.addEventListener('click', function() {
    ctx.reset();
  });
});
