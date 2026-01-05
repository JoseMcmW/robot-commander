// ============================================
// ORCHESTRATOR - Coordina todos los agentes
// Implementa patrón LangGraph de multi-agentes
// ============================================

import { processSpeech } from './speechAgent';
import { analyzeDetections } from './visionAgent';
import { planAction } from './plannerAgent';
import type { SpeechResult } from './speechAgent';
import type { VisionResult } from './visionAgent';
import type { ActionPlan } from './plannerAgent';
import { executeActions } from './executorAgent';

export interface OrchestrationResult {
  speechResult: SpeechResult;
  visionResult: VisionResult;
  plan: ActionPlan;
}

/**
 * Orquesta el flujo completo de procesamiento de un comando
 * Coordina los 4 agentes especializados en secuencia
 * 
 * @param voiceCommand - Comando de voz del usuario
 * @param detections - Objetos detectados por la cámara
 * @param robotState - Estado actual del robot
 * @param onStatusUpdate - Callback para actualizar el estado en UI
 * @returns Resultado de la orquestación completa
 */
export async function orchestrateCommand(
  voiceCommand: string,
  detections: any[],
  robotState: any,
  onStatusUpdate: (status: string) => void
): Promise<OrchestrationResult> {
  console.log('🚀 Orchestrator: Iniciando procesamiento de comando');
  console.log('   Comando:', voiceCommand);
  console.log('   Objetos detectados:', detections.length);
  
  try {
    // ============================================
    // STEP 1: SPEECH AGENT
    // Procesa el comando de voz y extrae la intención
    // ============================================
    onStatusUpdate('🎤 Procesando comando de voz...');
    const speechResult = await processSpeech(voiceCommand);
    
    // ============================================
    // STEP 2: VISION AGENT
    // Analiza los objetos detectados por la cámara
    // ============================================
    onStatusUpdate('👁️ Analizando objetos detectados...');
    const visionResult = await analyzeDetections(detections, speechResult.properties);
    
    // ============================================
    // STEP 3: PLANNER AGENT
    // Planifica la secuencia de acciones basándose en:
    // - Intención del usuario (speech)
    // - Análisis del entorno (vision)
    // - Estado actual del robot
    // ============================================
    onStatusUpdate('🧠 Planificando acciones...');
    const plan = await planAction(speechResult, visionResult, robotState);
    
    // ============================================
    // STEP 4: EXECUTOR AGENT
    // Ejecuta las acciones planificadas
    // ============================================
    onStatusUpdate(`🤖 Ejecutando: ${plan.reasoning}`);
    await executeActions(plan.actions);
    
    onStatusUpdate('✅ Comando completado exitosamente');
    
    console.log('✅ Orchestrator: Procesamiento completo');
    return { speechResult, visionResult, plan };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    onStatusUpdate('❌ Error: ' + errorMsg);
    console.error('❌ Orchestrator: Error en procesamiento:', error);
    throw error;
  }
}

/**
 * Versión simplificada para testing
 * Ejecuta un comando predefinido sin procesamiento de voz
 */
export async function orchestrateSimpleCommand(
  action: 'forward' | 'backward' | 'left' | 'right' | 'stop',
  onStatusUpdate: (status: string) => void
): Promise<void> {
  const actionMap = {
    forward: [{ type: 'move_forward' as const, steps: 3 }],
    backward: [{ type: 'move_backward' as const, steps: 3 }],
    left: [{ type: 'turn_left' as const, amount: 45 }],
    right: [{ type: 'turn_right' as const, amount: 45 }],
    stop: [{ type: 'stop' as const }]
  };
  
  onStatusUpdate(`🤖 Ejecutando: ${action}`);
  await executeActions(actionMap[action]);
  onStatusUpdate('✅ Completado');
}