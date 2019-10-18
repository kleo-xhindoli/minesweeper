export type TileType = "TYPE_BOMB" | "TYPE_NUMBER" | "TYPE_BLANK";

export type Position = { x: number; y: number };

export interface Tile {
  id: string;
  revealed: boolean;
  type: TileType;
  value?: number;
  flag: boolean;
  questionmark: boolean;
  position: Position;
}

export interface Board {
  hTiles: number;
  vTiles: number;
  bombs: number;
  tiles: Tile[][];
}
