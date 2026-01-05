// ============================================
// PLANNER AGENT - Planifica acciones del robot
// ============================================

import { callGemini, cleanJsonResponse } from './geminiClient';
import type { SpeechResult } from './speechAgent';
import type { VisionResult } from './visionAgent';

export interface RobotAction {
  type: 'move_forward' | 'move_backward' | 'turn_left' | 'turn_right' | 'stop';
  steps?: number;
  amount?: number;
}

export interface ActionPlan {
  actions: RobotAction[];
  reasoning: string;
}

/**
 * Planifica la secuencia de acciones que debe realizar el robot
 * basándose en el comando de voz, análisis de visión y estado actual
 * @param speechResult - Resultado del Speech Agent
 * @param visionResult - Resultado del Vision Agent
 * @param robotState - Estado actual del robot (posición, rotación)
 * @returns Plan de acciones a ejecutar
 */
export async function planAction(
  speechResult: SpeechResult,
  visionResult: VisionResult,
  robotState: any
): Promise<ActionPlan> {
  const prompt = `Eres un planificador de movimientos para un robot.

Comando del usuario: ${JSON.stringify(speechResult)}
Análisis de visión: ${JSON.stringify(visionResult)}
Estado actual del robot: posición (${robotState.x}, ${robotState.y}), rotación ${robotState.rotation}°

Basándote en esta información, crea un plan de acciones simples para el robot.

Responde SOLO con un objeto JSON válido (sin markdown):
{
  "actions": [
    {"type": "turn_left", "amount": 30},
    {"type": "move_forward", "steps": 3}
  ],
  "reasoning": "breve explicación de 1 línea"
}

Tipos de acción disponibles:
- turn_left (amount: grados, ej: 30)
- turn_right (amount: grados, ej: 30)
- move_forward (steps: número, ej: 3)
- move_backward (steps: número, ej: 2)
- stop`;

  try {
    const response = await callGemini(prompt);
    const cleaned = cleanJsonResponse(response);
    const parsed = JSON.parse(cleaned);
    
    console.log('✅ Planner Agent:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error en Planner Agent:', error);
    
    // Fallback inteligente basado en el comando
    const action = speechResult.action;
    let actions: RobotAction[] = [];
    
    if (action === 'move_to' || action === 'search') {
      actions = [{ type: 'move_forward', steps: 3 }];
    } else if (action === 'turn') {
      const direction = speechResult.properties?.direction;
      if (direction === 'left' || direction === 'izquierda') {
        actions = [{ type: 'turn_left', amount: 45 }];
      } else if (direction === 'right' || direction === 'derecha') {
        actions = [{ type: 'turn_right', amount: 45 }];
      } else {
        actions = [{ type: 'turn_left', amount: 45 }];
      }
    } else {
      actions = [{ type: 'stop' }];
    }
    
    return {
      actions,
      reasoning: 'Plan generado automáticamente (fallback)'
    };
  }
}