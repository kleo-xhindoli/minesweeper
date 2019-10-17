<template>
  <div class="tile" >{{ getDisplay(tile) }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Tile } from "@/types";

@Component
export default class TileComponent extends Vue {
  @Prop() private tile!: Tile;
  @Prop() private x!: number;
  @Prop() private y!: number;

  getDisplay(tile: Tile) {
    if (tile.type === "TYPE_BOMB") return "*";
    if (tile.type === "TYPE_NUMBER") return tile.value;
    return " ";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tile {
  width: 100%;
  height: 100%;
  font-size: 60px;
  line-height: 80px;
  text-align: center;
  font-family: monospace;
}
</style>
