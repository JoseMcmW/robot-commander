// ============================================
// CENTRAL TYPE DEFINITIONS
// Tipos compartidos para todo el proyecto
// ============================================

import type { ColorAnalysis } from '@/ml/colorDetection';

// ============================================
// DETECTION TYPES (TensorFlow.js / ML)
// ============================================

/**
 * Representa una detección de objeto de TensorFlow.js COCO-SSD
 * con análisis de color enriquecido
 */
export interface Detection {
  /** Clase del objeto detectado (ej: 'person', 'car', 'bottle') */
  class: string;

  /** Confianza de la detección (0-1) */
  score: number;

  /** Bounding box: [x, y, width, height] */
  bbox: [number, number, number, number];

  /** Análisis de color opcional de la región detectada */
  colorAnalysis?: ColorAnalysis;
}

// ============================================
// SPEECH RECOGNITION API TYPES
// ============================================

/**
 * Resultado individual de reconocimiento de voz
 */
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/**
 * Lista de resultados de reconocimiento
 */
export interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

/**
 * Lista de todos los resultados
 */
export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/**
 * Evento de resultado de reconocimiento
 */
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

/**
 * Evento de error de reconocimiento
 */
export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: 
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';
  readonly message: string;
}

/**
 * API de reconocimiento de voz del navegador
 */
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  
  start(): void;
  stop(): void;
  abort(): void;
  
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

/**
 * Constructor de SpeechRecognition
 */
export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

/**
 * Extensión de Window para incluir SpeechRecognition
 */
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// ============================================
// AGENT TYPES
// ============================================

/**
 * Propiedades del objetivo que el robot debe buscar
 */
export interface TargetProperties {
  /** Nombre del objeto objetivo */
  target?: string;
  
  /** Color del objeto (ej: 'rojo', 'red') */
  color?: string;
  
  /** Dirección de movimiento */
  direction?: string;
  
  /** Propiedades adicionales */
  [key: string]: string | undefined;
}

// Re-export OrchestrationResult from orchestrator
export type { OrchestrationResult } from '@/agents/orchestrator';
