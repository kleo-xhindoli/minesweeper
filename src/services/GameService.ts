import { random } from "lodash";
import uuid from "uuid/v4";

import { Board, Position, Tile } from "../types";

// Helper Functions ==========================================================

export function forEachTile(
  board: Board,
  fn: (tile: Tile, pos: Position) => any
) {
  for (let x = 0; x < board.vTiles; x++) {
    for (let y = 0; y < board.hTiles; y++) {
      const tile = { ...board.tiles[x][y] }; // clone the tile
      fn(tile, { x, y });
    }
  }
}

export function isValidPosition(p: Position, hSize?: number, vSize?: number) {
  if (p.x < 0 || p.y < 0) return false;
  if (vSize && p.x >= vSize) return false;
  if (hSize && p.y >= hSize) return false;
  return true;
}

function isBomb(pos: Position, bombPositions: Position[]) {
  if (!isValidPosition(pos)) return false;
  return bombPositions.some(bpos => bpos.x === pos.x && bpos.y === pos.y);
}

export function getAdjacentTiles(board: Board, position: Position): Tile[] {
  const pos = [
    // top left
    { x: position.x - 1, y: position.y + 1 },
    // top middle
    { x: position.x, y: position.y + 1 },
    // top right
    { x: position.x + 1, y: position.y + 1 },
    // left
    { x: position.x - 1, y: position.y },
    // right
    { x: position.x + 1, y: position.y },
    // bottom left
    { x: position.x - 1, y: position.y - 1 },
    // bottom middle
    { x: position.x, y: position.y - 1 },
    // bottom right
    { x: position.x + 1, y: position.y - 1 }
  ];

  const valid = pos.filter(p => isValidPosition(p, board.hTiles, board.vTiles));
  return valid.map(p => board.tiles[p.x][p.y]);
}

// Generator Functions ==========================================================

export function generateBombPositions(
  hTiles: number,
  vTiles: number,
  bombs: number
): Position[] {
  if (bombs > hTiles * vTiles) {
    throw new Error("Cannot have more bombs than tiles");
  }
  let positions: Position[] = [];
  while (positions.length < bombs) {
    const x = random(0, vTiles - 1);
    const y = random(0, hTiles - 1);
    if (!positions.some(p => p.x === x && p.y === y)) {
      positions.push({ x, y });
    }
  }
  return positions;
}

export function createTile(
  position: Position,
  bombPositions: Position[]
): Tile {
  const checkBomb = (check: Position) => {
    return isBomb(check, bombPositions);
  };

  if (!isValidPosition(position)) throw new Error("Invalid tile position");

  const tile: Tile = {
    id: uuid(),
    revealed: false,
    flag: false,
    type: "TYPE_BLANK",
    questionmark: false
  };

  if (checkBomb(position)) {
    tile.type = "TYPE_BOMB";
    return tile;
  }
  let neighbourBombs = 0;
  // top left
  if (checkBomb({ x: position.x - 1, y: position.y + 1 })) neighbourBombs++;
  // top middle
  if (checkBomb({ x: position.x, y: position.y + 1 })) neighbourBombs++;
  // top right
  if (checkBomb({ x: position.x + 1, y: position.y + 1 })) neighbourBombs++;
  // left
  if (checkBomb({ x: position.x - 1, y: position.y })) neighbourBombs++;
  // right
  if (checkBomb({ x: position.x + 1, y: position.y })) neighbourBombs++;
  // bottom left
  if (checkBomb({ x: position.x - 1, y: position.y - 1 })) neighbourBombs++;
  // bottom middle
  if (checkBomb({ x: position.x, y: position.y - 1 })) neighbourBombs++;
  // bottom right
  if (checkBomb({ x: position.x + 1, y: position.y - 1 })) neighbourBombs++;

  if (neighbourBombs > 0) {
    tile.type = "TYPE_NUMBER";
    tile.value = neighbourBombs;
  }

  return tile;
}

export function createBoard(
  hTiles: number,
  vTiles: number,
  bombs: number
): Board {
  const bombPositions = generateBombPositions(hTiles, vTiles, bombs);

  let tiles: Tile[][] = [];

  for (let x = 0; x < vTiles; x++) {
    tiles[x] = [];
    for (let y = 0; y < hTiles; y++) {
      tiles[x][y] = createTile({ x, y }, bombPositions);
    }
  }

  return {
    hTiles,
    vTiles,
    bombs,
    tiles
  };
}
