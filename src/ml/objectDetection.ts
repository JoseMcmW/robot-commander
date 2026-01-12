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
    // Configuraciones para mejor precisión
    tf.env().set('WEBGL_VERSION', 2);
    tf.env().set('WEBGL_CPU_FORWARD', false);
    tf.env().set('WEBGL_PACK', true); // Mejora performance en WebGL
    tf.env().set('WEBGL_FORCE_F16_TEXTURES', false); // Mejor precisión con F32

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

    // Cargar modelo COCO-SSD con configuración optimizada para mejor precisión
    // mobilenet_v2 es más preciso que mobilenet_v1 (default)
    this.model = await cocoSsd.load({
      base: 'mobilenet_v2', // Modelo más preciso (vs mobilenet_v1)
    });
    console.log('✅ COCO-SSD Model loaded (mobilenet_v2 - high accuracy)');
  }

  async detect(video: HTMLVideoElement) {
    if (!this.model) throw new Error('Model not loaded');

    // Configuración optimizada para mejor precisión
    return this.model.detect(video, 20, 0.5); // maxNumBoxes: 20, scoreThreshold: 0.5
  }
}
