import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-wasm';

export class ObjectDetector {
  private model: cocoSsd.ObjectDetection | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize() {
    // Evitar inicialización repetida (importante para React StrictMode)
    if (this.isInitialized) {
      console.log('🧠 TFJS already initialized, skipping');
      return;
    }

    // Si ya hay una inicialización en progreso, esperar a que termine
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async _doInitialize() {
    // Silenciar warnings de TensorFlow.js durante la inicialización de backends
    tf.env().set('WEBGL_VERSION', 2);
    tf.env().set('WEBGL_CPU_FORWARD', false);

    // Configurar WASM paths
    setWasmPaths('/tfjs/');

    // Intentar backends en orden: webgl → wasm → cpu
    const backends = ['webgl', 'wasm', 'cpu'] as const;
    let backendSet = false;

    for (const backend of backends) {
      // Guardar referencias originales de console
      const originalWarn = console.warn;
      const originalError = console.error;

      try {
        // Silenciar temporalmente los warnings de consola
        console.warn = () => { };
        console.error = () => { };

        await tf.setBackend(backend);
        await tf.ready();

        // Restaurar console
        console.warn = originalWarn;
        console.error = originalError;

        console.log(`🧠 TFJS backend set to: ${tf.getBackend()}`);
        backendSet = true;
        break;
      } catch (error) {
        // Restaurar console en caso de error
        console.warn = originalWarn;
        console.error = originalError;

        // Solo loggear si es el último intento
        if (backend === 'cpu') {
          console.warn(`⚠️ ${backend} backend failed:`, error);
        }
      }
    }

    if (!backendSet) {
      throw new Error('Failed to initialize any TensorFlow.js backend');
    }

    // Cargar modelo COCO-SSD
    this.model = await cocoSsd.load();
    console.log('✅ COCO-SSD Model loaded');
  }

  async detect(video: HTMLVideoElement) {
    if (!this.model) throw new Error('Model not loaded');
    return this.model.detect(video);
  }
}
