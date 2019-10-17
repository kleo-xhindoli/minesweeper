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
  data() {
    return {
      board: createBoard(7, 6, 3)
    };
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
