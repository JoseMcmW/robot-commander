import { create } from 'zustand';

interface RobotState {
  x: number;
  y: number;
  rotation: number;
  isMoving: boolean;
  currentAction: string;
  commandHistory: string[];
}

interface RobotActions {
  moveForward: () => void;
  moveBackward: () => void;
  turnLeft: () => void;
  turnRight: () => void;
  stop: () => void;
  addCommand: (cmd: string) => void;
}

export const useRobotStore = create<RobotState & RobotActions>((set) => ({
  x: 300,
  y: 300,
  rotation: 0,
  isMoving: false,
  currentAction: 'idle',
  commandHistory: [],

  moveForward: () => set((state) => {
    const rad = (state.rotation * Math.PI) / 180;
    return {
      x: state.x + Math.cos(rad) * 20,
      y: state.y + Math.sin(rad) * 20,
      isMoving: true,
      currentAction: 'forward'
    };
  }),

  moveBackward: () => set((state) => {
    const rad = (state.rotation * Math.PI) / 180;
    return {
      x: state.x - Math.cos(rad) * 20,
      y: state.y - Math.sin(rad) * 20,
      isMoving: true,
      currentAction: 'backward'
    };
  }),

  turnLeft: () => set((state) => ({
    rotation: state.rotation - 15,
    currentAction: 'turn-left'
  })),

  turnRight: () => set((state) => ({
    rotation: state.rotation + 15,
    currentAction: 'turn-right'
  })),

  stop: () => set({ isMoving: false, currentAction: 'idle' }),

  addCommand: (cmd) => set((state) => ({
    commandHistory: [...state.commandHistory, cmd].slice(-10)
  }))
}));