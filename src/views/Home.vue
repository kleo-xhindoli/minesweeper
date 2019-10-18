<template>
  <div class="home">
    <Header :score="score" :time="timer" />
    <div class="main">
      <Board :board="board" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Board from "@/components/Board.vue";
import Header from "@/components/Header.vue";
import { createBoard } from "@/services/GameService.ts";

export default {
  name: "home",
  data() {
    return {
      timer: 0,
      intervalId: null
    };
  },
  computed: {
    board() {
      return this.$store.state.board;
    },
    score() {
      return this.$store.state.board.bombs - this.$store.getters.totalFlags;
    },
    isGameOver() {
      return this.$store.state.lose || this.$store.getters.win;
    },
    totalRevealed() {
      return this.$store.getters.totalRevealed;
    }
  },
  components: {
    Board,
    Header
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (!this.isGameOver && this.totalRevealed > 0) this.timer++;
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
