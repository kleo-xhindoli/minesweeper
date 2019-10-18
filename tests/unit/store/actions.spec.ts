import { actions } from "@/store";
import { board } from "./test-data/state";
import { AppState } from "@/types";
import { cloneDeep } from "lodash";
import { getAdjacentTiles, forEachTile } from "@/services/GameService";

describe("Unit | Store | Actions", () => {
  let state: AppState = {
    board: cloneDeep(board)
  };
  let dispatch = jest.fn();
  let commit = jest.fn();
  const context = { dispatch, commit, state } as any;
  beforeEach(() => {
    state = {
      board: cloneDeep(board)
    };
    context.state = state;
    dispatch.mockClear();
    commit.mockClear();
  });
  describe("reveal", () => {
    it("will not dispatch/commit anything if the tile is already revealed", () => {
      const tile = state.board.tiles[0][0];
      tile.revealed = true;
      actions.reveal(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(0);
    });

    it(`will dispatch the loseGame action with the selected tile`, () => {
      const bombTile = state.board.tiles[2][2];
      expect(bombTile.type === "TYPE_BOMB").toBe(true);
      actions.reveal(context, bombTile);

      expect(dispatch.mock.calls.length).toBe(1);
      expect(commit.mock.calls.length).toBe(0);
      expect(dispatch.mock.calls[0][0]).toBe("loseGame");
      expect(dispatch.mock.calls[0][1]).toBe(bombTile);
    });

    it(`will commit once revealTile with the same tile as its payload 
      if the tile is a number`, () => {
      const numTile = state.board.tiles[2][1];
      expect(numTile.type === "TYPE_NUMBER").toBe(true);
      actions.reveal(context, numTile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(1);
      expect(commit.mock.calls[0][0]).toBe("revealTile");
      expect(commit.mock.calls[0][1]).toBe(numTile);
    });

    it(`will commit revealTile with the tile in its payload and dispatch itself with 
      all the unrevealed surrounding tiles, when the selected tile is blank`, () => {
      const revealed = state.board.tiles[0][1];
      revealed.revealed = true;
      const selected = state.board.tiles[0][0];
      expect(selected.type === "TYPE_BLANK").toBe(true);
      const unrevealed = getAdjacentTiles(
        state.board,
        selected.position
      ).filter(t => !t.revealed);

      actions.reveal(context, selected);

      expect(dispatch.mock.calls.length).toBe(unrevealed.length);
      expect(commit.mock.calls.length).toBe(1);
      expect(commit.mock.calls[0][0]).toBe("revealTile");
      expect(commit.mock.calls[0][1]).toBe(selected);
    });
  });

  describe("revealAdjacent", () => {
    it("will not dispatch/commit anything if the tile isn't a number", () => {
      const tile = state.board.tiles[0][0];
      expect(tile.type === "TYPE_NUMBER").toBe(false);

      actions.revealAdjacent(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(0);
    });

    it(`will not dispatch/commit anything if the number of adjacent
      flags is greater than the tile's value`, () => {
      const tile = state.board.tiles[1][2];
      expect(tile.type === "TYPE_NUMBER").toBe(true);
      expect(tile.value).toBe(2);

      const adj = getAdjacentTiles(state.board, tile.position);
      adj[0].flag = true;
      adj[1].flag = true;
      adj[2].flag = true;

      actions.revealAdjacent(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(0);
    });

    it(`will not dispatch/commit anything if the number of adjacent
      flags is less than the tile's value`, () => {
      const tile = state.board.tiles[1][2];
      expect(tile.type === "TYPE_NUMBER").toBe(true);
      expect(tile.value).toBe(2);

      const adj = getAdjacentTiles(state.board, tile.position);
      adj[0].flag = true;

      actions.revealAdjacent(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(0);
    });

    it(`will dispatch reveal with the all the unflagged surrounding tiles
      if the number of surrounding flags matches the tile's value`, () => {
      const tile = state.board.tiles[1][2];
      expect(tile.type === "TYPE_NUMBER").toBe(true);
      expect(tile.value).toBe(2);

      tile.revealed = true;
      const adj = getAdjacentTiles(state.board, tile.position);
      adj[0].flag = true;
      adj[1].flag = true;

      actions.revealAdjacent(context, tile);

      expect(dispatch.mock.calls.length).toBe(adj.length - 2);
      expect(dispatch.mock.calls[0][0]).toBe("reveal");
      expect(commit.mock.calls.length).toBe(0);
    });
  });

  describe("toggleFlag", () => {
    it("will not dispatch/commit anything if the selected tile is already revealed", () => {
      const tile = state.board.tiles[0][0];
      tile.revealed = true;

      actions.toggleFlag(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(0);
    });

    it(`will commit setTileFlag true if the selected tile isn't flagged`, () => {
      const tile = state.board.tiles[0][0];
      tile.flag = false;

      actions.toggleFlag(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(1);
      expect(commit.mock.calls[0][0]).toBe("setTileFlag");
      expect(commit.mock.calls[0][1]).toMatchObject({ tile, flag: true });
    });

    it(`will commit setTileFlag false if the selected tile is flagged`, () => {
      const tile = state.board.tiles[0][0];
      tile.flag = true;

      actions.toggleFlag(context, tile);

      expect(dispatch.mock.calls.length).toBe(0);
      expect(commit.mock.calls.length).toBe(1);
      expect(commit.mock.calls[0][0]).toBe("setTileFlag");
      expect(commit.mock.calls[0][1]).toMatchObject({ tile, flag: false });
    });
  });

  describe("loseGame", () => {
    it("will not commit/dispatch if the tile isnt a bomb", () => {
      const tile = state.board.tiles[2][1];
      expect(tile.type === 'TYPE_BOMB').toBe(false)

      actions.loseGame(context, tile);
      expect(commit.mock.calls.length).toBe(0);
      expect(dispatch.mock.calls.length).toBe(0);
    })
    it("will commit revealTile on all the tiles", () => {
      const tile = state.board.tiles[2][2];
      expect(tile.type === 'TYPE_BOMB').toBe(true)

      actions.loseGame(context, tile);
      expect(commit.mock.calls.length).toBe(state.board.vTiles * state.board.hTiles);
      expect(dispatch.mock.calls.length).toBe(0);
    })
  })
});
