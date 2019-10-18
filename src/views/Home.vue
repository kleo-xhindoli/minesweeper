<template>
  <div class="home">
    <Board :board="board" />
  </div>
</template>

<script>
// @ is an alias to /src
import Board from "@/components/Board.vue";
import { createBoard } from "@/services/GameService.ts";

export default {
  name: "home",
  computed: {
    board() {
      return this.$store.state.board;
    }
  },
  components: {
    Board
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
