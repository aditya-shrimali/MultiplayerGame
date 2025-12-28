type TokenState = "HOME" | "PATH" | "HOME_PATH" | "FINISHED";

export type TokenMeta = {
  color: "red" | "green" | "yellow" | "blue";
  state: TokenState;
  tokenIndex: number;
  pathIndex: number;
  roundsCompleted: number;
  homePathIndex?: number;
  isMoving: boolean;
  lastUsedRollId: number;
};

