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
  console.log('🤖 Acciones a ejecutar:', JSON.stringify(actions));
  
  const store = useRobotStore.getState();
  
  for (const action of actions) {
    console.log('🤖 Ejecutando acción:', action.type, action);
    
    // Delay entre acciones para visualización
    await new Promise(resolve => setTimeout(resolve, 200));
    
    switch (action.type) {
      case 'move_forward':
        await executeMoveForward(store, action.steps || 3);
        break;
        
      case 'move_backward':
        await executeMoveBackward(store, action.steps || 3);
        break;
        
      case 'turn_left':
        await executeTurnLeft(store, action.amount || 45);
        break;
        
      case 'turn_right':
        await executeTurnRight(store, action.amount || 45);
        break;
        
      case 'stop':
        store.stop();
        console.log('  ⏸️ Robot detenido');
        break;
        
      default:
        console.warn(`  ⚠️ Acción desconocida: ${action.type}`);
    }
  }
  
  // Esperar un momento y resetear el estado a idle
  await new Promise(resolve => setTimeout(resolve, 300));
  store.stop();
  
  console.log('✅ Executor Agent: Todas las acciones completadas');
}

/**
 * Ejecuta movimiento hacia adelante
 */
async function executeMoveForward(store: ReturnType<typeof useRobotStore.getState>, steps: number): Promise<void> {
  console.log(`  ⬆️ Moviendo adelante ${steps} pasos`);
  for (let i = 0; i < steps; i++) {
    store.moveForward();
    await new Promise(r => setTimeout(r, 150));
  }
}

/**
 * Ejecuta movimiento hacia atrás
 */
async function executeMoveBackward(store: ReturnType<typeof useRobotStore.getState>, steps: number): Promise<void> {
  console.log(`  ⬇️ Moviendo atrás ${steps} pasos`);
  for (let i = 0; i < steps; i++) {
    store.moveBackward();
    await new Promise(r => setTimeout(r, 150));
  }
}

/**
 * Ejecuta giro a la izquierda
 */
async function executeTurnLeft(store: ReturnType<typeof useRobotStore.getState>, amount: number): Promise<void> {
  console.log(`  ⬅️ Girando izquierda ${amount}°`);
  // Cada llamada a turnLeft gira 20 grados (según el store)
  const steps = Math.ceil(amount / 20);
  for (let i = 0; i < steps; i++) {
    store.turnLeft();
    await new Promise(r => setTimeout(r, 80));
  }
}

/**
 * Ejecuta giro a la derecha
 */
async function executeTurnRight(store: ReturnType<typeof useRobotStore.getState>, amount: number): Promise<void> {
  console.log(`  ➡️ Girando derecha ${amount}°`);
  // Cada llamada a turnRight gira 20 grados (según el store)
  const steps = Math.ceil(amount / 20);
  for (let i = 0; i < steps; i++) {
    store.turnRight();
    await new Promise(r => setTimeout(r, 80));
  }
}