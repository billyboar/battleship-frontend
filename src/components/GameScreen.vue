<template>
  <div class="hello">
    <div class="row justify-content-around">
      <div class="col-md-4 col-sm-4">
        <BattleBoard playerName="player"/>
      </div>
      <div class="col-md-4 col-sm-4">
        <BattleBoard playerName="computer"/>
      </div>
    </div>
  </div>
</template>

<script>
import BattleBoard from "./BattleBoard.vue";
import Config from "../config";
import axios from "axios";
import Vue from "vue";

window.Event = new Vue();

export default {
  name: "GameScreen",
  components: {
    BattleBoard
  },
  asyncComputed: {
    async session() {
      const sessionID = localStorage.getItem("session_id");
      let response;
      if (sessionID) {
        response = axios.get(
          `${Config.sessionEndpoint}?session_id=${sessionID}`
        );
      } else {
        response = axios.post(Config.sessionEndpoint);
      }
      const res = await response;

      localStorage.setItem("session_id", res.data.id);
      Event.$emit("load-session", res.data);
      return res.data;
    }
  },
  data() {
    return {
      session: {}
    };
  }
};
</script>
