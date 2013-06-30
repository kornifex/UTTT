define([
  'underscore',
  'src/BaseClass',
  'src/Arena'
], function(
  _,
  BaseObject,
  Arena
) {
  var Grid;
  var Cell;
  var Game = BaseObject.extend({

    players: [],
    grid: [],

    initialize: function(opt) {
      console.info('Game Created !');

      this.client     = opt.client || false;
      this.controller = opt.controller;
      this.socket     = opt.socket;

      if(this.client) {

        this.socket.on('UT_JOINPLZ' , _.bind( this.onJoinPlz  , this ));
        this.socket.on('UT_STARTNAO', _.bind( this.onStartNao , this ));
        this.socket.on('UT_WAITNAO' , _.bind( this.onWaitNao  , this ));

        this.socket.emit('UT_GAMEPLZ');

      }


      this.arena = new Arena({
        game: this
      });

      this.initializeGrid();

      this.arena.render();
      this.arena.draw(this.grid);
    },

    /**
     * Creates the logical structure of the grid on which draw() is based.
     */
    initializeGrid: function() {

      for (var i = 0 ; i < 3 ; i++) {
        this.grid[i] = [];
        for (var k = 0 ; k < 3 ; k++) {
          this.grid[i][k] = new Grid(this.arena, i, k);
        }
      }
    },

    activate: function(coords) {

      var g = coords.grid,
          c = coords.cell,
          grid = this.grid[g[0]][g[1]],
          cell = grid.cells[c[0]][c[1]];

      if((typeof this.getPlayableGrid() === 'undefined' ||
        grid === this.getPlayableGrid() ) &&
        !cell.activated ) {

        if (!this.toggle) this.toggle = 1;

        this.arena.drawSymbol(cell, this.toggle *= -1);
        this.setPlayableGrid.apply(this, c);
        cell.activated = true;

      } else {

        alert('LULZ NOPE');

      }

    },

    setPlayableGrid: function(x, y) {
      this.playableGrid = this.grid[x][y];
    },

    getPlayableGrid: function() {
      return this.playableGrid;
    },

    onJoinPlz: function(data) {

      this.controller.router.navigate('play/' + data.id, {
        trigger: true,
        replace: false
      });

    },

    onStartNao: function(data) {
      console.log('STARTNAO', data);

      // this.players[1] = new Player(data.playerId);

    },

    onWaitNao: function(data) {
      console.log('WAITNAO', data);
    }

  });






  Cell = function(grid, x, y) {

    this.grid = grid;
    this.xPos = x;
    this.yPos = y;
    this.width = Math.floor(this.grid.width / 3);
    this.height = Math.floor(this.grid.height / 3);
    this.originX = this.xPos * this.width;
    this.originY = this.yPos * this.height;

  };

  Grid = function (arena, x, y) {

    this.arena = arena;
    // Position in the main grid [3][3]
    this.xPos = x;
    this.yPos = y;
    this.cells = [];
    this.width = Math.floor(this.arena.el.width / 3);
    this.height = Math.floor(this.arena.el.height / 3);
    // Px origin of the grid inside the canvas
    this.originX = this.xPos * this.width;
    this.originY = this.yPos * this.height;

    this.initCells();
  };

  _.extend(Grid.prototype, {

    initCells: function () {
      for (var i = 0 ; i < 3 ; i++) {
        this.cells[i] = [];
        for (var k = 0 ; k < 3 ; k++) {
          this.cells[i][k] = new Cell(this, i, k);
        }
      }
    },

    getRelativePoint: function (x, y) {
      return {
        x: x - this.originX,
        y: y - this.originY
      };
    },

    getCell: function (x, y) {
      var cellX = Math.floor(x / (this.width / 3));
      var cellY = Math.floor(y / (this.height / 3));
      console.log('Cell', cellX, cellY);
      return this.cells[cellX][cellY];
    }
  });

  return Game;

});