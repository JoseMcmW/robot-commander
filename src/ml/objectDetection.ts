import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export class ObjectDetector {
  private model: cocoSsd.ObjectDetection | null = null;

  async initialize() {
    this.model = await cocoSsd.load();
    console.log('✅ COCO-SSD Model loaded');
  }

  async detect(videoElement: HTMLVideoElement) {
    if (!this.model) throw new Error('Model not loaded');
    return await this.model.detect(videoElement);
  }

  findObjectsByColor(predictions: any[], targetColor: string) {
    // Lógica simple: buscar objetos que típicamente son de ese color
    const colorMap: Record<string, string[]> = {
      red: ['apple', 'fire hydrant', 'stop sign'],
      blue: ['car', 'umbrella'],
      green: ['broccoli', 'plant'],
      yellow: ['banana', 'lemon']
    };

    return predictions.filter(p =>
      colorMap[targetColor]?.includes(p.class)
    );
  }
}