<template>
  <canvas v-bind:width="width" v-bind:height="height" v-bind:id="playerName" v-on:click="shoot()"></canvas>
</template>

<script>
import axios from "axios";
import Config from "../config";
import canvasMixin from "../mixins/canvasMixin.vue";

export default {
  name: "BattleBoard",
  mixins: [canvasMixin],
  methods: {
    isAlreadyShot(cell) {
      for (var i = 0; i < this.computerShipWounds.length; i++) {
        let woundCell = this.computerShipWounds[i];
        if (woundCell.x == cell.x && woundCell.y == cell.y) {
          return true;
        }
      }

      for (i = 0; i < this.playerMissedShots.length; i++) {
        let missedShot = this.playerMissedShots[i];
        if (missedShot.x == cell.x && missedShot.y == cell.y) {
          return true;
        }
      }

      return false;
    },
    checkGameStatus() {
      // check game status
      if (this.computerDeadShipCount == 3) {
        alert("you won!");
        Event.$emit("restart-game");
      }

      if (this.playerDeadShipCount == 3) {
        alert("you lost!");
        Event.$emit("restart-game");
      }
    },
    shoot() {
      // don't allow click event on player board
      if (this.playerName == "player") {
        return;
      }

      let payload = {
        x: Math.ceil(event.layerX / this.cellMeasure) - 1,
        y: Math.ceil(event.layerY / this.cellMeasure) - 1
      };

      // check if shot is already fired
      if (this.isAlreadyShot(payload)) {
        alert("already shot here!");
        return;
      }
      axios
        .post(`${Config.shootEndpoint}?session_id=${this.sessionID}`, payload)
        .then(response => {
          const data = response.data;
          payload.is_dead = data.is_dead;

          // update component state
          if (!payload.is_dead) {
            this.playerMissedShots.push(payload);
          } else {
            this.computerShipWounds.push(payload);
          }

          // when computer ship is dead
          if (data.dead_ship) {
            this.computerDeadShips.push(data.dead_ship);
          }

          // render shot on computer board
          this.renderShoot(
            payload,
            data.dead_ship,
            this.getComputerCanvasCtx()
          );

          // render computer shot on player board
          this.renderShoot(
            data.computer_move,
            data.computer_move.dead_ship,
            this.getPlayerCanvasCtx()
          );

          if (data.computer_move.dead_ship) {
            for (var i = 0; i < this.board.battleships.length; i++) {
              if (
                this.board.battleships[i].id == data.computer_move.dead_ship.id
              ) {
                this.board.battleships[i].is_dead = true;
              }
            }
          }

          this.checkGameStatus();
        });
    },
    renderShoot(cell, deadShip, ctx) {
      if (cell.is_dead) {
        this.drawCorrectShot(cell.x, cell.y, ctx);
      } else {
        this.drawMissedShot(cell.x, cell.y, ctx);
      }

      if (deadShip) {
        this.drawShip(deadShip, ctx);
      }
    },
    renderMissedShots(missedShots, ctx) {
      for (var i = 0; i < missedShots.length; i++) {
        let missedShot = missedShots[i];
        this.drawMissedShot(missedShot.x, missedShot.y, ctx);
      }
    },
    renderPlayerBoard() {
      // drawing ships
      for (var i = 0; i < this.board.battleships.length; i++) {
        let battleship = this.board.battleships[i];
        this.drawShip(battleship, this.getPlayerCanvasCtx());

        // draw shots on battleships
        for (var l = 0; l < battleship.cells.length; l++) {
          let cell = battleship.cells[l];
          if (cell.is_dead === true) {
            this.drawCorrectShot(cell.x, cell.y, this.getPlayerCanvasCtx());
          }
        }
      }

      // draw missed shots
      if (this.board.missed_shots) {
        this.renderMissedShots(
          this.board.missed_shots,
          this.getPlayerCanvasCtx()
        );
      }
    },
    renderComputerBoard() {
      if (this.computerShipWounds) {
        for (var i = 0; i < this.computerShipWounds.length; i++) {
          let cell = this.computerShipWounds[i];
          this.drawCorrectShot(cell.x, cell.y, this.getComputerCanvasCtx());
        }
      }

      if (this.computerDeadShips) {
        this.renderComputerDeadShips();
      }

      if (this.playerMissedShots) {
        this.renderMissedShots(
          this.playerMissedShots,
          this.getComputerCanvasCtx()
        );
      }
    },
    renderComputerDeadShips() {
      for (var i = 0; i < this.computerDeadShips.length; i++) {
        let battleship = this.computerDeadShips[i];
        this.drawShip(battleship, this.getComputerCanvasCtx());
      }
    },

    populateState(data) {
      this.board = data.player;
      this.computerShipWounds = [];
      this.computerDeadShips = [];
      this.playerMissedShots = [];

      if (data.computer_ship_wounds) {
        this.computerShipWounds = data.computer_ship_wounds;
      }
      if (data.computer_dead_ships) {
        this.computerDeadShips = data.computer_dead_ships;
      }
      if (data.player_missed_shots) {
        this.playerMissedShots = data.player_missed_shots;
      }
    }
  },
  props: {
    playerName: String
  },
  data() {
    return {
      height: 500,
      width: 500,
      cellCount: 10,
      computerShipWounds: [],
      computerDeadShips: [],
      playerMissedShots: []
    };
  },
  computed: {
    cellMeasure: function() {
      return this.height / this.cellCount;
    },
    sessionID: function() {
      return localStorage.getItem("session_id");
    },
    computerDeadShipCount: function() {
      if (this.computerDeadShips) {
        return this.computerDeadShips.length;
      }
      return 0;
    },
    playerDeadShipCount: function() {
      let count = 0;
      for (var i = 0; i < this.board.battleships.length; i++) {
        if (this.board.battleships[i].is_dead) {
          count++;
        }
      }
      return count;
    }
  },
  mounted() {
    // draw initial 10x10 board
    this.drawCells(this.cellCount);
    Event.$on("load-session", data => {
      this.populateState(data);
      this.renderPlayerBoard();
      this.renderComputerBoard();
    });
  }
};
</script>
<style>
canvas {
  border: 1px solid black;
}
</style>
