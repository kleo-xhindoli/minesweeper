import Vue from "vue";
import Vuex from "vuex";
import {
  createBoard,
  getAdjacentTiles,
  forEachTile
} from "@/services/GameService";
import { Tile, AppState, AppContext, Board } from "@/types";
import { board } from "tests/unit/store/test-data/state";

Vue.use(Vuex);

const defaultState: AppState = {
  // Initially the board has no bombs. They will be set
  // after the field is set dirty so that the first tile
  // is never the bomb
  board: createBoard(5, 5, 0),
  lose: false,
  selectedBombs: 8,
  selectedHTiles: 15,
  selectedVTiles: 20,
  isPristine: true
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
  },
  setSelectedBombs(state: AppState, bombs: number) {
    Vue.set(state, "selectedBombs", bombs);
  },
  setSelectedDimensions(
    state: AppState,
    { hTiles, vTiles }: { hTiles: number; vTiles: number }
  ) {
    Vue.set(state, "selectedHTiles", hTiles);
    Vue.set(state, "selectedVTiles", vTiles);
  },
  setPristine(state: AppState, pristine: boolean) {
    Vue.set(state, "isPristine", pristine);
  },
  setBoard(state: AppState, board: Board) {
    Vue.set(state, "board", board);
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
  initialReveal({ commit, dispatch, state }: AppContext, tile: Tile) {
    const { selectedBombs, selectedHTiles, selectedVTiles } = state;
    const newBoard = createBoard(
      selectedHTiles,
      selectedVTiles,
      selectedBombs,
      [tile.position]
    );
    commit("setBoard", newBoard);
    commit("setPristine", false);
    const newTile = state.board.tiles[tile.position.x][tile.position.y];
    dispatch("reveal", newTile);
  },
  newGame(
    { commit, state }: AppContext,
    { hTiles, vTiles, bombs }: { hTiles: number; vTiles: number; bombs: number }
  ) {
    commit("setSelectedDimensions", { hTiles, vTiles });
    commit("setSelectedBombs", bombs);
    const pristineBoard = createBoard(hTiles, vTiles, bombs);
    commit("setBoard", pristineBoard);
    commit("setLose", false);
    commit("setPristine", true);
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
    return getters.totalTiles - state.selectedBombs - getters.totalRevealed;
  },
  remainingBombs: (state: AppState, getters: any) => {
    return state.selectedBombs - getters.totalFlags;
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
