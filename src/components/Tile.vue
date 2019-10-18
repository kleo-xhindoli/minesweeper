<template>
  <div
    class="tile"
    @click="handleClick"
    @contextmenu="handleRightClick"
    :class="{ revealed: this.tile.revealed, flag: this.tile.flag }"
  >{{ display }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Tile } from "@/types";

@Component
export default class TileComponent extends Vue {
  @Prop() private tile!: Tile;

  get display() {
    if (this.tile.flag) return "F";
    if (!this.tile.revealed) return " ";
    if (this.tile.type === "TYPE_BOMB") return "*";
    if (this.tile.type === "TYPE_NUMBER") return this.tile.value;
    return " ";
  }

  handleClick() {
    if (this.tile.flag) return;
    if (this.tile.revealed && this.tile.type === "TYPE_NUMBER") {
      this.$store.dispatch("revealAdjacent", this.tile);
    }
    this.$store.dispatch("reveal", this.tile);
  }

  handleRightClick(e: Event) {
    e.preventDefault();
    if (this.tile.revealed) return;
    this.$store.dispatch("toggleFlag", this.tile);
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
  cursor: pointer;
  background: lightgrey;
  user-select: none;

  &.revealed {
    background: white;
  }

  &.flag {
    color: darkred;
  }
}
</style>
