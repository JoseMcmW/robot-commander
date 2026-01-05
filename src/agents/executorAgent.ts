// ============================================
// EXECUTOR AGENT - Ejecuta acciones en el robot
// ============================================

import { useRobotStore } from '../store/useRobotStore';
import type { RobotAction } from './plannerAgent';

/**
 * Ejecuta una secuencia de acciones en el robot simulado
 * @param actions - Array de acciones a ejecutar
 */
export async function executeActions(actions: RobotAction[]): Promise<void> {
  console.log('🤖 Executor Agent: Iniciando ejecución de', actions.length, 'acciones');
  
  const store = useRobotStore.getState();
  
  for (const action of actions) {
    // Delay entre acciones para visualización
    await new Promise(resolve => setTimeout(resolve, 300));
    
    switch (action.type) {
      case 'move_forward':
        await executeMoveForward(store, action.steps || 1);
        break;
        
      case 'move_backward':
        await executeMoveBackward(store, action.steps || 1);
        break;
        
      case 'turn_left':
        await executeTurnLeft(store, action.amount || 15);
        break;
        
      case 'turn_right':
        await executeTurnRight(store, action.amount || 15);
        break;
        
      case 'stop':
        store.stop();
        console.log('  ⏸️ Robot detenido');
        break;
        
      default:
        console.warn(`  ⚠️ Acción desconocida: ${action.type}`);
    }
  }
  
  console.log('✅ Executor Agent: Todas las acciones completadas');
}

/**
 * Ejecuta movimiento hacia adelante
 */
async function executeMoveForward(store: any, steps: number): Promise<void> {
  console.log(`  ⬆️ Moviendo adelante ${steps} pasos`);
  for (let i = 0; i < steps; i++) {
    store.moveForward();
    await new Promise(r => setTimeout(r, 200));
  }
}

/**
 * Ejecuta movimiento hacia atrás
 */
async function executeMoveBackward(store: any, steps: number): Promise<void> {
  console.log(`  ⬇️ Moviendo atrás ${steps} pasos`);
  for (let i = 0; i < steps; i++) {
    store.moveBackward();
    await new Promise(r => setTimeout(r, 200));
  }
}

/**
 * Ejecuta giro a la izquierda
 */
async function executeTurnLeft(store: any, amount: number): Promise<void> {
  console.log(`  ⬅️ Girando izquierda ${amount}°`);
  const steps = Math.ceil(amount / 15);
  for (let i = 0; i < steps; i++) {
    store.turnLeft();
    await new Promise(r => setTimeout(r, 100));
  }
}

/**
 * Ejecuta giro a la derecha
 */
async function executeTurnRight(store: any, amount: number): Promise<void> {
  console.log(`  ➡️ Girando derecha ${amount}°`);
  const steps = Math.ceil(amount / 15);
  for (let i = 0; i < steps; i++) {
    store.turnRight();
    await new Promise(r => setTimeout(r, 100));
  }
}