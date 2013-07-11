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
    playableGrid: null,
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

      this.newGame();

    },

    newGame: function() {

      this.initializeGrid();

      this.arena.render();
      this.arena.draw(this.grid);

      console.log('Game started !');

    },

    clearGame: function() {

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
          cell = grid.cells[c[0]][c[1]],
          playableGrid = this.getPlayableGrid();


      if(!this.started) return;
      if(client && !this.player.active) return;

      if((playableGrid === null ||
        grid === playableGrid ) &&
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

      var grid = this.grid[x][y];
      console.log('Grid ['+x+','+y+'] has empty space ? : ' + this.grid[x][y].hasEmptySpace());
      if(this.grid[x][y].hasEmptySpace()) {
        this.playableGrid = grid;
      } else {
        this.playableGrid = null;
      }
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

      if(this.player.active) {
        this.arena.drawPlayableArea(null);
      }
    },

    onMoveNao: function(data) {
      var coords = data.coords,
          g = coords.grid,
          c = coords.cell,
          grid = this.grid[g[0]][g[1]],
          cell = grid.cells[c[0]][c[1]],
          playableGrid;

      var player = this.getPlayerFromId(data.playingId);
      console.log('MOVENAO', data);
      if(player && cell) {
        this.arena.drawSymbol(cell, player.symbol);
        cell.activated = true;
        cell.symbol = player.symbol;
        this.setPlayableGrid.apply(this, c);

        this.setPlayerStatus(data.playingId);

        playableGrid = this.getPlayableGrid();

        if(this.player.active) {
          this.arena.drawPlayableArea(playableGrid);
        } else {
          this.arena.clearPlayableArea();
        }
        this.setLines();
        victory = this.isVictory();
        if(victory) {
          alert("Victory :D");
        }
      }
    },

    isVictory: function() {
      var c = this.grid;

      for (var o = 0 ; o < 3 ; o++) {
        if (typeof c[o][0].symbol !== 'undefined' && c[o][0].symbol === c[o][1].symbol && c[o][1].symbol === c[o][2].symbol) {
          return true;
        }
        if (typeof c[0][o].symbol !== 'undefined' && c[0][o].symbol === c[1][o].symbol && c[1][o].symbol === c[2][o].symbol) {
          return true;
        }
      }
      if (typeof c[0][0].symbol !== 'undefined' && c[0][0].symbol === c[1][1].symbol && c[1][1].symbol === c[2][2].symbol) {
        return true;
      }
      if (typeof c[0][2].symbol !== 'undefined' && c[0][2].symbol === c[1][1].symbol && c[1][1].symbol === c[2][0].symbol) {
        return true;
      }

      return false;
    },

    setLines: function() {
      for(var i in this.grid) {
        for(var j in this.grid[i]) {
          var line = this.grid[i][j].getLine();
          if(line) {
            console.log('got line ! ', line);
            this.grid[i][j].activated = true;
            this.grid[i][j].symbol = line.symbol;

            this.arena.drawLine(line);
          }
        }
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

    hasEmptySpace: function() {

      var cell = _.find(this.cells, function(cell, i) {
        return _.find(cell, function(c, j) {
          console.log('Cell['+i+','+j+'] : playable ? ' + !c.activated);
          return !c.activated;
        });
      });

      return !!cell;
    },

    getLine: function() {
      var c = this.cells;
      var line = {};

      for (var o = 0 ; o < 3 ; o++) {
        if (typeof c[o][0].symbol !== 'undefined' && c[o][0].symbol === c[o][1].symbol && c[o][1].symbol === c[o][2].symbol) {
          line.cells = [ c[o][0], c[o][1], c[o][2] ];
          line.symbol = c[o][0].symbol;
        }
        if (typeof c[0][o].symbol !== 'undefined' && c[0][o].symbol === c[1][o].symbol && c[1][o].symbol === c[2][o].symbol) {
          line.cells = [ c[0][o], c[1][o], c[2][o] ];
          line.symbol = c[0][o].symbol;
        }
      }
      if (typeof c[0][0].symbol !== 'undefined' && c[0][0].symbol === c[1][1].symbol && c[1][1].symbol === c[2][2].symbol) {
        line.cells = [ c[0][0], c[1][1], c[2][2] ];
        line.symbol = c[0][0].symbol;
      }
      if (typeof c[0][2].symbol !== 'undefined' && c[0][2].symbol === c[1][1].symbol && c[1][1].symbol === c[2][0].symbol) {
        line.cells = [ c[0][2], c[1][1], c[2][0] ];
        line.symbol = c[0][2].symbol;
      }

      if (typeof line.symbol !== 'undefined') {
        return line;
      } else {
        return false;
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
      return this.cells[cellX][cellY];
    }
  });

  return Game;

});