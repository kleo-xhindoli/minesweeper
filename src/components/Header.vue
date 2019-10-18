<template>
  <div class="header">
    <div class="box">
      <div class="item score">{{ score }}</div>
      <div class="item btn">
        <div class="button">RST</div>
      </div>
      <div class="item time">{{ time }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Heder extends Vue {
  @Prop() private score!: number;
  @Prop() private time!: number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: center;
  font-weight: bold;

  .box {
    background: white;
    display: flex;
    border: 4px solid black;
    justify-content: center;
    width: 300px;
    font-size: 32px;

    .item:not(:last-child) {
      border-right: 4px solid black;
    }

    .item {
      flex: 1;
    }

    .button {
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }
    }

    .icon {
      margin-right: 10px;
    }
  }
}
</style>
