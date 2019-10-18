import { uniq } from "lodash";
import {
  createBoard,
  createTile,
  forEachTile,
  getAdjacentTiles,
  generateBombPositions,
  isValidPosition
} from "@/services/GameService";
import { Tile, Position, TileType } from "@/types";

const mockTiles = [
  [
    {
      id: "0,0",
      position: { x: 0, y: 0 },
      revealed: false,
      flag: false,
      type: "TYPE_NUMBER",
      questionmark: false,
      value: 1
    },
    {
      id: "0,1",
      position: { x: 0, y: 1 },
      revealed: false,
      flag: false,
      type: "TYPE_NUMBER",
      questionmark: false,
      value: 1
    },
    {
      id: "0,2",
      position: { x: 0, y: 2 },
      revealed: false,
      flag: false,
      type: "TYPE_BLANK",
      questionmark: false
    }
  ],
  [
    {
      id: "1,0",
      position: { x: 1, y: 0 },
      revealed: false,
      flag: false,
      type: "TYPE_BOMB",
      questionmark: false
    },
    {
      id: "1,1",
      position: { x: 1, y: 1 },
      revealed: false,
      flag: false,
      type: "TYPE_NUMBER",
      questionmark: false,
      value: 1
    },
    {
      id: "1,2",
      position: { x: 1, y: 2 },
      revealed: false,
      flag: false,
      type: "TYPE_BLANK",
      questionmark: false
    }
  ],
  [
    {
      id: "2,0",
      position: { x: 2, y: 0 },
      revealed: false,
      flag: false,
      type: "TYPE_NUMBER",
      questionmark: false,
      value: 1
    },
    {
      id: "2,1",
      position: { x: 2, y: 1 },
      revealed: false,
      flag: false,
      type: "TYPE_NUMBER",
      questionmark: false,
      value: 1
    },
    {
      id: "2,2",
      position: { x: 2, y: 2 },
      revealed: false,
      flag: false,
      type: "TYPE_BLANK",
      questionmark: false
    }
  ]
] as any;

const mockBoard = {
  tiles: mockTiles,
  hTiles: 3,
  vTiles: 3,
  bombs: 1
};

describe("unit | Service | GameService", () => {
  describe("generateBombPositions", () => {
    it("generates the given amount of bombs", () => {
      const one = generateBombPositions(5, 6, 1);
      const three = generateBombPositions(5, 6, 3);
      const six = generateBombPositions(5, 6, 6);
      const thirteen = generateBombPositions(5, 6, 13);

      expect(one.length).toBe(1);
      expect(three.length).toBe(3);
      expect(six.length).toBe(6);
      expect(thirteen.length).toBe(13);
    });

    it(`throws when the given number of bombs is greater than the 
      total number of tiles`, () => {
      expect(() => {
        generateBombPositions(3, 3, 10);
      }).toThrow();
    });

    it(`does not generate bomb positions outside of bounds`, () => {
      const ATTEMPTS = 10;
      for (let i = 0; i < ATTEMPTS; i++) {
        const positions = generateBombPositions(2, 3, 3);
        expect(positions.every(p => p.x < 3 && p.y < 3)).toBe(true);
        expect(positions.every(p => p.x >= 0 && p.y >= 0)).toBe(true);
      }
    });

    it(`does not generate duplicate bomb positions`, () => {
      const ATTEMPTS = 10;
      for (let i = 0; i < ATTEMPTS; i++) {
        const positions = generateBombPositions(2, 3, 3);
        const stringPos = positions.map(p => JSON.stringify(p));
        expect(uniq(stringPos).length).toBe(positions.length);
      }
    });

    it("does not generate a bomb in the exclude positions if any are provided", () => {
      const ATTEMPTS = 10;
      const excludePositions = [{ x: 0, y: 0 }];
      for (let i = 0; i < ATTEMPTS; i++) {
        const positions = generateBombPositions(2, 3, 5, excludePositions);

        expect(
          positions.some(
            p => p.x === excludePositions[0].x && p.y === excludePositions[0].y
          )
        ).toBe(false);
      }
    });

    it("throws an error if bombs > total tiles - number of excluded positions", () => {
      const excludePositions = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
      expect(() => {
        generateBombPositions(2, 3, 5, excludePositions);
      }).toThrow();
    });
  });

  describe("createTile", () => {
    let bombs = [
      { x: 1, y: 1 },
      { x: 1, y: 4 },
      { x: 3, y: 2 },
      { x: 4, y: 0 },
      { x: 4, y: 3 }
    ];
    it("creates blank tile", () => {
      const tile = createTile({ x: 10, y: 10 }, bombs);
      expect(tile).toMatchObject({
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false
      });
      expect(tile.value).toBeUndefined();
    });

    it("creates a bomb tile", () => {
      const tile = createTile({ x: 1, y: 1 }, bombs);
      expect(tile).toMatchObject({
        revealed: false,
        flag: false,
        type: "TYPE_BOMB",
        questionmark: false
      });
      expect(tile.value).toBeUndefined();
    });

    it("creates a number tile for 1 adjacent bomb", () => {
      const tile = createTile({ x: 1, y: 3 }, bombs);
      expect(tile).toMatchObject({
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        value: 1,
        questionmark: false
      });
    });

    it("creates a number tile for more than 1 adjacent bomb", () => {
      const tile = createTile({ x: 3, y: 3 }, bombs);
      expect(tile).toMatchObject({
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        value: 2,
        questionmark: false
      });
    });

    it("creates a tile on an edge", () => {
      const tile = createTile({ x: 0, y: 0 }, bombs);
      expect(tile).toMatchObject({
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        value: 1,
        questionmark: false
      });
    });

    it("throws an error when tile position is invalid", () => {
      expect(() => {
        createTile({ x: -1, y: 0 }, bombs);
      }).toThrow();
    });
  });

  describe("getAdjacentTiles", () => {
    it("gives proper adjacent tiles for the middle square", () => {
      const adjTiles = getAdjacentTiles(mockBoard, { x: 1, y: 1 });
      expect(adjTiles.length).toBe(8);
    });

    it("gives proper adjacent tiles for a corner square", () => {
      let adjTiles = getAdjacentTiles(mockBoard, { x: 0, y: 0 });
      expect(adjTiles.length).toBe(3);
      adjTiles = getAdjacentTiles(mockBoard, { x: 0, y: 2 });
      expect(adjTiles.length).toBe(3);
      adjTiles = getAdjacentTiles(mockBoard, { x: 2, y: 2 });
      expect(adjTiles.length).toBe(3);
      adjTiles = getAdjacentTiles(mockBoard, { x: 2, y: 0 });
      expect(adjTiles.length).toBe(3);
    });

    it("gives proper adjacent tiles for a edge square", () => {
      let adjTiles = getAdjacentTiles(mockBoard, { x: 1, y: 0 });
      expect(adjTiles.length).toBe(5);
      adjTiles = getAdjacentTiles(mockBoard, { x: 2, y: 1 });
      expect(adjTiles.length).toBe(5);
      adjTiles = getAdjacentTiles(mockBoard, { x: 1, y: 2 });
      expect(adjTiles.length).toBe(5);
      adjTiles = getAdjacentTiles(mockBoard, { x: 0, y: 1 });
      expect(adjTiles.length).toBe(5);
    });
  });

  describe("forEachTile", () => {
    it(`calls the function for each tile with the correct tile 
      object and position`, () => {
      const mockCb = jest.fn(tile => null);
      forEachTile(mockBoard.tiles, mockCb);
      expect(mockCb.mock.calls.length).toBe(9);
      for (let i = 0; i < 9; i++) {
        expect(mockCb.mock.calls[i][0]).toHaveProperty("type");
      }
    });
  });

  describe("isValidPosition", () => {
    it("returns true for valid positions with no size limit", () => {
      let res = isValidPosition({ x: 0, y: 0 });
      expect(res).toBe(true);
      res = isValidPosition({ x: 1, y: 2 });
      expect(res).toBe(true);
    });
    it("returns false for negative positions with no size limit", () => {
      let res = isValidPosition({ x: -1, y: 0 });
      expect(res).toBe(false);
      res = isValidPosition({ x: 1, y: -2 });
      expect(res).toBe(false);
    });
    it("returns true for valid positions with size limits", () => {
      let res = isValidPosition({ x: 3, y: 4 }, 5, 4);
      expect(res).toBe(true);
      res = isValidPosition({ x: 2, y: 1 }, 2, 3);
      expect(res).toBe(true);
      res = isValidPosition({ x: 0, y: 0 }, 2, 3);
      expect(res).toBe(true);
      res = isValidPosition({ x: 1, y: 1 }, 2, 3);
      expect(res).toBe(true);
    });
    it("returns false for invalid positions with size limits", () => {
      let res = isValidPosition({ x: 4, y: 5 }, 5, 4);
      expect(res).toBe(false);
      res = isValidPosition({ x: 4, y: 1 }, 2, 3);
      expect(res).toBe(false);
      res = isValidPosition({ x: 0, y: -1 }, 2, 3);
      expect(res).toBe(false);
      res = isValidPosition({ x: 1, y: 4 }, 2, 3);
      expect(res).toBe(false);
    });
  });

  describe("createBoard", () => {
    it("creates a valid board state", () => {
      const board = createBoard(3, 4, 2);
      expect(board).toMatchObject({
        hTiles: 3,
        vTiles: 4,
        bombs: 2
      });

      let bombs: Tile[] = [];
      forEachTile(board.tiles, tile => {
        if (tile.type === "TYPE_BOMB") {
          bombs.push(tile);
        }
      });

      expect(bombs.length).toBe(2);

      forEachTile(board.tiles, tile => {
        if (tile.type === "TYPE_BLANK") {
          const adj = getAdjacentTiles(board, tile.position);
          expect(adj.every(t => t.type !== "TYPE_BOMB")).toBe(true);
        }
      });
    });
  });
});
