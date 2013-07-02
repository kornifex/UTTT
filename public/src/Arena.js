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
    initialize: function(opt) {

      this.ctx = this.el.getContext('2d');
      this.game = opt.game;

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
     * Draws the actual grid on the canvas. Should also draw recorded moves as well, if any.
     */
    draw: function(grid) {
      for (var i in grid) {
        for (var k in grid[i]) {
          this.drawGrid(grid[i][k]);
        }
      }
    },

    drawGrid: function(grid) {

      var ctx = this.ctx;
      ctx.beginPath();

      /* /!\ WARNING, WALL AHEAD /!\ */
      ctx.moveTo(grid.originX + Math.floor(grid.width / 3), grid.originY + this.padding);
      ctx.lineTo(grid.originX + Math.floor(grid.width / 3), grid.originY + grid.height - this.padding);
      ctx.moveTo(grid.originX + Math.floor(grid.width / 3) * 2, grid.originY + this.padding);
      ctx.lineTo(grid.originX + Math.floor(grid.width / 3) * 2, grid.originY + grid.height - this.padding);
      ctx.moveTo(grid.originX + this.padding, grid.originY + Math.floor(grid.width / 3));
      ctx.lineTo(grid.originX + grid.width - this.padding, grid.originY + Math.floor(grid.width / 3));
      ctx.moveTo(grid.originX + this.padding, grid.originY + Math.floor(grid.width / 3) * 2);
      ctx.lineTo(grid.originX + grid.width - this.padding, grid.originY + Math.floor(grid.width / 3) * 2);

      ctx.stroke();

    },

    drawSymbol: function(cell, symbol) {
      var ctx = this.ctx;
      ctx.beginPath();

      if(symbol === 0) {

        ctx.moveTo(cell.grid.originX + cell.originX + this.padding * 2, cell.grid.originY + cell.originY + this.padding * 2);
        ctx.lineTo(cell.grid.originX + cell.originX + cell.width - this.padding * 2, cell.grid.originY + cell.originY + cell.height - this.padding * 2);
        ctx.moveTo(cell.grid.originX + cell.originX + this.padding * 2, cell.grid.originY + cell.originY + cell.height - this.padding * 2);
        ctx.lineTo(cell.grid.originX + cell.originX + cell.width - this.padding * 2, cell.grid.originY + cell.originY + this.padding * 2);

      } else if (symbol === 1) {

        ctx.arc(
          cell.grid.originX + cell.originX + cell.width / 2,
          cell.grid.originY + cell.originY + cell.height / 2,
          30, 0, 2 * Math.PI, false
        );

      }
      ctx.stroke();
    },

    onClick: function(e) {
      var point = e.touches ? e.touches[0] : e;
      var xGridPos = Math.floor(point.offsetX / (this.el.width / 3));
      var yGridPos = Math.floor(point.offsetY / (this.el.height / 3));
      var xCellPos = Math.floor(point.offsetX / (this.el.width / 9))%3;
      var yCellPos = Math.floor(point.offsetY / (this.el.height / 9))%3;

      this.game.activate({
        grid: [ xGridPos, yGridPos ],
        cell: [ xCellPos, yCellPos ]
      }, true);

    }

  });

  return Arena;

});