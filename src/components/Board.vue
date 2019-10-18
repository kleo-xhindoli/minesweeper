<template>
  <div class="board-grid">
    <div class="board-col" v-for="(col, gridX) in board.tiles" :key="gridX">
      <div class="board-tile" v-for="(tile, gridY) in col" :key="gridY">
        <Tile :tile="tile" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Board, Tile as ITile } from "@/types";
import Tile from "./Tile.vue";

@Component({
  components: {
    Tile
  }
})
export default class BoardComponent extends Vue {
  @Prop() private board!: Board;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.board-grid {
  display: flex;
  border: 4px solid black;
}

.board-col {
  border-right: 4px solid black;

  &:last-child {
    border-right: none;
  }
}

.board-tile {
  width: 80px;
  height: 80px;
  border-bottom: 4px solid black;

  &:last-child {
    border-bottom: 0;
  }
}
</style>
