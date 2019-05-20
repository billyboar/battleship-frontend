<script>
export default {
  methods: {
    getCanvasCtx() {
      const canvas = document.getElementById(this.playerName);
      return canvas.getContext("2d");
    },
    getPlayerCanvasCtx() {
      const canvas = document.getElementById("player");
      return canvas.getContext("2d");
    },
    getComputerCanvasCtx() {
      const canvas = document.getElementById("computer");
      return canvas.getContext("2d");
    },
    /*
     * drawCells: draws initial 10x10 cells for each boards
     */
    drawCells(cellCount) {
      const ctx = this.getCanvasCtx();
      const cellMeasure = ctx.canvas.width / cellCount;

      const drawVerticalLine = (ctx, cellNumber, cellMeasure) => {
        ctx.moveTo(cellNumber * cellMeasure, 0);
        ctx.lineTo(cellNumber * cellMeasure, ctx.canvas.height);
        ctx.stroke();
      };

      const drawHorizontalLine = (ctx, cellNumber, cellMeasure) => {
        ctx.moveTo(0, cellNumber * cellMeasure);
        ctx.lineTo(ctx.canvas.width, cellNumber * cellMeasure);
        ctx.stroke();
      };

      for (var i = 1; i < cellCount; i++) {
        ctx.beginPath();
        drawVerticalLine(ctx, i, cellMeasure);
        drawHorizontalLine(ctx, i, cellMeasure);
      }
    },
    /*
     * drawMissedShot: Fills cell with O sign when shot has no success
     */
    drawMissedShot(xCellNumber, yCellNumber, ctx) {
      const xCircleCenter =
        (xCellNumber + 1) * this.cellMeasure - this.cellMeasure / 2;

      const yCircleCenter =
        (yCellNumber + 1) * this.cellMeasure - this.cellMeasure / 2;

      ctx.beginPath();

      ctx.arc(
        xCircleCenter,
        yCircleCenter,
        this.cellMeasure / 10,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = "black";
      ctx.stroke();
    },
    /*
     * drawCorrectShot: Fills cell with X sign when shot is successfully
     * hits a ship
     */
    drawCorrectShot(xCellNumber, yCellNumber, ctx) {
      ctx.strokeStyle = "red";

      ctx.beginPath();

      // drawing right diagonal line
      ctx.moveTo(
        (xCellNumber + 1) * this.cellMeasure,
        yCellNumber * this.cellMeasure
      );
      ctx.lineTo(
        xCellNumber * this.cellMeasure,
        (yCellNumber + 1) * this.cellMeasure
      );
      ctx.stroke();

      // drawing left diagonal line
      ctx.moveTo(
        xCellNumber * this.cellMeasure,
        yCellNumber * this.cellMeasure
      );
      ctx.lineTo(
        (xCellNumber + 1) * this.cellMeasure,
        (yCellNumber + 1) * this.cellMeasure
      );
      ctx.stroke();
    },
    /*
     * drawShip: draws ship on board with given length and orientation
     */
    drawShip(ship, ctx) {
      let width;
      let height;

      if (!ship.is_vertical) {
        width = ship.length * this.cellMeasure;
        height = this.cellMeasure;
      } else {
        width = this.cellMeasure;
        height = ship.length * this.cellMeasure;
      }

      ctx.fillStyle = "blue";
      if (ship.is_dead) {
        ctx.fillStyle = "red";
      }
      ctx.fillRect(
        ship.cells[0].x * this.cellMeasure + 2,
        ship.cells[0].y * this.cellMeasure + 2,
        width - 4,
        height - 4
      );
    }
  }
};
</script>
