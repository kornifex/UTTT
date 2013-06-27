define([
  'underscore',
  'backbone'
], function(
  _,
  Backbone
) {

  var subGrid = function (grid, x, y) {

    this.grid = grid;
    // Position in the main grid [3][3]
    this.xPos = x;
    this.yPos = y;
    this.width = Math.floor(this.grid.el.width / 3);
    this.height = Math.floor(this.grid.el.height / 3);
    // Px origin of the grid inside the canvas
    this.originX = this.xPos * this.width;
    this.originY = this.yPos * this.height;
  };

  subGrid.prototype.draw = function draw () {

    var ctx = this.grid.ctx;
    ctx.beginPath();

    /* /!\ WARNING, WALL AHEAD /!\ */
    ctx.moveTo(this.originX + Math.floor(this.width / 3), this.originY + this.grid.padding);
    ctx.lineTo(this.originX + Math.floor(this.width / 3), this.originY + this.height - this.grid.padding);
    ctx.moveTo(this.originX + Math.floor(this.width / 3) * 2, this.originY + this.grid.padding);
    ctx.lineTo(this.originX + Math.floor(this.width / 3) * 2, this.originY + this.height - this.grid.padding);
    ctx.moveTo(this.originX + this.grid.padding, this.originY + Math.floor(this.width / 3));
    ctx.lineTo(this.originX + this.width - this.grid.padding, this.originY + Math.floor(this.width / 3));
    ctx.moveTo(this.originX + this.grid.padding, this.originY + Math.floor(this.width / 3) * 2);
    ctx.lineTo(this.originX + this.width - this.grid.padding, this.originY + Math.floor(this.width / 3) * 2);

    ctx.stroke();

  };

  return Backbone.View.extend({

    tagName     : 'canvas',
    id          : 'game',
    attributes  : {
      height      : 800,
      width       : 800
    },
    padding     : 10,
    grid        : [],

    initialize: function() {

      this.ctx = this.el.getContext('2d');
      this.initializeGrid();

    },

    render: function() {

      this.draw();

      if (!this.el.parentNode) {
        document.body.appendChild(this.el);
      }
    },

    initializeGrid: function() {

      for (var i = 0 ; i < 3 ; i++) {

        this.grid[i] = [];

        for (var k = 0 ; k < 3 ; k++) {

          this.grid[i][k] = new subGrid(this, i, k);

        }

      }

    },

    draw: function() {

      for (var i in this.grid) {

        for (var k in this.grid[i]) {

          this.grid[i][k].draw();

        }

      }

    }

  });

});