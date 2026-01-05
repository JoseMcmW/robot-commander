// ============================================
// BARREL EXPORT - Exporta todos los agentes
// ============================================

// Client
export { callGemini, cleanJsonResponse } from './geminiClient';

// Agents
export { processSpeech } from './speechAgent';
export type { SpeechResult } from './speechAgent';

export { analyzeDetections } from './visionAgent';
export type { VisionResult } from './visionAgent';

export { planAction } from './plannerAgent';
export type { RobotAction, ActionPlan } from './plannerAgent';

export { executeActions } from './executorAgent';

// Orchestrator
export { orchestrateCommand, orchestrateSimpleCommand } from './orchestrator';
export type { OrchestrationResult } from './orchestrator';