import { Application, Graphics } from "pixi.js";
import { TokenMeta } from "./types";
import { DiceStore } from "../gameStore";


const GRID_SIZE = 15;
const CELL_SIZE = 40;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;
const SAFE_COLOR = 0xdddddd;

const RED = 0xff4d4f;
const GREEN = 0x52c41a;
const YELLOW = 0xfadb14;
const BLUE = 0x1890ff;

const TOKEN_RADIUS = 0.8 * CELL_SIZE; // Slightly smaller than home circle for perfect centering and visible gap

type Cell = { x: number; y: number };


type TokenGraphic = Graphics & {
  tokenData: TokenMeta;
}



const MAIN_PATH: Cell[] = [
   // 🔴 RED START (top center, going down)
  { x: 6, y: 1 },
  { x: 6, y: 2 },
  { x: 6, y: 3 },
  { x: 6, y: 4 },
  { x: 6, y: 5 },
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
  { x: 2, y: 6 },
  { x: 1, y: 6 },
  { x: 0, y: 6 },

  // turn
  { x: 0, y: 7 },

 // 🟢 GREEN SIDE (left → right)
  { x: 0, y: 8 },{ x: 1, y: 8 },{ x: 2, y: 8 },{ x: 3, y: 8 },{ x: 4, y: 8 },{ x: 5, y: 8 },

  { x: 6, y: 9 },{ x: 6, y: 10 },{ x: 6, y: 11 },{ x: 6, y: 12 },{ x: 6, y: 13 },{ x: 6, y: 14 },

  // turn
  { x: 7, y: 14 },

  // 🟡 YELLOW SIDE (bottom → top)
  { x: 8, y: 14 },{ x: 8, y: 13 },{ x: 8, y: 12 },{ x: 8, y: 11 },{ x: 8, y: 10 },{ x: 8, y: 9 },

  { x: 9, y: 8 },{ x: 10, y: 8 },{ x: 11, y: 8 },{ x: 12, y: 8 },{ x: 13, y: 8 },{ x: 14, y: 8 },

  // turn
  { x: 14, y: 7 },

   // 🔵 BLUE SIDE (right → left)
  { x: 14, y: 6 },{ x: 13, y: 6 },{ x: 12, y: 6 },{ x: 11, y: 6 },{ x: 10, y:6 },{ x: 9, y: 6 },

  { x: 8, y: 5 },{ x: 8, y: 4 },{ x: 8, y: 3 },{ x: 8, y: 2 },{ x: 8, y: 1 },{ x:8, y: 0 },

  // turn back to red start
  { x: 7, y: 0 }, { x: 6, y: 0 }
].reverse();

export const HOME_PATHS: Record<string, Cell[]> = {
  red: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 }, // center entry
  ],

  green: [
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
    { x: 7, y: 6 },
  ],

  yellow: [
    { x: 13, y: 7 },
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7  },
  ],

  blue: [
    { x: 7, y: 13 },
    { x: 7, y: 12 },
    { x: 7, y: 11 },
    { x: 7, y: 10 },
    { x: 7, y: 9 },
    { x: 7, y: 8 },
  ],
};


const HOME_ENTRY : Record<string,Cell> ={
  red: {x:1, y:6},
  green: {x:8, y:1},
  yellow: {x:13, y:8},
  blue: {x:6, y:13},
}

function findIndex(cell: Cell): number {
  return MAIN_PATH.findIndex(
    c => c.x === cell.x && c.y === cell.y
  );
}

export const START_INDEX:Record<string, number> = {
  red: findIndex({x:1, y:6}),
  green: findIndex({x:8, y:1}),
  yellow: findIndex({x:13, y:8}),
  blue: findIndex({x:6, y:13})
}

// Note: Application is deprecated in PixiJS v7+, but is still available in most builds.
export async function createLudoBoard(container: HTMLDivElement){
  const app = new Application();
  
  await app.init({
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: 0xffffff,
    antialias: true,
  });
  
  container.innerHTML = ""; //clear previoud canvas
  container.appendChild(app.canvas);

  drawGrid(app);
  drawHomes(app);
  drawMainPath(app);
  drawHomePaths(app);
  drawHomeEntryCells(app);
  drawColoredCenter(app);
  drawHomeCircles(app);
  drawHomeTokens(app);
}



function drawGrid(app: Application){
  const grid = new Graphics();
  grid.lineStyle(1, 0x000000);

  for(let i=0; i<=GRID_SIZE; i++){
    //vertical lines
    grid.moveTo(i*CELL_SIZE,0);
    grid.lineTo(i*CELL_SIZE, BOARD_SIZE);

    //horizontal lines
    grid.moveTo(0,i*CELL_SIZE);
    grid.lineTo(BOARD_SIZE, i*CELL_SIZE);
  }

  app.stage.addChild(grid);
}

function drawHomes(app: Application){
  drawHome(app, 0, 0, 0xff4f4f); // Red Home
  drawHome(app, 9, 0, 0x52c41a); // Green Home
  drawHome(app, 9, 9, 0xfadb14); // Yellow Home
  drawHome(app, 0, 9, 0x1890ff); // Blue Home
}

function drawHome(app: Application, gridX: number, gridY: number, color: number){
  const home = new Graphics();
  home.beginFill(color);
  home.drawRect(gridX*CELL_SIZE, gridY*CELL_SIZE, CELL_SIZE*6, CELL_SIZE*6);
  home.endFill();

  app.stage.addChild(home);
}


function drawMainPath(app: Application){
  MAIN_PATH.forEach((cell)=>{
    drawCell(app, cell.x, cell.y, SAFE_COLOR);
  });
}


function drawHomePaths(app: Application){
  HOME_PATHS.red.forEach(cell =>
    drawCell(app, cell.x, cell.y, RED)
  );

  HOME_PATHS.green.forEach(cell =>
    drawCell(app, cell.x, cell.y, GREEN)
  );

  HOME_PATHS.yellow.forEach(cell =>
    drawCell(app, cell.x, cell.y, YELLOW)
  );

  HOME_PATHS.blue.forEach(cell =>
    drawCell(app, cell.x, cell.y, BLUE)
  );
}

function drawColoredCenter(app: Application){
  const centerX = 6 * CELL_SIZE;
  const centerY = 6 * CELL_SIZE;
  const centerSize = 3 * CELL_SIZE;

  drawTriangle(app, centerX, centerY, centerSize, GREEN, "top");
  drawTriangle(app, centerX, centerY, centerSize, YELLOW, "right");
  drawTriangle(app, centerX, centerY, centerSize, BLUE, "bottom");
  drawTriangle(app, centerX, centerY, centerSize, RED, "left");
}

function drawTriangle(app: Application, x: number, y: number, size: number, color: number, direction: "top" | "right" | "bottom" | "left"){
  const triangle = new Graphics();
  triangle.beginFill(color);

  switch(direction){
    case "top":
      triangle.moveTo(x, y);
      triangle.lineTo(x + size, y);
      triangle.lineTo(x + size/2, y + size);
      break;
  
    case "right":
      triangle.moveTo(x + size, y);
      triangle.lineTo(x + size, y + size);
      triangle.lineTo(x + size/2, y + size/2);
      break;

    case "bottom":
      triangle.moveTo(x, y + size);
      triangle.lineTo(x + size, y + size);
      triangle.lineTo(x + size/2, y + size/2);
      break;

    case "left":
      triangle.moveTo(x, y);
      triangle.lineTo(x, y + size);
      triangle.lineTo(x + size/2, y + size/2);
      break;
  }
  
  triangle.endFill();
  app.stage.addChild(triangle);
}

function drawHomeCircles(app: Application){
  drawCirclesForHome(app, 0, 0, RED);
  drawCirclesForHome(app, 9, 0, GREEN);
  drawCirclesForHome(app, 9, 9, YELLOW);
  drawCirclesForHome(app, 0, 9, BLUE);
}

function drawCirclesForHome(app: Application, gridX: number, gridY: number, color: number){

  const homeX = gridX * CELL_SIZE;
  const homeY = gridY * CELL_SIZE;

  const circleSize = 2 * CELL_SIZE;
  const gap = 1 * CELL_SIZE;
  const padding = 0.5 * CELL_SIZE;

  for(let row=0; row<2; row++){
    for(let col=0; col<2; col++){
      const cx = homeX + padding + col * (circleSize + gap) + circleSize / 2;
      const cy = homeY + padding + row * (circleSize + gap) + circleSize / 2;

      const circle = new Graphics();
      circle.lineStyle(3, color);
      circle.beginFill(0xffffff);
      circle.drawCircle(cx, cy, circleSize / 2);
      circle.endFill();

      app.stage.addChild(circle);
    }
  }
}

function drawHomeEntryCells(app: Application){
  drawEntry(app, HOME_ENTRY.red, RED);
  drawEntry(app, HOME_ENTRY.green, GREEN);
  drawEntry(app, HOME_ENTRY.yellow, YELLOW);
  drawEntry(app, HOME_ENTRY.blue, BLUE);
}

function drawEntry(app: Application, cell: Cell, color: number){
  const entry = new Graphics();
  entry.beginFill(color);
  entry.drawRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  entry.endFill();

  app.stage.addChild(entry);
}

function drawCell(app: Application, x: number, y: number, color: number){
  const cell = new Graphics();
  cell.beginFill(color);
  cell.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  cell.endFill();

  app.stage.addChild(cell);
}

function createTokenGraphic(color:number){
  const token = new Graphics();
  // outer border
  token.lineStyle(3, 0x000000);
  token.beginFill(color);
  token.drawCircle(0, 0, TOKEN_RADIUS);
  token.endFill();

  // small shine (optional but nice)
  token.beginFill(0xffffff, 0.25);
  token.drawCircle(-TOKEN_RADIUS / 4, -TOKEN_RADIUS / 4, TOKEN_RADIUS / 3);
  token.endFill();
  return token;
}

function getHomeTokenPositions(gridX: number, gridY: number) {
  const homeX = gridX * CELL_SIZE;
  const homeY = gridY * CELL_SIZE;

  const circleSize = 2 * CELL_SIZE;
  const gap = 1 * CELL_SIZE;
  const padding = 0.5 * CELL_SIZE;

  const positions: { x: number; y: number }[] = [];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      positions.push({
        x: homeX + padding + col * (circleSize + gap) + circleSize / 2,
        y: homeY + padding + row * (circleSize + gap) + circleSize / 2,
      });
    }
  }

  return positions;
}

function drawHomeTokens(app:Application){
  spawnTokens(app, "red", 0, 0);
  spawnTokens(app, "green", 9, 0);
  spawnTokens(app, "yellow", 9, 9);
  spawnTokens(app, "blue", 0, 9);
}

const TOKEN_COLOR_MAP:Record<string, number> = {
  red: RED,
  green: GREEN,
  yellow: YELLOW,
  blue: BLUE
}

function spawnTokens(app:Application, color:"red" | "green" | "yellow" | "blue", gridX:number, gridY:number){
  const positions = getHomeTokenPositions(gridX, gridY);

  positions.forEach((pos, index)=>{
    const token = createTokenGraphic(TOKEN_COLOR_MAP[color]) as TokenGraphic;
    token.x = pos.x;
    token.y = pos.y;
    token.tokenData={
      color, state:"HOME", tokenIndex:index, pathIndex:-1, isMoving:false, roundsCompleted:0, lastUsedRollId:-1
    }

    token.interactive = true;
    token.cursor = 'pointer';

    token.on('pointerdown', () => {
      handleTokenClick(token);
    });

    app.stage.addChild(token);
  });
}

function consumeDice(){
  DiceStore.value = null;
}

function handleTokenClick(token: TokenGraphic){

  if(DiceStore.value == null) return;
  if(token.tokenData.isMoving) return;

  const dice = DiceStore.value;

  /**
   * CASE 1: TOKEN IS IN HOME
   */

 if (token.tokenData.state === "HOME") {
    // only allow exit on 6
    if (dice !== 6) return;

    const startIndex = START_INDEX[token.tokenData.color];
    const entryCell = MAIN_PATH[startIndex];

    token.x = entryCell.x * CELL_SIZE + CELL_SIZE / 2;
    token.y = entryCell.y * CELL_SIZE + CELL_SIZE / 2;

    token.tokenData.state = "PATH";
    token.tokenData.pathIndex = startIndex;
    
    DiceStore.value = null;
    return;
  }

  /**
   * CASE 2: TOKEN IS ON MAIN PATH
   */
  if (token.tokenData.state === "PATH") {
    moveTokenSteps(token, dice);
    return;
  }

  if(token.tokenData.state === "HOME_PATH"){
    moveAlongHomePath(token, dice);
  }
}

function moveTokenToPathIndex(token: TokenGraphic, index: number) {
  const cell = MAIN_PATH[index];

  token.x = cell.x * CELL_SIZE + CELL_SIZE / 2;
  token.y = cell.y * CELL_SIZE + CELL_SIZE / 2;

  token.tokenData.pathIndex = index;
}


function moveTokenSteps(token: TokenGraphic, steps: number) {
  if (token.tokenData.isMoving) return;
  token.tokenData.isMoving = true;

  let remaining = steps;

  function nextStep() {
    if (remaining === 0) {
      token.tokenData.isMoving = false;
      DiceStore.value = null;
      return;
    }


    const color = token.tokenData.color;
    const startIndex = START_INDEX[color];

    const entryIndex =
      (startIndex - 2 + MAIN_PATH.length) % MAIN_PATH.length;

    // 🚪 HOME ENTRY CHECK (CRITICAL)
    if (
      token.tokenData.state === "PATH" &&
      token.tokenData.pathIndex === entryIndex
    ) {
      token.tokenData.state = "HOME_PATH";
      token.tokenData.homePathIndex = 0;

      const homeCell = HOME_PATHS[color][0];
      token.x = homeCell.x * CELL_SIZE + CELL_SIZE / 2;
      token.y = homeCell.y * CELL_SIZE + CELL_SIZE / 2;

      remaining--;
      setTimeout(nextStep, 200);
      return;
    }

    // ➡️ NORMAL MAIN PATH MOVE
    if (token.tokenData.state === "PATH") {
      const nextIndex =
        (token.tokenData.pathIndex + 1) % MAIN_PATH.length;

      token.tokenData.pathIndex = nextIndex;
      const cell = MAIN_PATH[nextIndex];

      token.x = cell.x * CELL_SIZE + CELL_SIZE / 2;
      token.y = cell.y * CELL_SIZE + CELL_SIZE / 2;

      remaining--;
      setTimeout(nextStep, 200);
      return;
    }

    // 🏠 HOME PATH MOVE
    if (token.tokenData.state === "HOME_PATH") {
      const nextHomeIndex = token.tokenData.homePathIndex! + 1;

      if (nextHomeIndex >= HOME_PATHS[color].length) {
        token.tokenData.state = "FINISHED";
        token.tokenData.isMoving = false;
        DiceStore.value = null;
        return;
      }

      token.tokenData.homePathIndex = nextHomeIndex;
      const cell = HOME_PATHS[color][nextHomeIndex];

      token.x = cell.x * CELL_SIZE + CELL_SIZE / 2;
      token.y = cell.y * CELL_SIZE + CELL_SIZE / 2;

      remaining--;
      setTimeout(nextStep, 200);
    }
  }

  nextStep();
}



function canEnterHomePath(token: TokenGraphic){
  return token.tokenData.roundsCompleted >= 1;
}

function moveAlongHomePath(token: TokenGraphic, steps: number) {
  let step = 0;

  function nextStep() {
    if (step >= steps) return;

    const nextHomeIndex = token.tokenData.homePathIndex! + 1;

    // FINISH
    if (nextHomeIndex >= HOME_PATHS[token.tokenData.color].length) {
      token.tokenData.state = "FINISHED";
      return;
    }

    token.tokenData.homePathIndex = nextHomeIndex;
    const cell = HOME_PATHS[token.tokenData.color][nextHomeIndex];

    token.x = cell.x * CELL_SIZE + CELL_SIZE / 2;
    token.y = cell.y * CELL_SIZE + CELL_SIZE / 2;

    step++;
    setTimeout(nextStep, 200);
  }

  nextStep();
}
