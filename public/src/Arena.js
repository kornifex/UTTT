define([
  'underscore',
  'backbone'
], function(
  _,
  Backbone
) {

  var Grid;
  var Cell;
  var Arena = Backbone.View.extend({

    tagName     : 'canvas',
    id          : 'game',
    attributes  : {
      height      : 800,
      width       : 800
    },
    events      : {
      'click'     : 'onClick'
    },
    padding     : 10,
    grid        : [],

    /**
     * Creates an instance of Arena.
     *
     * @constructor
     * @this {Arena}
     */
    initialize: function() {

      this.ctx = this.el.getContext('2d');
      this.toggle = 1;
      this.initializeGrid();

    },

    /**
     * Renders the view in the DOM sense : append the canvas to the DOM and trigger a draw().
     */
    render: function() {

      this.draw();

      if (!this.el.parentNode) {
        document.body.appendChild(this.el);
      }
    },

    /**
     * Creates the logical structure of the grid on which draw() is based.
     */
    initializeGrid: function() {

      for (var i = 0 ; i < 3 ; i++) {
        this.grid[i] = [];
        for (var k = 0 ; k < 3 ; k++) {
          this.grid[i][k] = new Grid(this, i, k);
        }
      }

    },
    /**
     * Draws the actual grid on the canvas. Should also draw recorded moves as well, if any.
     */
    draw: function() {

      for (var i in this.grid) {
        for (var k in this.grid[i]) {

          this.grid[i][k].draw();

        }
      }

    },

    onClick: function(e) {
      var point = e.touches ? e.touches[0] : e;
      var xPos = Math.floor(point.offsetX / (this.el.width / 3));
      var yPos = Math.floor(point.offsetY / (this.el.height / 3));
      var grid = this.grid[xPos][yPos];
      var symbol = 1;

      grid.drawSymbol(point.offsetX, point.offsetY, this.toggle *= -1);
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
  Cell.prototype.drawSymbol = function(symbol) {

    var ctx = this.grid.arena.ctx;
    ctx.beginPath();

    if(symbol === -1) {
      console.log(this.originX, this.originY);

      ctx.moveTo(this.grid.originX + this.originX + this.grid.arena.padding * 2, this.grid.originY + this.originY + this.grid.arena.padding * 2);
      ctx.lineTo(this.grid.originX + this.originX + this.width - this.grid.arena.padding * 2, this.grid.originY + this.originY + this.height - this.grid.arena.padding * 2);
      ctx.moveTo(this.grid.originX + this.originX + this.grid.arena.padding * 2, this.grid.originY + this.originY + this.height - this.grid.arena.padding * 2);
      ctx.lineTo(this.grid.originX + this.originX + this.width - this.grid.arena.padding * 2, this.grid.originY + this.originY + this.grid.arena.padding * 2);

    } else if (symbol === 1) {

      ctx.arc(
        this.grid.originX + this.originX + this.width / 2,
        this.grid.originY + this.originY + this.height / 2,
        30, 0, 2 * Math.PI, false
      );

    }

    ctx.stroke();
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
  Grid.prototype.initCells = function initCells () {
    for (var i = 0 ; i < 3 ; i++) {
      this.cells[i] = [];
      for (var k = 0 ; k < 3 ; k++) {
        this.cells[i][k] = new Cell(this, i, k);
      }
    }
  };
  Grid.prototype.draw = function draw () {

    var ctx = this.arena.ctx;
    ctx.beginPath();

    /* /!\ WARNING, WALL AHEAD /!\ */
    ctx.moveTo(this.originX + Math.floor(this.width / 3), this.originY + this.arena.padding);
    ctx.lineTo(this.originX + Math.floor(this.width / 3), this.originY + this.height - this.arena.padding);
    ctx.moveTo(this.originX + Math.floor(this.width / 3) * 2, this.originY + this.arena.padding);
    ctx.lineTo(this.originX + Math.floor(this.width / 3) * 2, this.originY + this.height - this.arena.padding);
    ctx.moveTo(this.originX + this.arena.padding, this.originY + Math.floor(this.width / 3));
    ctx.lineTo(this.originX + this.width - this.arena.padding, this.originY + Math.floor(this.width / 3));
    ctx.moveTo(this.originX + this.arena.padding, this.originY + Math.floor(this.width / 3) * 2);
    ctx.lineTo(this.originX + this.width - this.arena.padding, this.originY + Math.floor(this.width / 3) * 2);

    ctx.stroke();

  };
  Grid.prototype.drawSymbol = function drawSymbol (x, y, symbol) {

    var point = this.getRelativePoint(x, y);
    var cell = this.getCell(point.x, point.y);

    cell.drawSymbol(symbol);

  };
  Grid.prototype.getRelativePoint = function getRelativePoint (x, y) {
    return {
      x: x - this.originX,
      y: y - this.originY
    };
  };
  Grid.prototype.getCell = function getCell (x, y) {
    var cellX = Math.floor(x / (this.width / 3));
    var cellY = Math.floor(y / (this.height / 3));
    console.log('Cell', cellX, cellY);
    return this.cells[cellX][cellY];

  };

  return Arena;

});