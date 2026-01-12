// ============================================
// VISION AGENT - Analiza objetos detectados
// ============================================

import type { Detection, TargetProperties } from '@/types';

export interface VisionResult {
  found: boolean;
  bestMatch: string | null;
  confidence: number;
  position: 'left' | 'center' | 'right';
  verticalPosition: 'top' | 'middle' | 'bottom';
  normalizedX: number;
  normalizedY: number;
  requestedTarget?: string; // Qué pidió el usuario
}

// Constantes del video
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

/**
 * Calcula la posición del objeto en la imagen
 */
function calculatePosition(bbox: number[]): {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'middle' | 'bottom';
  normalizedX: number;
  normalizedY: number;
} {
  const [x, y, width, height] = bbox;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const horizontal = centerX < VIDEO_WIDTH * 0.33 ? 'left'
                    : centerX > VIDEO_WIDTH * 0.66 ? 'right'
                    : 'center';

  const vertical = centerY < VIDEO_HEIGHT * 0.33 ? 'top'
                  : centerY > VIDEO_HEIGHT * 0.66 ? 'bottom'
                  : 'middle';

  const normalizedX = centerX / VIDEO_WIDTH;
  const normalizedY = centerY / VIDEO_HEIGHT;

  return { horizontal, vertical, normalizedX, normalizedY };
}

// Mapa de traducciones español -> COCO class names
const SPANISH_TO_COCO: Record<string, string> = {
  persona: 'person',
  gente: 'person',
  coche: 'car',
  auto: 'car',
  carro: 'car',
  perro: 'dog',
  gato: 'cat',
  televisor: 'tv',
  television: 'tv',
  tele: 'tv',
  celular: 'cell phone',
  telefono: 'cell phone',
  movil: 'cell phone',
  laptop: 'laptop',
  computadora: 'laptop',
  ordenador: 'laptop',
  silla: 'chair',
  mesa: 'dining table',
  botella: 'bottle',
  libro: 'book',
  mochila: 'backpack',
  taza: 'cup',
  inodoro: 'toilet',
  bano: 'toilet',
  sofa: 'couch',
  sillon: 'couch',
  cama: 'bed',
  reloj: 'clock',
};

/**
 * Analiza los objetos detectados por la cámara
 */
export async function analyzeDetections(
  detections: Detection[],
  targetProperties: TargetProperties
): Promise<VisionResult> {
  console.log('👁️ Vision Agent: Analizando detecciones...');
  console.log('   Objetos detectados:', detections.map(d => d.class).join(', '));
  console.log('   Target properties:', targetProperties);

  const targetNameRaw = (targetProperties?.target || '')?.toString().toLowerCase().trim();
  const colorRaw = (targetProperties?.color || '')?.toString().toLowerCase().trim();

  // Si no hay target específico, devolver no encontrado
  if (!targetNameRaw && !colorRaw) {
    console.log('   ⚠️ No hay target específico, no se puede buscar');
    return {
      found: false,
      bestMatch: null,
      confidence: 0,
      position: 'center',
      verticalPosition: 'middle',
      normalizedX: 0.5,
      normalizedY: 0.5,
      requestedTarget: 'ninguno'
    };
  }

  // Traducir el target al nombre COCO
  const mappedName = SPANISH_TO_COCO[targetNameRaw] || targetNameRaw;
  console.log('   Target traducido:', targetNameRaw, '->', mappedName);

  // Buscar coincidencia exacta por nombre
  if (mappedName) {
    const candidates = detections.filter(d => {
      const detectedClass = (d.class || '').toString().toLowerCase();
      return detectedClass.includes(mappedName) || mappedName.includes(detectedClass);
    });

    console.log('   Candidatos encontrados:', candidates.length);

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      const posInfo = calculatePosition(best.bbox);

      console.log('   ✅ Encontrado:', best.class, 'en', posInfo.horizontal, '-', posInfo.vertical);

      return {
        found: true,
        bestMatch: best.class,
        confidence: best.score || 0.8,
        position: posInfo.horizontal,
        verticalPosition: posInfo.vertical,
        normalizedX: posInfo.normalizedX,
        normalizedY: posInfo.normalizedY,
        requestedTarget: targetNameRaw
      };
    }
  }

  // Buscar por color si se especificó
  if (colorRaw) {
    const isRedQuery = colorRaw.includes('rojo') || colorRaw.includes('red');
    if (isRedQuery) {
      const redCandidates = detections.filter(d => d.colorAnalysis?.isRed);
      if (redCandidates.length > 0) {
        redCandidates.sort((a, b) => b.score - a.score);
        const best = redCandidates[0];
        const posInfo = calculatePosition(best.bbox);
        return {
          found: true,
          bestMatch: best.class,
          confidence: best.score || 0.75,
          position: posInfo.horizontal,
          verticalPosition: posInfo.vertical,
          normalizedX: posInfo.normalizedX,
          normalizedY: posInfo.normalizedY,
          requestedTarget: `objeto ${colorRaw}`
        };
      }
    }
  }

  // NO ENCONTRADO - No usar fallback a cualquier objeto
  // El usuario pidió algo específico que no está en la escena
  console.log('   ❌ No se encontró:', targetNameRaw || colorRaw);
  console.log('   Objetos disponibles:', detections.map(d => d.class).join(', '));

  return {
    found: false,
    bestMatch: null,
    confidence: 0,
    position: 'center',
    verticalPosition: 'middle',
    normalizedX: 0.5,
    normalizedY: 0.5,
    requestedTarget: targetNameRaw || colorRaw
  };
}