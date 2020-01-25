/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
  */
  var doc = global.document,
  win = global.window,
  canvas = doc.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  lastTime,

  // Create random spot for finish field
  finishField = Math.floor(Math.random() * 6);

  canvas.width = 606;
  canvas.height = 83*8;
  document.querySelectorAll('.canvas')[0].appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
  */

  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
    */
    var now = Date.now(),
    dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
    */

    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
    */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
    */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
  */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
  */
  function update(dt) {
    updateEntities(dt);
    checkCollisions();
    checkWin();
    checkLoose();
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
  */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.updatePosition(dt);
    });
    player.updatePosition(dt);
  }

  /*
   * Loop through allEnemies and check for each if
   * position is same as player's Position
   * If so, reset game
  */
  function checkCollisions() {
    allEnemies.forEach(function(enemy) {
      if (player.yPosition === enemy.yPosition
      && (enemy.xPosition + player.xMoveSize / 1.5 > player.xPosition)
      && (enemy.xPosition - player.xMoveSize / 1.5 < player.xPosition)) {
        player.reset();
        enemy.reset();
        starLists.removeStar();
      }
    });
  }

  /*
   * Check if game is won, if so call player fly away function
   * and Show Modul
  */
  function checkWin() {
    // Check if game is won
    if (player.yPosition <= -83 / 2
    && (player.yPosition >= -83 * 2)
    && (player.xPosition == finishField * 101)) {
      player.yPosition -= 0.5;
    } else if (player.yPosition <= -83 * 2) {
      player.yPosition = player.startY;
      modal.setModalHeading('win');
      modal.toggleModal();
    }
  }

  /*
   * Game is lost, when all stars have been used up or player
   * falls into the water
   * Function, to check if game is lost.
  */
  function checkLoose() {
    // Check if Stars reached 0
    if (starLists.getStarCount() == 0
    && (modal.modalHide)) {
      modal.setModalHeading('loose');
      modal.toggleModal();
    }

    // Check if player went into water, if so move hime off screen.
    if (player.yPosition <= -83 / 2
    && (player.xPosition <= 101 * 7)
    && !(player.xPosition == finishField * 101)) {
      /* Number has to be a multiplier wich can*t resolve into
       * finish field posiution
      */
      player.xPosition += 2.377;
    } else if (player.xPosition >= 101 * 7) {
      starLists.setStarCount(0);
      starLists.render();

      // Show Modal if hidden
      if (modal.modalHide) {
        modal.setModalHeading('loose');
        modal.toggleModal();
      }
    }
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
  */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
    */
    var rowImages = [
      'images/water-block.png',   // Top row is water
      'images/stone-block.png',   // Row 1 of 5 of stone
      'images/stone-block.png',   // Row 2 of 5 of stone
      'images/stone-block.png',   // Row 3 of 5 of stone
      'images/stone-block.png',   // Row 5 of 5 of stone
      'images/stone-block.png',   // Row 6 of 6 of stone
      'images/grass-block.png'    // Row 2 of 2 of grass
    ],
    numRows = 7,
    numCols = 6,
    row, col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
    */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
        */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    // Draw finish selector onto last row of game
    ctx.drawImage(Resources.get('images/Selector.png'), finishField * 101, -83 / 2);
    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
  */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
    */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
  }

  // *** Reset Game ***
  // Function to reset all game content
  function reset() {
    // Reset Player position
    player.reset();
    // Reset all Enemies Positions
    allEnemies.forEach(function(enemy) {
      enemy.reset();
    });

    // Reset stars
    starLists.reset();

    // Hide Modal if shown
    if (!modal.modalHide) {
      modal.toggleModal();
    }
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
  */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/Selector.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
  */
  global.ctx = ctx;
  global.ctx.reset = reset;
})(this);
