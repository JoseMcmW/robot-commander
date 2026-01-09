import { useEffect, useRef } from 'react';
import { useRobotStore } from '@/store/useRobotStore';

export function RobotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    x, y, rotation, currentAction, 
    targetObject, targetNormalizedX, targetNormalizedY 
  } = useRobotStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CANVAS_SIZE = 600;

    // Clear canvas with dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid with subtle lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw target indicator if there's a target with normalized coordinates
    if (targetObject && targetNormalizedX !== null && targetNormalizedY !== null) {
      // Mapear coordenadas normalizadas de la cámara al canvas directamente
      // SIN inversión - izquierda en cámara = izquierda en canvas
      const targetX = targetNormalizedX * CANVAS_SIZE;
      const targetY = targetNormalizedY * CANVAS_SIZE;
      
      // Target glow
      const gradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 50);
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
      gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.2)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Target crosshair
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(targetX - 30, targetY);
      ctx.lineTo(targetX - 10, targetY);
      ctx.moveTo(targetX + 10, targetY);
      ctx.lineTo(targetX + 30, targetY);
      ctx.moveTo(targetX, targetY - 30);
      ctx.lineTo(targetX, targetY - 10);
      ctx.moveTo(targetX, targetY + 10);
      ctx.lineTo(targetX, targetY + 30);
      ctx.stroke();
      
      // Target label
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px Inter, Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`🎯 ${targetObject}`, targetX, targetY + 45);

      // Draw line from robot to target
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw robot shadow
    ctx.save();
    ctx.translate(x + 4, y + 4);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(-25, -20, 50, 40, 8);
    ctx.fill();
    ctx.restore();

    // Draw robot
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    // Robot body with gradient
    const bodyGradient = ctx.createLinearGradient(-25, -20, 25, 20);
    bodyGradient.addColorStop(0, '#3b82f6');
    bodyGradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.roundRect(-25, -20, 50, 40, 8);
    ctx.fill();

    // Robot border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wheels
    ctx.fillStyle = '#334155';
    ctx.fillRect(-28, -18, 6, 14);
    ctx.fillRect(-28, 4, 6, 14);
    ctx.fillRect(22, -18, 6, 14);
    ctx.fillRect(22, 4, 6, 14);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-8, -5, 6, 0, Math.PI * 2);
    ctx.arc(8, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (looking in direction of movement)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -5, 3, 0, Math.PI * 2);
    ctx.arc(10, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Mouth/speaker
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-10, 5, 20, 8, 2);
    ctx.fill();

    // Direction indicator (arrow in front)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(22, -8);
    ctx.lineTo(22, 8);
    ctx.closePath();
    ctx.fill();

    // Antenna
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, -32);
    ctx.stroke();
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -35, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Draw status panel
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 180, 45, 8);
    ctx.fill();
    
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Estado:', 20, 28);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Inter, Arial';
    ctx.fillText(currentAction, 20, 46);

    // Draw coordinates
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(CANVAS_SIZE - 120, 10, 110, 30, 8);
    ctx.fill();
    
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`X: ${Math.round(x)} Y: ${Math.round(y)}`, CANVAS_SIZE - 20, 30);

  }, [x, y, rotation, currentAction, targetObject, targetNormalizedX, targetNormalizedY]);

  return (
    <div className="border-2 border-blue-500/30 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="bg-slate-900"
      />
    </div>
  );
}