<template>
  <div id="app">
    <h1>Battleships</h1>
    <b-button v-on:click="forceRender()">New Game!</b-button>
    <GameScreen :key="componentKey"/>
  </div>
</template>


<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import GameScreen from "./components/GameScreen.vue";

export default {
  name: "app",
  components: {
    GameScreen
  },
  data() {
    return {
      componentKey: 0
    };
  },
  methods: {
    forceRender() {
      localStorage.removeItem("session_id");
      this.componentKey++;
    }
  },
  mounted() {
    Event.$on("restart-game", () => {
      this.forceRender();
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
