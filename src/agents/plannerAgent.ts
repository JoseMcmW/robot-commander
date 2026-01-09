// ============================================
// PLANNER AGENT - Planifica acciones del robot
// ============================================

import { callGemini, cleanJsonResponse } from './geminiClient';
import type { SpeechResult } from './speechAgent';
import type { VisionResult } from './visionAgent';
import { safeJsonParse } from '@/utils/safeJson';

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
 * Calcula el ángulo desde el robot hacia el objetivo
 */
function calculateTargetAngle(
  robotX: number,
  robotY: number,
  targetNormalizedX: number,
  targetNormalizedY: number
): number {
  // Convertir coordenadas normalizadas a coordenadas del canvas (600x600)
  const targetX = targetNormalizedX * 600;
  const targetY = targetNormalizedY * 600;
  
  // Calcular ángulo desde el robot hacia el objetivo
  const deltaX = targetX - robotX;
  const deltaY = targetY - robotY;
  
  // atan2 devuelve radianes, convertir a grados
  const angleRad = Math.atan2(deltaY, deltaX);
  const angleDeg = (angleRad * 180) / Math.PI;
  
  return angleDeg;
}

/**
 * Calcula la rotación necesaria para girar hacia el objetivo
 */
function calculateTurn(
  currentRotation: number,
  targetAngle: number
): { direction: 'left' | 'right'; amount: number } {
  let diff = targetAngle - currentRotation;
  
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  
  if (diff > 0) {
    return { direction: 'right', amount: Math.abs(diff) };
  } else {
    return { direction: 'left', amount: Math.abs(diff) };
  }
}

/**
 * Planifica la secuencia de acciones que debe realizar el robot
 */
export async function planAction(
  speechResult: SpeechResult,
  visionResult: VisionResult,
  robotState: { x: number; y: number; rotation: number }
): Promise<ActionPlan> {
  console.log('🧠 Planner Agent: Planificando acciones...');
  console.log('   Vision result:', visionResult);
  console.log('   Robot state:', robotState);

  // Si encontramos un objeto, calcular la ruta hacia él
  if (visionResult.found && visionResult.normalizedX !== undefined && visionResult.normalizedY !== undefined) {
    const targetAngle = calculateTargetAngle(
      robotState.x,
      robotState.y,
      visionResult.normalizedX,
      visionResult.normalizedY
    );
    
    console.log('   Target angle:', targetAngle);
    
    const turn = calculateTurn(robotState.rotation, targetAngle);
    const actions: RobotAction[] = [];
    
    console.log('   Turn needed:', turn);
    
    // Agregar giro si es necesario (más de 10 grados)
    if (turn.amount > 10) {
      actions.push({
        type: turn.direction === 'left' ? 'turn_left' : 'turn_right',
        amount: Math.round(turn.amount)
      });
    }
    
    // Agregar movimiento hacia adelante (8 pasos para acercarse más)
    actions.push({ type: 'move_forward', steps: 8 });
    
    const positionDesc = `${visionResult.position}${visionResult.verticalPosition ? `-${visionResult.verticalPosition}` : ''}`;
    
    console.log('   Actions planned:', actions);
    
    return {
      actions,
      reasoning: `Girando ${Math.round(turn.amount)}° y avanzando hacia ${visionResult.bestMatch} (${positionDesc})`
    };
  }

  // Fallback a Gemini para comandos más complejos
  const prompt = `Eres un planificador de movimientos para un robot.

Comando del usuario: ${JSON.stringify(speechResult)}
Análisis de visión: ${JSON.stringify(visionResult)}
Estado actual del robot: posición (${robotState.x}, ${robotState.y}), rotación ${robotState.rotation}°

Basándote en esta información, crea un plan de acciones simples para el robot.

Responde SOLO con un objeto JSON válido (sin markdown):
{
  "actions": [
    {"type": "turn_left", "amount": 30},
    {"type": "move_forward", "steps": 5}
  ],
  "reasoning": "breve explicación de 1 línea"
}

Tipos de acción disponibles:
- turn_left (amount: grados, ej: 30)
- turn_right (amount: grados, ej: 30)
- move_forward (steps: número, ej: 5)
- move_backward (steps: número, ej: 2)
- stop`;

  try {
    const response = await callGemini(prompt);
    const cleaned = cleanJsonResponse(response);
    const parsed = safeJsonParse<ActionPlan>(cleaned);
    
    console.log('✅ Planner Agent (Gemini):', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error en Planner Agent:', error);
    
    // Fallback inteligente basado en el comando
    const action = speechResult.action;
    let actions: RobotAction[] = [];
    let reasoning = 'Plan generado automáticamente';
    
    if (action === 'move_to' || action === 'search') {
      actions = [{ type: 'move_forward', steps: 5 }];
      reasoning = 'Avanzando hacia adelante';
    } else if (action === 'turn') {
      const direction = speechResult.properties?.direction;
      if (direction === 'left' || direction === 'izquierda') {
        actions = [{ type: 'turn_left', amount: 45 }];
        reasoning = 'Girando a la izquierda';
      } else if (direction === 'right' || direction === 'derecha') {
        actions = [{ type: 'turn_right', amount: 45 }];
        reasoning = 'Girando a la derecha';
      } else {
        actions = [{ type: 'turn_left', amount: 45 }];
        reasoning = 'Girando a la izquierda';
      }
    } else {
      actions = [{ type: 'stop' }];
      reasoning = 'Deteniendo el robot';
    }
    
    return { actions, reasoning };
  }
}