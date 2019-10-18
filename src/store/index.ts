import Vue from "vue";
import Vuex from "vuex";
import { createBoard, getAdjacentTiles } from "@/services/GameService";
import { Tile, AppState, AppContext } from "@/types";

Vue.use(Vuex);

const defaultState: AppState = {
  board: createBoard(5, 5, 4)
};

export const mutations = {
  revealTile(state: AppState, tile: Tile) {
    const tiles = state.board.tiles[tile.position.x];
    Vue.set(tiles, tile.position.y, { ...tile, revealed: true });
  },
  setTileFlag(state: AppState, { tile, flag }: { tile: Tile; flag: boolean }) {
    const tiles = state.board.tiles[tile.position.x];
    Vue.set(tiles, tile.position.y, { ...tile, flag });
  }
};

export const actions = {
  reveal({ commit, dispatch, state }: AppContext, tile: Tile) {
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
      const adj = getAdjacentTiles(state.board, tile.position).filter(
        t => !t.revealed
      );
      adj.forEach(tile => dispatch("reveal", tile));
    }
  },
  revealAdjacent({ dispatch, state }: AppContext, tile: Tile) {
    if (tile.type !== "TYPE_NUMBER") return;
    if (!tile.value) return;
    const adj = getAdjacentTiles(state.board, tile.position);
    const flagged = adj.filter(t => t.flag);
    if (flagged.length !== tile.value) return;
    const notFlagged = adj.filter(t => !t.flag);

    notFlagged.forEach(t => dispatch("reveal", t));
  },
  toggleFlag({ commit }: AppContext, tile: Tile) {
    if (tile.revealed) return;
    commit("setTileFlag", { tile, flag: !tile.flag });
  }
};

export default new Vuex.Store({
  state: defaultState,
  mutations,
  actions,
  modules: {}
});
