// ============================================
// SPEECH AGENT - Procesa comandos de voz
// ============================================

import { callGemini, cleanJsonResponse } from './geminiClient';
import { safeJsonParse } from '@/utils/safeJson';
import type { TargetProperties } from '@/types';

// Exportar el tipo
export interface SpeechResult {
  action: 'move_to' | 'turn' | 'search' | 'stop';
  target: string;
  properties: TargetProperties;
}

/**
 * Procesa un comando de voz y extrae la intención del usuario
 * @param transcript - Transcripción del comando de voz
 * @returns Objeto con la acción, target y propiedades
 */
export async function processSpeech(transcript: string): Promise<SpeechResult> {
  const prompt = `Analiza este comando de voz y extrae la información clave.
Comando: "${transcript}"

Responde SOLO con un objeto JSON válido (sin markdown, sin explicaciones):
{
  "action": "move_to" | "turn" | "search" | "stop",
  "target": "nombre del objeto o dirección",
  "properties": {"color": "rojo", "direction": "forward"}
}`;

  try {
    const response = await callGemini(prompt);
    const cleaned = cleanJsonResponse(response);
    const parsed = safeJsonParse(cleaned) as SpeechResult;

    console.log('✅ Speech Agent:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error en Speech Agent:', error);

    // Fallback inteligente
    return {
      action: 'move_to',
      target: 'forward',
      properties: { direction: 'forward' }
    };
  }
}