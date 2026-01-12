import { create } from 'zustand';

interface RobotState {
  x: number;
  y: number;
  rotation: number;
  isMoving: boolean;
  currentAction: string;
  commandHistory: string[];
  // Campos para feedback visual
  targetObject: string | null;
  targetPosition: 'left' | 'center' | 'right' | null;
  targetVerticalPosition: 'top' | 'middle' | 'bottom' | null;
  // Coordenadas normalizadas del target (para posición exacta en canvas)
  targetNormalizedX: number | null;
  targetNormalizedY: number | null;
  lastReasoning: string | null;
}

interface RobotActions {
  moveForward: () => void;
  moveBackward: () => void;
  turnLeft: () => void;
  turnRight: () => void;
  stop: () => void;
  addCommand: (cmd: string) => void;
  setTarget: (
    object: string | null,
    position: 'left' | 'center' | 'right' | null,
    verticalPosition?: 'top' | 'middle' | 'bottom' | null,
    normalizedX?: number | null,
    normalizedY?: number | null
  ) => void;
  setReasoning: (reasoning: string | null) => void;
  clearTarget: () => void;
}

export const useRobotStore = create<RobotState & RobotActions>((set) => ({
  x: 300,
  y: 450, // Empieza más abajo para poder moverse hacia arriba
  rotation: -90, // Apuntando hacia arriba inicialmente
  isMoving: false,
  currentAction: 'Listo 🤖',
  commandHistory: [],
  targetObject: null,
  targetPosition: null,
  targetVerticalPosition: null,
  targetNormalizedX: null,
  targetNormalizedY: null,
  lastReasoning: null,

  moveForward: () => set((state) => {
    const rad = (state.rotation * Math.PI) / 180;
    const newX = Math.max(40, Math.min(560, state.x + Math.cos(rad) * 30));
    const newY = Math.max(40, Math.min(560, state.y + Math.sin(rad) * 30));
    return {
      x: newX,
      y: newY,
      isMoving: true,
      currentAction: 'Avanzando ⬆️'
    };
  }),

  moveBackward: () => set((state) => {
    const rad = (state.rotation * Math.PI) / 180;
    const newX = Math.max(40, Math.min(560, state.x - Math.cos(rad) * 30));
    const newY = Math.max(40, Math.min(560, state.y - Math.sin(rad) * 30));
    return {
      x: newX,
      y: newY,
      isMoving: true,
      currentAction: 'Retrocediendo ⬇️'
    };
  }),

  turnLeft: () => set((state) => ({
    rotation: state.rotation - 20,
    currentAction: 'Girando ⬅️'
  })),

  turnRight: () => set((state) => ({
    rotation: state.rotation + 20,
    currentAction: 'Girando ➡️'
  })),

  stop: () => set({
    isMoving: false,
    currentAction: 'Listo 🤖'
  }),

  addCommand: (cmd) => set((state) => ({
    commandHistory: [...state.commandHistory, cmd].slice(-10)
  })),

  setTarget: (object, position, verticalPosition = null, normalizedX = null, normalizedY = null) => set({
    targetObject: object,
    targetPosition: position,
    targetVerticalPosition: verticalPosition,
    targetNormalizedX: normalizedX,
    targetNormalizedY: normalizedY
  }),

  setReasoning: (reasoning) => set({
    lastReasoning: reasoning
  }),

  clearTarget: () => set({
    targetObject: null,
    targetPosition: null,
    targetVerticalPosition: null,
    targetNormalizedX: null,
    targetNormalizedY: null
  })
}));