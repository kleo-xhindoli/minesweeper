import Vue from "vue";
import Vuex from "vuex";
import {
  createBoard,
  getAdjacentTiles,
  forEachTile
} from "@/services/GameService";
import { Tile, AppState, AppContext } from "@/types";

Vue.use(Vuex);

const defaultState: AppState = {
  board: createBoard(5, 5, 4),
  lose: false
};

export const mutations = {
  revealTile(state: AppState, tile: Tile) {
    const tiles = state.board.tiles[tile.position.x];
    Vue.set(tiles, tile.position.y, { ...tile, revealed: true });
  },
  setTileFlag(state: AppState, { tile, flag }: { tile: Tile; flag: boolean }) {
    const tiles = state.board.tiles[tile.position.x];
    Vue.set(tiles, tile.position.y, { ...tile, flag });
  },
  setLose(state: AppState, set: boolean) {
    // Lose could be `computed` but it's easer to trigger
    // it after a bomb has been revealed
    Vue.set(state, "lose", set);
  }
};

export const actions = {
  reveal({ commit, dispatch, state }: AppContext, tile: Tile) {
    if (tile.revealed) return;

    switch (tile.type) {
      case "TYPE_BOMB": {
        // lose condition
        dispatch("loseGame", tile);
        return;
      }
      case "TYPE_NUMBER": {
        commit("revealTile", tile);
        return;
      }
      case "TYPE_BLANK": {
        commit("revealTile", tile);
        const adj = getAdjacentTiles(state.board, tile.position).filter(
          t => !t.revealed
        );
        adj.forEach(tile => dispatch("reveal", tile));
      }
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
  },
  loseGame({ commit, state }: AppContext, tile: Tile) {
    if (tile.type !== "TYPE_BOMB") return;
    forEachTile(state.board.tiles, t => {
      commit("revealTile", t);
    });
    commit("setLose", true);
    // TODO: mark `tile` as loseGame
    // TODO: score
  }
};

export const getters = {
  totalRevealed: (state: AppState) => {
    let total = 0;
    forEachTile(state.board.tiles, t => {
      if (t.revealed) total++;
    });
    return total;
  },
  totalFlags: (state: AppState) => {
    let total = 0;
    forEachTile(state.board.tiles, t => {
      if (t.flag) total++;
    });
    return total;
  },
  totalTiles: (state: AppState) => {
    return state.board.vTiles * state.board.hTiles;
  },
  remainingBlanks: (state: AppState, getters: any) => {
    return getters.totalTiles - state.board.bombs - getters.totalRevealed;
  },
  win: (state: AppState, getters: any) => {
    return getters.remainingBlanks === 0;
  }
};

export default new Vuex.Store({
  state: defaultState,
  mutations,
  actions,
  modules: {},
  getters
});
