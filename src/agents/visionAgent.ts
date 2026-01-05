// ============================================
// VISION AGENT - Analiza objetos detectados
// ============================================

import { callGemini, cleanJsonResponse } from './geminiClient';

export interface VisionResult {
  found: boolean;
  bestMatch: string | null;
  confidence: number;
  position: 'left' | 'center' | 'right';
}

/**
 * Analiza los objetos detectados por la cámara y determina
 * si coinciden con lo que busca el usuario
 * @param detections - Array de objetos detectados por COCO-SSD
 * @param targetProperties - Propiedades del objeto buscado
 * @returns Resultado del análisis de visión
 */
export async function analyzeDetections(
  detections: any[],
  targetProperties: any
): Promise<VisionResult> {
  const detectedObjects = detections.map(d => d.class).join(', ');
  
  const prompt = `Objetos detectados por la cámara: ${detectedObjects || 'ninguno'}
Usuario busca: ${JSON.stringify(targetProperties)}

Analiza si alguno de los objetos detectados coincide con lo que busca el usuario.

Responde SOLO con un objeto JSON válido (sin markdown):
{
  "found": true o false,
  "bestMatch": "nombre del objeto más cercano",
  "confidence": 0.85,
  "position": "center"
}`;

  try {
    const response = await callGemini(prompt);
    const cleaned = cleanJsonResponse(response);
    const parsed = JSON.parse(cleaned);
    
    console.log('✅ Vision Agent:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error en Vision Agent:', error);
    
    // Fallback: usar primer objeto detectado
    return {
      found: detections.length > 0,
      bestMatch: detections[0]?.class || null,
      confidence: detections[0]?.score || 0.7,
      position: 'center'
    };
  }
}