define([
  'underscore',
  'src/BaseClass',
  'src/Arena',
  'src/Player',
  'src/Opponent'
], function(
  _,
  BaseObject,
  Arena,
  Player,
  Opponent
) {
  var Grid;
  var Cell;
  var Game = BaseObject.extend({

    player: null,
    opponent: null,
    grid: [],

    initialize: function(opt) {
      console.info('Game Created !');

      this.client     = opt.client || false;
      this.controller = opt.controller;
      this.socket     = opt.socket;
      this.opponent   = new Opponent();
      this.player     = new Player({
        game    : this,
        socket  : this.socket
      });

      if(this.client) {

        this.socket.on('UT_CONFIRM' , _.bind( this.onConfirm  , this ));
        this.socket.on('UT_STARTNAO', _.bind( this.onStartNao , this ));
        this.socket.on('UT_MOVENAO' , _.bind( this.onMoveNao  , this ));

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

    activate: function(coords, client) {

      var g = coords.grid,
          c = coords.cell,
          grid = this.grid[g[0]][g[1]],
          cell = grid.cells[c[0]][c[1]];


      if(!this.started) return;
      if(client && !this.player.playing) return;

      if((typeof this.getPlayableGrid() === 'undefined' ||
        grid === this.getPlayableGrid() ) &&
        !cell.activated ) {

        if (!this.toggle) this.toggle = 1;


        this.requestMove(coords);

      } else {

        alert('LULZ NOPE');

      }

    },

    requestMove: function(coords) {
      this.socket.emit('UT_MOVE', {id: this.id, coords: coords});
      this.player.idle();
    },

    setPlayableGrid: function(x, y) {
      this.playableGrid = this.grid[x][y];
    },

    getPlayableGrid: function() {
      return this.playableGrid;
    },

    onConfirm: function(data) {

      this.id = data.roomId;
      this.controller.router.navigate('play/' + this.id);

    },

    onStartNao: function(data) {
      var self = this;
      console.log('STARTNAO', data);
      var opponent = _.find(data.players, function(el) {
        return el.id !== self.player.id;
      });
      this.opponent.setId(opponent.id);
      this.opponent.symbol = opponent.symbol;

      this.setPlayerStatus(data.playingId);
      this.start();
    },

    onMoveNao: function(data) {
      var coords = data.coords,
          g = coords.grid,
          c = coords.cell,
          grid = this.grid[g[0]][g[1]],
          cell = grid.cells[c[0]][c[1]];

      var player = this.getPlayerFromId(data.playingId);
      console.log('MOVENAO', data);
      if(player && cell) {
        this.arena.drawSymbol(cell, player.symbol);
        this.setPlayableGrid.apply(this, c);
        cell.activated = true;

        this.setPlayerStatus(data.playingId);
      }
    },

    setPlayerStatus: function(playingId) {

      if(this.player.id === playingId) {
        this.player.playing();
        this.opponent.idle();
      } else {
        this.player.idle();
        this.opponent.playing();
      }

    },

    getPlayerFromId: function(id) {
      if(this.player.id === id) {
        return this.player;
      } else if (this.opponent.id === id) {
        return this.opponent;
      }
    },

    start: function() {

      this.started = true;

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