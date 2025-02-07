export function getFilledBackgroundPicture(
  width: number,
  height: number,
  cellSize: number,
): HTMLCanvasElement {
  const backgroundCanvas: HTMLCanvasElement = document.createElement("canvas");
  const canvasContext: CanvasRenderingContext2D = backgroundCanvas.getContext("2d");

  backgroundCanvas.width = width;
  backgroundCanvas.height = height;

  drawBackgroundColor(canvasContext, width, height);
  drawBorder(canvasContext, width, height)
  drawDotInTheCenter(canvasContext, width, height);
  drawCell(canvasContext, width, height, cellSize);

  return backgroundCanvas;
}

function drawBackgroundColor(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  canvasContext.fillStyle = '#F9F9F9';
  canvasContext.fillRect(0, 0, width, height);
}

function drawBorder(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  canvasContext.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  canvasContext.lineWidth = 3;
  canvasContext.setLineDash([5, 10]);
  canvasContext.strokeRect(0, 0, width, height,)
  canvasContext.setLineDash([]);
  canvasContext.lineWidth = 1;
}

function drawDotInTheCenter(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  canvasContext.beginPath();
  canvasContext.fillStyle = 'grey';
  canvasContext.arc(
    width / 2,
    height / 2,
    3,
    0,
    2 * Math.PI,
    true
  );
  canvasContext.fill();
}

function drawCell(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
): void {
  canvasContext.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  canvasContext.lineWidth = 2;

  for (let i: number = 0; i <= width; i+= cellSize) {
    canvasContext.beginPath();
    canvasContext.moveTo(i, 0);
    canvasContext.lineTo(i, height);
    canvasContext.stroke();
  }

  for (let i: number = 0; i <= height; i+= cellSize) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, i);
    canvasContext.lineTo(width, i);
    canvasContext.stroke();
  }
}
