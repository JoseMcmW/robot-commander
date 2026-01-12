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
import type { Detection } from '@/types';

// Exported for use in other files
export interface OrchestrationResult {
  speechResult: SpeechResult;
  visionResult: VisionResult;
  plan: ActionPlan;
}

/**
 * Orquesta el flujo completo de procesamiento de un comando
 * Coordina los 4 agentes especializados en secuencia
 */
export async function orchestrateCommand(
  voiceCommand: string,
  detections: Detection[],
  robotState: { x: number; y: number; rotation: number },
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
    console.log('   Speech result:', speechResult);
    
    // ============================================
    // STEP 2: VISION AGENT
    // Analiza los objetos detectados por la cámara
    // IMPORTANTE: Pasar el target junto con las properties
    // ============================================
    onStatusUpdate('👁️ Analizando objetos detectados...');
    const targetProperties = { 
      ...speechResult.properties, 
      target: speechResult.target 
    };
    console.log('   Target properties para Vision:', targetProperties);
    const visionResult = await analyzeDetections(detections, targetProperties);
    console.log('   Vision result:', visionResult);
    
    // ============================================
    // STEP 3: PLANNER AGENT
    // Planifica la secuencia de acciones
    // ============================================
    onStatusUpdate('🧠 Planificando acciones...');
    
    // Si no se encontró el objeto, no planificar movimiento hacia él
    if (!visionResult.found) {
      const notFoundPlan: ActionPlan = {
        actions: [{ type: 'stop' }],
        reasoning: `No encontré "${visionResult.requestedTarget || speechResult.target}" en la escena`
      };
      onStatusUpdate(`⚠️ ${notFoundPlan.reasoning}`);
      return { speechResult, visionResult, plan: notFoundPlan };
    }
    
    const plan = await planAction(speechResult, visionResult, robotState);
    console.log('   Plan:', plan);
    
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
 */
export async function orchestrateSimpleCommand(
  action: 'forward' | 'backward' | 'left' | 'right' | 'stop',
  onStatusUpdate: (status: string) => void
): Promise<void> {
  const actionMap = {
    forward: [{ type: 'move_forward' as const, steps: 5 }],
    backward: [{ type: 'move_backward' as const, steps: 5 }],
    left: [{ type: 'turn_left' as const, amount: 45 }],
    right: [{ type: 'turn_right' as const, amount: 45 }],
    stop: [{ type: 'stop' as const }]
  };
  
  onStatusUpdate(`🤖 Ejecutando: ${action}`);
  await executeActions(actionMap[action]);
  onStatusUpdate('✅ Completado');
}