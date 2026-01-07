import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-wasm';

export class ObjectDetector {
  private model: cocoSsd.ObjectDetection | null = null;

  async initialize() {
    // ⬇️ TIPADO CORRECTO
    setWasmPaths('/tfjs/');

    await tf.setBackend('wasm');
    await tf.ready();

    console.log('🧠 TFJS backend:', tf.getBackend());

    this.model = await cocoSsd.load();
    console.log('✅ COCO-SSD Model loaded');
  }

  async detect(video: HTMLVideoElement) {
    if (!this.model) throw new Error('Model not loaded');
    return this.model.detect(video);
  }
}
