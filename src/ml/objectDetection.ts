import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-wasm';

export class ObjectDetector {
  private model: cocoSsd.ObjectDetection | null = null;

  async initialize() {
    // ⬇️ TIPADO CORRECTO
    setWasmPaths('/tfjs/');
    // Try to use WebGL for better performance, fall back to WASM, then CPU
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('🧠 TFJS backend set to', tf.getBackend());
    } catch (webglErr) {
      console.warn('⚠️ WebGL backend unavailable, falling back to WASM', webglErr);
      try {
        await tf.setBackend('wasm');
        await tf.ready();
        console.log('🧠 TFJS backend set to', tf.getBackend());
      } catch (wasmErr) {
        console.warn('⚠️ WASM backend failed, falling back to CPU', wasmErr);
        await tf.setBackend('cpu');
        await tf.ready();
        console.log('🧠 TFJS backend set to', tf.getBackend());
      }
    }

    this.model = await cocoSsd.load();
    console.log('✅ COCO-SSD Model loaded');
  }

  async detect(video: HTMLVideoElement) {
    if (!this.model) throw new Error('Model not loaded');
    return this.model.detect(video);
  }
}
