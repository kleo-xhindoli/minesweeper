import Vue from "vue";
import Vuex from "vuex";
import {
  createBoard,
  forEachTile,
  getAdjacentTiles
} from "@/services/GameService";
import { Tile, AppState } from "@/types";

Vue.use(Vuex);

const defaultState: AppState = {
  board: createBoard(17, 10, 30)
};

export default new Vuex.Store({
  state: defaultState,
  mutations: {
    revealTile(state, tile: Tile) {
      const tiles = state.board.tiles[tile.position.x];
      Vue.set(tiles, tile.position.y, { ...tile, revealed: true });
    },
    setTileFlag(state, { tile, flag }: { tile: Tile; flag: boolean }) {
      const tiles = state.board.tiles[tile.position.x];
      Vue.set(tiles, tile.position.y, { ...tile, flag });
    }
  },
  actions: {
    reveal({ commit, dispatch, state }, tile: Tile) {
      if (tile.revealed) return;
      if (tile.type === "TYPE_BOMB") {
        commit("revealTile", tile);
        // Lose game
        return;
      }
      if (tile.type === "TYPE_NUMBER") {
        commit("revealTile", tile);
        return;
      }
      if (tile.type === "TYPE_BLANK") {
        commit("revealTile", tile);
        const adj = getAdjacentTiles(state.board, tile.position);
        adj.forEach(tile => dispatch("reveal", tile));
      }
    },
    revealAdjacent({ dispatch, state }, tile: Tile) {
      if (tile.type !== "TYPE_NUMBER") return;
      if (!tile.value) return;
      const adj = getAdjacentTiles(state.board, tile.position);
      const flagged = adj.filter(t => t.flag);
      if (flagged.length < tile.value) return;
      const notFlagged = adj.filter(t => !t.flag);

      notFlagged.forEach(t => dispatch("reveal", t));
    },
    toggleFlag({ commit }, tile: Tile) {
      commit("setTileFlag", { tile, flag: !tile.flag });
    }
  },
  modules: {}
});
