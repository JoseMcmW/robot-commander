export interface ColorAnalysis {
  r: number;
  g: number;
  b: number;
  redRatio: number; // fraction of pixels considered 'red'
  isRed: boolean;
}

/**
 * Analyze ImageData and return whether the region is mostly red.
 * Heuristic: count pixels where R is significantly greater than G and B.
 */
export function analyzeRegionColor(imageData: ImageData, threshold = 0.25): ColorAnalysis {
  const data = imageData.data;
  const pixelCount = data.length / 4;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let redCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    rSum += r;
    gSum += g;
    bSum += b;

    // Simple heuristic for red: r > 1.3*max(g,b) and r > 100
    const maxgb = g > b ? g : b;
    if (r > 1.3 * maxgb && r > 100) {
      redCount++;
    }
  }

  const avgR = Math.round(rSum / pixelCount);
  const avgG = Math.round(gSum / pixelCount);
  const avgB = Math.round(bSum / pixelCount);
  const redRatio = redCount / pixelCount;
  const isRed = redRatio >= threshold;

  return { r: avgR, g: avgG, b: avgB, redRatio, isRed };
}
