import { useEffect, useRef } from 'react';
import { useRobotStore } from '@/store/useRobotStore';

export function RobotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    x, y, rotation, currentAction,
    targetObject, targetNormalizedX, targetNormalizedY
  } = useRobotStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hacer el canvas responsive
    const updateCanvasSize = () => {
      const containerWidth = container.clientWidth;
      const size = Math.min(containerWidth, 600); // Max 600px
      canvas.width = size;
      canvas.height = size;
      drawRobot();
    };

    const drawRobot = () => {
      const CANVAS_SIZE = canvas.width;

      // Clear canvas with dark background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid with subtle lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = CANVAS_SIZE / 12;
      for (let i = 0; i < CANVAS_SIZE; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }

      // Scale factor for robot position
      const scale = CANVAS_SIZE / 600;
      const scaledX = x * scale;
      const scaledY = y * scale;

      // Draw target indicator if there's a target with normalized coordinates
      if (targetObject && targetNormalizedX !== null && targetNormalizedY !== null) {
        const targetX = targetNormalizedX * CANVAS_SIZE;
        const targetY = targetNormalizedY * CANVAS_SIZE;

        // Target glow
        const gradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 50 * scale);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.2)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 50 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Target crosshair
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 20 * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(targetX - 30 * scale, targetY);
        ctx.lineTo(targetX - 10 * scale, targetY);
        ctx.moveTo(targetX + 10 * scale, targetY);
        ctx.lineTo(targetX + 30 * scale, targetY);
        ctx.moveTo(targetX, targetY - 30 * scale);
        ctx.lineTo(targetX, targetY - 10 * scale);
        ctx.moveTo(targetX, targetY + 10 * scale);
        ctx.lineTo(targetX, targetY + 30 * scale);
        ctx.stroke();

        // Target label
        ctx.fillStyle = '#22c55e';
        ctx.font = `bold ${12 * scale}px Inter, Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`🎯 ${targetObject}`, targetX, targetY + 45 * scale);

        // Draw line from robot to target
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5 * scale, 5 * scale]);
        ctx.beginPath();
        ctx.moveTo(scaledX, scaledY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw robot shadow
      ctx.save();
      ctx.translate(scaledX + 4 * scale, scaledY + 4 * scale);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.roundRect(-25 * scale, -20 * scale, 50 * scale, 40 * scale, 8 * scale);
      ctx.fill();
      ctx.restore();

      // Draw robot
      ctx.save();
      ctx.translate(scaledX, scaledY);
      ctx.rotate((rotation * Math.PI) / 180);

      // Robot body with gradient
      const bodyGradient = ctx.createLinearGradient(-25 * scale, -20 * scale, 25 * scale, 20 * scale);
      bodyGradient.addColorStop(0, '#3b82f6');
      bodyGradient.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.roundRect(-25 * scale, -20 * scale, 50 * scale, 40 * scale, 8 * scale);
      ctx.fill();

      // Robot border
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#334155';
      ctx.fillRect(-28 * scale, -18 * scale, 6 * scale, 14 * scale);
      ctx.fillRect(-28 * scale, 4 * scale, 6 * scale, 14 * scale);
      ctx.fillRect(22 * scale, -18 * scale, 6 * scale, 14 * scale);
      ctx.fillRect(22 * scale, 4 * scale, 6 * scale, 14 * scale);

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-8 * scale, -5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.arc(8 * scale, -5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-6 * scale, -5 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.arc(10 * scale, -5 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Mouth/speaker
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-10 * scale, 5 * scale, 20 * scale, 8 * scale, 2 * scale);
      ctx.fill();

      // Direction indicator (arrow in front)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(30 * scale, 0);
      ctx.lineTo(22 * scale, -8 * scale);
      ctx.lineTo(22 * scale, 8 * scale);
      ctx.closePath();
      ctx.fill();

      // Antenna
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -32 * scale);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -35 * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw status panel
      const panelWidth = Math.min(180 * scale, CANVAS_SIZE * 0.35);
      const panelHeight = 45 * scale;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(10 * scale, 10 * scale, panelWidth, panelHeight, 8 * scale);
      ctx.fill();

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = `${12 * scale}px Inter, Arial`;
      ctx.textAlign = 'left';
      ctx.fillText('Estado:', 20 * scale, 28 * scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${14 * scale}px Inter, Arial`;
      ctx.fillText(currentAction, 20 * scale, 46 * scale);

      // Draw coordinates
      const coordWidth = Math.min(110 * scale, CANVAS_SIZE * 0.25);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(CANVAS_SIZE - coordWidth - 10 * scale, 10 * scale, coordWidth, 30 * scale, 8 * scale);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = `${11 * scale}px monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(`X: ${Math.round(x)} Y: ${Math.round(y)}`, CANVAS_SIZE - 20 * scale, 30 * scale);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [x, y, rotation, currentAction, targetObject, targetNormalizedX, targetNormalizedY]);

  return (
    <div ref={containerRef} className="border-2 border-blue-500/30 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10 w-full">
      <canvas
        ref={canvasRef}
        className="bg-slate-900 w-full h-auto"
      />
    </div>
  );
}